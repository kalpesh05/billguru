# BillGuru AI — High-Level Architecture Design Document

Version 1.0 | Audience: Engineering leads, technical stakeholders

---

## 1. Architecture Principles

- **WhatsApp-first**: no native app for end business owners; minimize friction
- **Confidence-gated automation**: never silently guess on financially-consequential fields
- **Multi-provider LLM resilience**: don't hard-depend on a single AI provider (mirrors existing Myra pattern — classifier/resolver routing across Anthropic/OpenAI/Bedrock)
- **Async-first processing**: invoice processing happens in background jobs, not blocking the WhatsApp response

## 2. System Components

```
┌─────────────────┐
│  WhatsApp Business │
│   Cloud API (Meta)  │
└─────────┬────────┘
          │ webhook (photo/PDF in, message out)
          ▼
┌─────────────────────────┐
│   API Gateway / Node.js   │
│   Express Backend (ECS)   │
└─────────┬────────────────┘
          │
    ┌─────┴─────┬───────────────┬─────────────────┐
    ▼           ▼               ▼                 ▼
┌────────┐ ┌──────────┐  ┌──────────────┐  ┌──────────────┐
│  S3     │ │ SQS Queue │  │ LLM Router    │  │ GSTIN         │
│ (raw    │ │ (async    │  │ (Bedrock/     │  │ Validation    │
│ images) │ │ extraction│  │ Anthropic/    │  │ Service       │
│         │ │ jobs)     │  │ OpenAI)       │  │ (external API)│
└────────┘ └─────┬─────┘  └──────┬───────┘  └──────┬───────┘
                  │               │                  │
                  └───────┬───────┴──────────┬───────┘
                          ▼                  ▼
                  ┌──────────────┐   ┌──────────────┐
                  │  MySQL (RDS)  │   │ Reconciliation│
                  │  Invoice data │   │ Engine (cron/ │
                  │               │   │  scheduled)   │
                  └──────┬───────┘   └──────┬───────┘
                         │                  │
                         └────────┬─────────┘
                                  ▼
                        ┌──────────────────┐
                        │  CA Web Dashboard  │
                        │  (React frontend)   │
                        └──────────────────┘
```

## 3. Component Responsibilities

| Component | Responsibility | Tech Choice | Rationale |
|---|---|---|---|
| WhatsApp Gateway | Receive/send messages, media | Meta Cloud API | Free tier sufficient for MVP volume |
| Backend API | Webhook handling, business logic, auth | Node.js + Express on ECS | Matches existing team expertise, reuses infra patterns |
| Object Storage | Raw invoice images/PDFs | AWS S3 | Standard, cheap, direct integration with Bedrock vision |
| Job Queue | Decouple extraction from webhook response | AWS SQS | WhatsApp webhooks must respond fast (<5s); extraction takes longer |
| LLM Router | Route extraction calls, handle fallback | Custom Node service (pattern reused from Myra's llmClient.js) | Multi-provider resilience, avoids vendor lock-in and outage risk |
| GSTIN Validation | Verify GSTIN status | GST portal public search API | Authoritative source |
| Database | Structured invoice/reconciliation data | MySQL (RDS) | Team's existing expertise; relational fits well-defined schema |
| Reconciliation & Tax Engine | Compare captured vs filed GST data, calculate Old vs New Regime | Scheduled Node job & tax rule engine | Relieves CA and user from manual calculation |
| Web Portal / Dashboards | Multi-client CA view, Solo business dashboard, Salaried tax locker | React (SPA) | Team's existing stack |

## 4. Data Flow: Processing Pipeline (Happy Path)

1. User (shop owner or salaried employee) sends photo/PDF via WhatsApp → webhook hits backend
2. Backend stores raw image in S3, enqueues processing job in SQS, immediately replies "Processing..."
3. Worker picks up job, prompts LLM with classification & extraction schema:
   - **Case A: GST Invoice:** Extracts vendor GSTIN, taxable value, tax slabs, HSN/SAC. Triggers GSTIN status verification.
   - **Case B: Salaried Tax Proof / Form 16:** Classifies category (80C, 80D, HRA rent slip, Form 16 Part A/B), extracts amounts and PAN/period, updates personal Tax Savings Locker.
4. LLM Router selects provider (primary: Bedrock/Claude; fallback: OpenAI/Gemini on failure/timeout)
5. Extracted data validated against schema, confidence scored
6. If confidence ≥ threshold: saved to MySQL, user notified via WhatsApp with structured summary
7. If confidence < threshold: saved as `needs_review`, WhatsApp follow-up sent to user or routed to CA triage
8. Dashboards (CA multi-client portal, Solo business ledger, or Salaried personal locker) reflect new data in near-real-time

## 5. Non-Functional Requirements

| Requirement | Target |
|---|---|
| WhatsApp webhook response time | < 5 seconds (Meta requirement) |
| Extraction turnaround | < 60 seconds end-to-end |
| GSTIN validation cache hit rate | > 80% (most vendors repeat monthly) |
| System uptime | 99.5%+ |
| Data retention | Invoice images retained 7 years (statutory requirement in India) |

## 6. Security & Compliance Considerations

- GSTIN and financial data are sensitive — encrypt at rest (RDS encryption) and in transit (TLS)
- WhatsApp opt-in consent required and logged per business (DPDP Act 2023 compliance — India's data protection law)
- Role-based access: CAs only see their own managed businesses
- Audit trail: `raw_llm_response` JSON retained for every extraction (dispute resolution, debugging)

## 7. Deployment & Infra Notes

- Reuses existing AWS account patterns already in use: ECS for compute, RDS for MySQL, S3 for storage
- Multi-region not needed for MVP (single region: ap-south-1 Mumbai, closest to users and GST portal)
- CI/CD via Jenkins, matching existing pipeline conventions

## 8. See Also

`04_Low_Level_Architecture.md` for detailed schema, API contracts, prompt design, and error-handling specifics.
