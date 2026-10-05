# BillGuru AI — Product Requirements Document (PRD)
**GST Compliance Copilot for Small Indian Businesses**

Version 1.0 | Prepared by: Kalpesh | Date: August 2026

---

## 1. Problem Statement

Indian taxpayers face costly friction across both businesses and individuals:

- **Small Businesses & Shop Owners:** Manual invoice entry errors, fake/cancelled vendor GSTINs, rejected Input Tax Credit (ITC), and late-discovered GSTR-1 vs 3B mismatches. Most small shops cannot afford dedicated full-time accountants.
- **Salaried Employees & Individuals:** Year-end panic gathering HRA rent slips, 80C/80D proofs, and donation receipts for HR portals; confusion over Old vs. New Tax Regime optimization; and painful July ITR-1/2 filing with Form 16, AIS, and capital gains.
- **Chartered Accountants (CAs):** Waste 20+ hours a month chasing clients for missing receipts (both monthly GST bills and annual ITR Form 16s/deduction proofs) and manually correcting avoidable data entry errors.

## 2. Target Users

| Segment | Description | Buying & Usage Motion |
|---|---|---|
| **Primary: Chartered Accountants (CAs)** | Manage GST & ITR filings for 30–200 business and individual clients | B2B2C — CA subscribes, onboard clients to their firm workspace |
| **Secondary: Small Business & Shop Owners** | Kirana stores, retailers, traders, and freelancers with GSTINs | WhatsApp bill forwarder → Free trial / Solo DIY plan or via their CA |
| **Tertiary: Salaried Professionals & Individuals** | Employees filing ITR-1/2 with Form 16, rent, 80C/80D deductions | WhatsApp Tax Locker & Form 16 Copilot → Freemium / DIY or shared with CA |

CAs remain the primary distribution engine because they control existing client relationships across both businesses and individual salary earners, while self-serve tiers capture independent shop owners and salaried employees directly.

## 3. Core Value Proposition

> **For Businesses:** "Forward your invoice photo on WhatsApp. We catch GST errors before they cost you money — not after the notice arrives."
> 
> **For Salaried Employees:** "Snap your rent slips, medical policies, and Form 16 on WhatsApp. We organize your deductions, optimize Old vs New Regime, and prep your ITR."

## 4. MVP & Phased Scope

### Phase 1: Core Foundation (Current)
1. **Invoice & Proof Capture** via WhatsApp photo/PDF upload.
2. **AI Extraction** of vendor GSTIN, taxable amount, tax slab, HSN/SAC code, and personal deduction fields (HRA, 80C, 80D, 80G).
3. **GSTIN Validation** against GST portal (catches fake/cancelled/suspended vendors).
4. **Slab & Rate Mismatch Detection** (tax rate vs expected rate for HSN/SAC).
5. **Monthly GSTR-1/3B Reconciliation View** for businesses.
6. **Salaried Tax Savings Locker & Form 16 Analyzer** (extracts Part A & B, compares Old vs. New Regime).
7. **Role-Tailored Dashboards**:
   - **CA Dashboard**: Multi-client GST & ITR management.
   - **Solo Business / Salaried View**: Personal ledger, tax locker, and summaries.

### Phase 2: Direct E-Filing & Integrations
- Direct GSTR-1/3B filing via GST Suvidha Provider (GSP) APIs.
- Direct ITR-1 e-filing via Income Tax E-filing API / JSON download.
- AIS / TIS / 26AS data pull and capital gains integration (Zerodha, Groww).

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
