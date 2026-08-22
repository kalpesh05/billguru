# BillGuru AI — Product Requirements Document (PRD)
**GST Compliance Copilot for Small Indian Businesses**

Version 1.0 | Prepared by: Kalpesh | Date: August 2026

---

## 1. Problem Statement

Small businesses and freelancers in India (annual turnover typically ₹20L–₹5Cr) routinely lose money and time due to:

- **Manual invoice entry errors** — misread amounts, wrong GST slabs, missed HSN/SAC codes
- **Fake or cancelled GSTIN acceptance** — leads to Input Tax Credit (ITC) rejection during GSTR-2A/2B reconciliation
- **Late-discovered mismatches** — GSTR-1 vs GSTR-3B discrepancies are usually found *after* a notice arrives from the GST department, not before filing
- **No accessible compliance layer** — existing accounting software (Tally, Zoho Books) requires trained staff; most small shop owners don't have a dedicated accountant on payroll

This costs small businesses real money: rejected ITC claims, late fees, notices, and CA time spent fixing avoidable errors.

## 2. Target Users

| Segment | Description | Buying Motion |
|---|---|---|
| **Primary: Chartered Accountants (CAs)** | Manage GST filing for 30–200 small business clients each | B2B2C — CA subscribes, rolls out to clients |
| **Secondary: Small business owners** | Direct users forwarding invoices via WhatsApp | Freemium → paid via CA or direct |

CAs are the primary buyer because they control the filing relationship and can drive adoption across many clients at once — this is the fastest path to revenue (see USP doc for detail).

## 3. Core Value Proposition

> "Forward your invoice photo on WhatsApp. We catch GST errors before they cost you money — not after the notice arrives."

## 4. MVP Scope (Phase 1, ~3–4 months)

1. **Invoice capture** via WhatsApp photo/PDF upload
2. **AI extraction** of vendor GSTIN, amount, tax slab, HSN/SAC code
3. **GSTIN validation** against GST portal (catch fake/cancelled numbers)
4. **Slab mismatch detection** (tax rate vs expected rate for HSN/SAC)
5. **Monthly GSTR-1/3B reconciliation view** — surfaces mismatches before filing deadline
6. **WhatsApp-first UX** — no app download required for end business owners
7. **CA dashboard** — web view across all managed clients

## 5. Out of Scope (Phase 1)

- Full accounting/bookkeeping (ledgers, P&L, balance sheets)
- E-way bill generation
- Payroll or inventory management
- Direct GST portal filing (Phase 2 candidate)

## 6. Success Metrics

| Metric | Target (6 months post-launch) |
|---|---|
| CAs onboarded | 25 |
| Businesses covered | 750 (avg 30/CA) |
| Invoices processed/month | 15,000+ |
| Extraction accuracy (confidence ≥0.9) | 90%+ |
| Flagged issues resolved before filing | 60%+ |
| Paying CA conversion (from free trial) | 20%+ |

## 7. Key Risks

- **Distribution risk** (highest): CAs are conservative, relationship-driven buyers — cold outreach conversion will be slow. Needs warm intros / CA community channels.
- **Extraction accuracy risk**: Poor invoice photo quality (common with small shop owners) — mitigated by confidence scoring and human-in-loop review flow.
- **Regulatory risk**: GST rules and portal APIs change; validation logic needs ongoing maintenance.
- **Trust risk**: A wrongly-flagged (or missed) GSTIN error has real financial consequences — system must never silently guess.

## 8. Companion Documents

- `02_Detailed_Explanation.md` — full feature walkthrough and user flows
- `03_High_Level_Architecture.md` — system architecture and tech stack
- `04_Low_Level_Architecture.md` — schema, API contracts, extraction pipeline detail
- `05_GTM_USP_Monetization.md` — go-to-market strategy, pricing, competitive positioning
