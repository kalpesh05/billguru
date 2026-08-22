# BillGuru AI — Detailed Explanation Document

Version 1.0 | Companion to PRD

---

## 1. Purpose of This Document

This document walks through exactly how the product works end-to-end — every feature, every user flow, and the reasoning behind key decisions — so any team member or agent can understand the product without needing the original conversation context.

## 2. User Personas

### Persona A: Rajesh — CA managing 80 small business clients
- Currently uses Tally + WhatsApp groups to collect invoices manually from clients
- Spends 15–20 hours/month chasing clients for missing invoices and fixing GSTIN errors
- Wants: fewer manual errors, early visibility into mismatches, less time on repetitive data entry

### Persona B: Meena — Kirana (grocery) shop owner
- No accounting background, uses WhatsApp daily for business
- Currently hands a shoebox of paper invoices to her CA monthly
- Wants: minimum effort, doesn't want to learn new software

## 3. End-to-End Flow

### Step 1: Onboarding
- CA signs up on web dashboard, adds client businesses (name, GSTIN, WhatsApp number)
- System sends each client a WhatsApp opt-in message: "Your CA [name] has added you to BillGuru AI. Forward invoice photos here and we'll handle the rest."

### Step 2: Invoice Capture
- Business owner photographs or forwards a PDF invoice via WhatsApp
- Bot acknowledges receipt immediately: "Got it! Processing..."
- No manual data entry required from the business owner

### Step 3: AI Extraction
- Image/PDF sent to extraction pipeline (Claude via Bedrock, vision + structured output)
- Extracts: vendor name, GSTIN, invoice number, date, taxable amount, tax rates (CGST/SGST/IGST), HSN/SAC code, total
- Each field gets a confidence score
- Low-confidence fields (<0.7) trigger a WhatsApp follow-up: "Couldn't clearly read the GSTIN on this invoice — can you confirm or resend a clearer photo?"

### Step 4: Validation & Flagging
- Extracted GSTIN checked against GST portal (via GSTIN validation API) — cached to avoid repeat calls
- System checks:
  - Is GSTIN active (not cancelled/suspended)?
  - Does tax rate match expected rate for the HSN/SAC code?
  - Is this a duplicate invoice (same vendor + invoice number)?
- Issues are logged as flags with severity (low/medium/high)

### Step 5: Monthly Reconciliation
- At month-end, system compares captured invoices against what's actually filed in GSTR-1/3B (CA uploads filing data or connects via GST Suvidha Provider API in Phase 2)
- Discrepancies surfaced in CA dashboard: "12 invoices captured, only 9 appear in draft GSTR-3B — 3 missing, potential ₹8,400 ITC loss"

### Step 6: CA Review & Action
- CA dashboard shows all clients, sorted by flagged issue count
- CA can bulk-approve confirmed invoices, request client resend on flagged ones, export reconciled data to their existing filing software

## 4. Feature Details

### 4.1 WhatsApp Bot
- Built on WhatsApp Business Cloud API (Meta)
- Stateless conversation design — each message is self-contained (photo in → extraction status out)
- Fallback to human review link if bot can't parse intent

### 4.2 Confidence-Based Review Queue
- This is the core trust mechanism. Rather than the AI silently guessing on unclear data (which is dangerous for tax compliance), anything below a confidence threshold routes to explicit human confirmation.
- This trades a small amount of user friction for accuracy — critical given the financial stakes of GST errors.

### 4.3 GSTIN Validation
- Public GST portal search API checked on every new vendor GSTIN
- Results cached (GSTIN status doesn't change often) to control API costs and latency

### 4.4 CA Multi-Client Dashboard
- Single pane of glass across all managed businesses
- Prioritized by issue severity, not alphabetically — CA's time is the scarcest resource in this system

## 5. What Makes This Different From Simple OCR Tools

Generic invoice OCR tools (many exist) extract text but don't understand *GST-specific* logic — they don't know what a valid GSTIN checksum looks like, don't cross-reference HSN/SAC expected rates, and don't think in terms of "will this cause an ITC rejection." This product is built specifically around the compliance outcome, not just data extraction.

## 6. Phase 2+ Ideas (Not in MVP)

- Direct GSTR filing integration via GST Suvidha Provider (GSP) APIs
- Predictive alerts ("Your ITC claim this quarter is 15% lower than last quarter — check for missing invoices")
- Vendor scorecards (which vendors consistently send GST-compliant invoices)
- Regional language support (Gujarati, Hindi) for the WhatsApp bot itself
