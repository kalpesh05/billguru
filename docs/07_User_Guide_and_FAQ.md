# BillGuru AI — User Guide & Frequently Asked Questions (FAQ)

Welcome to **BillGuru AI**! This guide is designed for **Chartered Accountants (CAs)**, **Small Business & Shop Owners**, and **Salaried Professionals** to get started and get maximum value from the platform in minutes.

---

## 🧭 Table of Contents
1. [Product Overview](#1-product-overview)
2. [Quick-Start by Persona](#2-quick-start-by-persona)
   - [A. For Chartered Accountants (CAs)](#a-for-chartered-accountants-cas)
   - [B. For Small Business & Shop Owners (DIY / No CA)](#b-for-small-business--shop-owners-diy--no-ca)
   - [C. For Salaried Professionals & Taxpayers](#c-for-salaried-professionals--taxpayers)
3. [The WhatsApp Bot Experience](#3-the-whatsapp-bot-experience)
4. [Frequently Asked Questions (FAQ)](#4-frequently-asked-questions-faq)
5. [Troubleshooting & Best Practices](#5-troubleshooting--best-practices)

---

## 1. Product Overview

**BillGuru AI** is an AI-powered tax compliance and validation copilot for India. It operates seamlessly over **WhatsApp** and a **Web Dashboard**:

* **For Businesses & Shop Owners:** Captures purchase bills via WhatsApp photos, instantly verifies vendor GSTINs, checks tax rates against HSN/SAC codes, and catches errors *before* filing.
* **For Salaried Employees:** Organizes rent slips, medical insurance policies, and donation receipts into a personal **WhatsApp Tax Locker**, parses Form 16 PDFs, and computes whether the **Old or New Tax Regime** saves you more money.
* **For Chartered Accountants:** Provides a single command center across 30–200+ clients, turning hours of monthly receipt chasing and manual data entry into a 1-click verification process.

---

## 2. Quick-Start by Persona

### A. For Chartered Accountants (CAs)

#### Step 1: Onboard Your Clients
1. Log in to your **CA Command Center**.
2. Click **"＋ Add Client Business"** at the top of the sidebar.
3. Enter the business name, 15-character GSTIN, and the client's WhatsApp number.
4. The system automatically sends an opt-in WhatsApp invite to your client:
   > *"Your CA [Name] has enrolled you in BillGuru AI. Just snap and forward your purchase bills here!"*

#### Step 2: Inward Triage Queue (Reviewing Low-Confidence Scans)
* When a client sends a blurry or hand-written invoice, our AI flags it for review instead of silently guessing.
* Navigate to **Inward Queue** in the sidebar.
* View side-by-side: original bill image on the left, extracted data on the right.
* Edit any misread characters with 1 click and click **Confirm**, or click **Request Clearer Photo** to prompt the client automatically on WhatsApp.

#### Step 3: Monitor Reconciliation Strip
* On your **Dashboard**, look at the **Reconciliation Strip** for each client.
* **Teal Bar:** Fully matched and filed invoices.
* **Amber / Red Bar:** Missing ITC or unfiled invoices at risk.
* Click any client to open their detailed ledger and export reconciled records to Excel/Tally.

---

### B. For Small Business & Shop Owners (DIY / No CA)

#### Step 1: Snap Bills on WhatsApp
* You do **not** need to install any heavy accounting software.
* Whenever a vendor delivers goods with an invoice, open WhatsApp, take a clear photo of the bill, and send it to the BillGuru bot number.

#### Step 2: Instant Fraud & GSTIN Warning
* Within 3 seconds, BillGuru checks the supplier's GSTIN against the government portal.
* **Active GSTIN:** The bot confirms: *"✅ Received! Invoice from Sharma Wholesale logged. Total: ₹27,533. GSTIN valid."*
* **Cancelled / Fake GSTIN:** The bot alerts you immediately: *"⚠️ Warning: Supplier GSTIN appears Cancelled/Suspended. Do not claim ITC on this bill!"*

#### Step 3: Self-Serve GSTR-3B Filing (No CA Required)
1. Open the **Solo Shop (DIY)** tab on your web browser.
2. Review your verified purchase totals and eligible Input Tax Credit (ITC).
3. Click **"Download GSTR-3B JSON"**.
4. Log in to `gst.gov.in`, navigate to Returns Dashboard $\rightarrow$ GSTR-3B $\rightarrow$ Upload, and select the downloaded JSON file. You're done!

---

### C. For Salaried Professionals & Taxpayers

#### Step 1: WhatsApp Tax Locker (Year-Round Proof Saving)
* Throughout the year, you pay rent, health insurance, tuition fees, and donations. Don't lose receipts!
* Snap a photo of your receipt and send it to BillGuru on WhatsApp:
  * Rent receipts $\rightarrow$ Categorized under **HRA (House Rent Allowance)**
  * Health insurance premiums $\rightarrow$ Categorized under **Section 80D**
  * ELSS, term insurance, tuition fees $\rightarrow$ Categorized under **Section 80C**
  * Charitable donations $\rightarrow$ Categorized under **Section 80G**

#### Step 2: Form 16 PDF Drop & Regime Optimizer
1. When your company releases your Form 16 in May/June, drop the PDF into WhatsApp or the web app.
2. The AI parses Part A (TDS deposited) and Part B (salary breakdown).
3. Our **AI Regime Optimizer** compares both options side-by-side:
   * **Old Regime:** Factors in your standard deduction (₹50,000) + all your saved Section 80 and HRA deductions.
   * **New Regime (Sec 115BAC):** Factors in the ₹75,000 standard deduction and lower tax slabs.
   * Gives you a clear verdict: *"🏆 New Regime saves you ₹10,400!"* or *"🏆 Old Regime saves you ₹16,300!"*

#### Step 3: 1-Click ITR-1 Filing
* Click **"Download ITR-1 JSON"** in your **Salaried Tax Locker** tab.
* Upload directly to `incometax.gov.in` under e-File $\rightarrow$ Income Tax Returns $\rightarrow$ Upload JSON.
* Alternatively, click **"Share with CA"** to send your organized tax pack to your CA with zero email back-and-forth.

---

## 3. The WhatsApp Bot Experience

| What You Send | What BillGuru Bot Does | Sample Bot Reply |
|---|---|---|
| **Photo of Purchase Invoice** | OCR extracts GSTIN, amounts, HSN, and verifies with GST portal. | *"✅ Received! Invoice from Sharma Wholesale logged. Total: ₹27,533. GSTIN valid."* |
| **Blurry or Cut-off Photo** | Flags low confidence, avoids guessing. | *"Couldn't clearly read the GSTIN. Please reply with the 15-character GSTIN or send a clearer photo."* |
| **Rent Slip / Rent Agreement** | Extracts landlord PAN, rent amount, and dates. | *"✅ Saved ₹20,000 under HRA Rent Receipts! Landlord PAN verified. Total HRA tracked: ₹2,40,000."* |
| **Health Insurance Receipt** | Extracts policy number, insurer PAN, and premium. | *"✅ Saved ₹25,000 to your Tax Locker under Section 80D! Remaining 80D limit: ₹0 / ₹25,000."* |
| **Form 16 PDF** | Reads Part A & B, computes Old vs New Regime. | *"📄 Form 16 parsed! Gross CTC: ₹18,00,000. New Regime saves you ₹10,400 over Old Regime!"* |

---

## 4. Frequently Asked Questions (FAQ)

### General Questions

#### Q: Do I need to install an app from Play Store or App Store?
**A:** No! BillGuru AI is completely **WhatsApp-native**. You and your clients use WhatsApp on your phones, and CAs/managers use the modern web dashboard on desktop or mobile browsers.

#### Q: Is my business, invoice, and salary data secure?
**A:** Yes. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We strictly adhere to India's **Digital Personal Data Protection (DPDP) Act 2023**. We never sell or share your tax data.

---

### For Businesses & Shop Owners

#### Q: Can I use BillGuru without hiring a CA?
**A:** Yes! The **Solo Shop (DIY)** mode is built specifically for independent retailers, traders, and freelancers. It validates your bills, protects your ITC, and generates pre-filled GSTR-3B JSON files you can upload yourself to the GST portal for free.

#### Q: What happens if a supplier gives me a fake or cancelled GSTIN?
**A:** When you forward the bill on WhatsApp, our background validator immediately pings the public GST registry. If the GSTIN is inactive, cancelled, or suspended, you receive an instant red alert on WhatsApp so you can pause vendor payment and avoid ITC rejection.

#### Q: Does BillGuru replace Tally or Zoho Books?
**A:** No. BillGuru sits *before* Tally or Zoho as a **proactive data capture and error shield**. It ensures that the invoices entering your accounting software are 100% clean, verified, and reconciled.

---

### For Salaried Professionals

#### Q: How does the Old vs. New Regime optimizer decide which is better?
**A:** It computes your exact tax liability under both laws using FY 2026-27 rules:
* **Old Regime:** Allows ₹50,000 standard deduction + Section 80C (up to ₹1.5L) + Section 80D (up to ₹25k/₹50k) + HRA exemption + 80G donations.
* **New Regime (Sec 115BAC):** Allows ₹75,000 standard deduction (post Budget 2024) across revised 5%, 10%, 15%, 20%, and 30% slabs.
* The system compares both bottom-line numbers and highlights the one that leaves more money in your pocket.

#### Q: Can I upload multiple rent receipts throughout the year?
**A:** Absolutely. You can send monthly rent receipts anytime. The bot logs each month, verifies your landlord's PAN (required if annual rent exceeds ₹1,00,000), and maintains a running cumulative total for your HR proof submission.

---

### For Chartered Accountants

#### Q: How many clients can a CA manage on one subscription?
**A:** Starter plan supports up to 25 clients, Pro supports up to 100 clients, and Enterprise supports unlimited clients. You can manage both GST business clients and individual salaried ITR clients in the same dashboard.

#### Q: What if an invoice OCR parse has low confidence?
**A:** Any parse with confidence score below 0.70 is automatically routed to your **Inward Triage Queue**. You can review the crop in 2 seconds, verify the number, and approve it before it touches any official filing ledger.

---

## 5. Troubleshooting & Best Practices

1. **For Clear Invoice Captures:** Place the paper invoice flat on a well-lit surface and avoid heavy shadows or thumb covering the GSTIN or total amount.
2. **Missing Landlord PAN:** If annual rent is above ₹1,00,000, ensure your rent receipt includes your landlord's PAN so the HRA claim is not rejected by your employer's HR team.
3. **Switching Modes:** Use the navigation sidebar anytime to switch between the **CA Command Center**, the **Solo Shop (DIY) Portal**, and the **Salaried Tax Locker**.
