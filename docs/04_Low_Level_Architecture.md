# BillGuru AI — Low-Level Architecture Design Document

Version 1.0 | Audience: Implementation engineers

---

## 1. Database Schema (MySQL)

```sql
CREATE TABLE businesses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  gstin VARCHAR(15) UNIQUE,
  ca_id INT NULL,
  whatsapp_number VARCHAR(15) UNIQUE,
  onboarding_status ENUM('invited','opted_in','active') DEFAULT 'invited',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ca_id) REFERENCES accountants(id)
);

CREATE TABLE accountants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  firm_name VARCHAR(255),
  phone VARCHAR(15) UNIQUE,
  plan_tier ENUM('trial','starter','pro') DEFAULT 'trial',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  business_id INT NOT NULL,
  source_type ENUM('whatsapp','web_upload') DEFAULT 'whatsapp',
  file_url VARCHAR(500),
  vendor_name VARCHAR(255),
  vendor_gstin VARCHAR(15),
  invoice_number VARCHAR(100),
  invoice_date DATE,
  taxable_amount DECIMAL(12,2),
  cgst_rate DECIMAL(5,2), cgst_amount DECIMAL(12,2),
  sgst_rate DECIMAL(5,2), sgst_amount DECIMAL(12,2),
  igst_rate DECIMAL(5,2), igst_amount DECIMAL(12,2),
  total_amount DECIMAL(12,2),
  hsn_sac_code VARCHAR(10),
  extraction_confidence DECIMAL(3,2),
  extraction_status ENUM('pending','extracted','needs_review','confirmed') DEFAULT 'pending',
  raw_llm_response JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id),
  INDEX idx_business_date (business_id, invoice_date),
  INDEX idx_status (extraction_status)
);

CREATE TABLE gstin_validations (
  gstin VARCHAR(15) PRIMARY KEY,
  is_valid BOOLEAN,
  status VARCHAR(50),
  legal_name VARCHAR(255),
  last_checked TIMESTAMP,
  INDEX idx_last_checked (last_checked)
);

CREATE TABLE reconciliation_flags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_id INT NOT NULL,
  flag_type ENUM('gstin_invalid','slab_mismatch','duplicate_invoice','missing_itc','gstr_mismatch'),
  severity ENUM('low','medium','high'),
  message TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id),
  INDEX idx_invoice (invoice_id),
  INDEX idx_unresolved (resolved, severity)
);

CREATE TABLE gstr_filings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  business_id INT NOT NULL,
  return_type ENUM('GSTR1','GSTR3B'),
  period VARCHAR(7),
  filed_data JSON,
  filed_at TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id),
  UNIQUE KEY uq_business_period (business_id, return_type, period)
);

CREATE TABLE hsn_sac_rates (
  hsn_sac_code VARCHAR(10) PRIMARY KEY,
  description VARCHAR(255),
  expected_gst_rate DECIMAL(5,2),
  last_updated TIMESTAMP
);
```

## 2. Extraction Pipeline Detail

### 2.1 Structured Output Schema

```javascript
const invoiceExtractionSchema = {
  name: "invoice_extraction",
  schema: {
    type: "object",
    properties: {
      vendor_name: { type: "string" },
      vendor_gstin: {
        type: ["string", "null"],
        pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$"
      },
      invoice_number: { type: "string" },
      invoice_date: { type: "string", format: "date" },
      taxable_amount: { type: "number" },
      cgst_rate: { type: ["number", "null"] },
      cgst_amount: { type: ["number", "null"] },
      sgst_rate: { type: ["number", "null"] },
      sgst_amount: { type: ["number", "null"] },
      igst_rate: { type: ["number", "null"] },
      igst_amount: { type: ["number", "null"] },
      total_amount: { type: "number" },
      hsn_sac_code: { type: ["string", "null"] },
      confidence: { type: "number", minimum: 0, maximum: 1 },
      extraction_notes: { type: "string" }
    },
    required: ["vendor_name", "invoice_number", "invoice_date", "taxable_amount", "total_amount", "confidence"]
  }
};
```

### 2.2 System Prompt

> "Extract invoice details from the image. This is for GST compliance in India — accuracy on GSTIN, tax rates, and HSN/SAC code matters more than speed. If any field is unclear or the image quality is poor, set confidence below 0.7 and explain in extraction_notes rather than guessing. Never invent a GSTIN — if unreadable, return null."

### 2.3 LLM Router Logic (pseudocode)

```javascript
async function extractInvoice(imageUrl) {
  const providers = ['bedrock-claude', 'openai-gpt4v'];
  for (const provider of providers) {
    try {
      const result = await callProvider(provider, imageUrl, invoiceExtractionSchema, { timeoutMs: 15000 });
      if (result.confidence !== undefined) return { ...result, provider };
    } catch (err) {
      logProviderFailure(provider, err);
      continue; // fallback to next provider
    }
  }
  throw new Error('All extraction providers failed');
}
```

- Primary: AWS Bedrock (Claude, vision-capable model)
- Fallback: OpenAI GPT-4V equivalent, triggered on timeout or error
- Both use the same JSON schema to keep downstream processing provider-agnostic — this mirrors the `llmClient.js` abstraction pattern

## 3. API Contracts

### 3.1 WhatsApp Webhook Receiver
```
POST /webhooks/whatsapp
Body: { from: string, media_url: string, message_type: 'image' | 'document' }
Response: 200 OK (must respond within 5s per Meta requirement)
```

### 3.2 Internal: Trigger Extraction Job
```
Enqueued to SQS: {
  invoice_id: int,
  s3_key: string,
  business_id: int,
  retry_count: 0
}
```

### 3.3 CA Dashboard — Get Client Issues
```
GET /api/ca/:caId/flags?severity=high&resolved=false
Response: [{
  invoice_id, business_name, flag_type, severity, message, invoice_date
}]
```

### 3.4 GSTIN Validation Service
```
GET /api/gstin/validate/:gstin
// Checks cache first (gstin_validations table, TTL 30 days)
// On miss, calls external GST portal search API
Response: { gstin, is_valid, status, legal_name, cached: boolean }
```

## 4. Error Handling & Edge Cases

| Scenario | Handling |
|---|---|
| Blurry/unreadable image | confidence < 0.7 → `needs_review`, WhatsApp reprompt for clearer photo |
| Both LLM providers fail | Job retried 3x with backoff, then flagged for manual ops review |
| GSTIN portal API down | Serve last cached validation with `stale: true` flag, retry in background |
| Duplicate invoice (same vendor + invoice number) | Flagged as `duplicate_invoice`, not auto-rejected — user confirms intent |
| WhatsApp opt-out | `businesses.onboarding_status` set to inactive, stop processing incoming media |

## 5. Reconciliation Job (Scheduled)

Runs monthly (configurable, e.g. 3 days before GSTR-3B deadline):

```javascript
async function runReconciliation(businessId, period) {
  const capturedInvoices = await getInvoices(businessId, period);
  const filedData = await getGstrFiling(businessId, 'GSTR3B', period);
  const missing = capturedInvoices.filter(inv => !filedData.includes(inv.invoice_number));
  for (const inv of missing) {
    await createFlag(inv.id, 'missing_itc', 'high',
      `Invoice not found in filed GSTR-3B — potential ITC loss of ₹${inv.total_amount}`);
  }
}
```

## 6. Frontend (CA Dashboard) — Key Views

1. **Client list** — sorted by unresolved high-severity flag count
2. **Invoice review queue** — needs_review items requiring confirmation
3. **Monthly reconciliation report** — per business, exportable to CSV/PDF
4. **Flag detail view** — drill into specific issue with original invoice image side-by-side

## 7. Testing Strategy

- Unit tests: schema validation, GSTIN checksum logic, slab-matching logic
- Integration tests: mock LLM provider responses (including deliberately low-confidence cases) through full pipeline
- Load test: simulate 500 concurrent WhatsApp webhook events (month-end invoice rush is expected peak)
