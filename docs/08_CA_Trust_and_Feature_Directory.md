# BillGuru AI — CA Trust & Complete Feature Directory
**A Comprehensive Guide for Chartered Accountants: Zero-Risk Testing, Privacy Guarantees, and Function Walkthroughs**

---

## 🏛️ Executive Statement for Chartered Accountants

Dear Professional Colleague,

As a Chartered Accountant under the regulations of the Institute of Chartered Accountants of India (ICAI), **client financial confidentiality is your foremost duty.** Handing over real client GSTINs, phone numbers, or purchase registers to an untested software platform carries understandable hesitation.

**BillGuru AI has been engineered specifically to respect CA-Client privilege and eliminate this risk:**
1. **No Real GSTIN Required to Test:** You can evaluate 100% of the platform’s OCR accuracy, tax mismatch engines, and Tally export capabilities using our **Sandbox Practice Mode** or with provisional dummy IDs.
2. **Zero Automated Messages to Your Clients:** Automated WhatsApp messaging is **disabled by default**. BillGuru will never text, alert, or interact with your clients unless you explicitly enable it.
3. **Zero Vendor Lock-In:** All captured vouchers, vendor ledgers, and tax breakdowns can be exported at any time into standard **Tally Prime XML** and official **GSTR-2B / 3B JSON**.
4. **Data Protection:** Bank-grade AES-256 encryption at rest and TLS 1.3 in transit, fully compliant with India’s **Digital Personal Data Protection (DPDP) Act 2023**.

---

## 🧭 Complete Function-by-Function Directory

Below is the complete walkthrough of every button, tool, and workflow in BillGuru AI, explaining **what it is**, **why it exists**, and **how to use it without risking real client data.**

---

### 1. 💡 Guided Product Tour & Purpose
* **Location:** Header button (`💡 How It Works & Tour`) and Sidebar (`💡 Product Tour & Purpose`).
* **Purpose:** Explains why BillGuru AI exists and how it eliminates 20+ hours of monthly manual voucher typing and bill chasing.
* **How It Works (3 Steps):**
  1. **Step 1 (Client WhatsApps Photo):** Shop owners (Kirana stores, wholesalers, retailers) don't need accounting software. They take photos of purchase bills and forward them to your firm's WhatsApp.
  2. **Step 2 (AI OCR & Fraud Check):** Extracts vendor name, invoice date, amounts, and tax slabs. Validates the vendor's GSTIN against the government portal to catch cancelled or fake vendors *before* filing.
  3. **Step 3 (1-Click Tally & GSTR Export):** CA reviews flagged issues in seconds and exports clean XML vouchers directly to Tally Prime or GSTR-2B/3B JSON.

```
┌────────────────────────────────────────────────────────────────────────┐
│  STEP 1: Client Snaps Bill  ──►  STEP 2: Real-Time AI Fraud Check  ──► │
│  (WhatsApp Photo / PDF)          (Vendor GSTIN & HSN Tax Slabs)        │
│                                                                        │
│  STEP 3: CA 1-Click Export (Tally Prime XML & GSTR-2B/3B)              │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 2. ⚡ Practice Demo Mode (`Load Practice Demo Data`)
* **Location:** Top Header button (`⚡ Load Demo Data`), Dashboard Launchpad, or Tour Modal.
* **Purpose:** Allows you to test the complete platform without entering a single real client or GSTIN.
* **What it Loads:**
  * **3 Simulated Businesses:**
    1. *Meena Kirana Store* (9 purchase bills, ₹4,200 at-risk missing ITC).
    2. *Sharma Electronics* (24 invoices, 1 cancelled vendor GSTIN flag).
    3. *Patel Textiles* (15 invoices, 100% reconciled).
  * **3 Live Compliance Flags:**
    * Flag 1: Invoice missing in filed GSTR-3B (potential ITC loss).
    * Flag 2: Tax rate mismatch on HSN 8471 (charged 18% instead of standard 12%).
    * Flag 3: Cancelled vendor GSTIN warning (Gupta Distributors).
* **How to Exit:** Click the **`🧪 Demo Mode (Exit)`** badge in the header at any time to return to your clean, live firm workspace.

---

### 3. 🔍 Instant AI Bill Scanner Sandbox
* **Location:** Header button (`🔍 Test Bill Scanner`) and Sidebar (`🔍 Test AI Bill Scanner`).
* **Purpose:** Test the AI OCR engine and live GST portal registry verification on sample bills or your own paper bills without creating any business account.
* **Interactive Sample Bills Included:**
  * **Sample 1: Kirana Wholesale Invoice** (Valid 18% GST, ITC Eligible ₹4,200).
  * **Sample 2: Electronics Distributor Alert** (🚨 Supplier GSTIN is **CANCELLED** on the government portal! Highlights avoided ₹9,000 ITC penalty).
  * **Sample 3: Hardware Supplies Slab Mismatch** (⚠️ Charged 18% GST, but HSN 8471 specifies 12% standard rate).
* **What You See in 2 Seconds:**
  * Extracted Vendor Legal Name & GSTIN.
  * Extracted Invoice Number & Invoice Date.
  * Taxable Amount, CGST, SGST, IGST, and Total.
  * AI Extraction Confidence Score (e.g., 98%).
  * **Compliance Verdict:** Active vs. Cancelled Vendor status on government GST portal.

---

### 4. ➕ Add Client Business (Private Mode)
* **Location:** Sidebar button (`＋ Add Client Business`) or Dashboard Launchpad.
* **Purpose:** Create a segregated workspace for a client shop or trader.
* **Fear-Free Controls:**
  * **GSTIN is Optional:** If you are testing or the client is a composition dealer, check **`Client doesn't have GSTIN yet / Skip GSTIN for now`**. The system assigns a provisional identifier (`24PROV...1Z5`).
  * **1-Click Auto-Fill Demo Shop:** Click `⚡ Auto-Fill Demo Shop` to populate "Ramesh Kirana & General Store" with sample phone and GSTIN in 1 second.
  * **Automated WhatsApp Invitations OFF by Default:** The checkbox `Send automated WhatsApp welcome invitation to client right now` is **UNCHECKED**. You can test bill uploads internally without alerting your client.

---

### 5. 📥 Inward Triage Queue (Human-in-the-Loop OCR Verification)
* **Location:** Sidebar navigation (`Inward Queue`).
* **Purpose:** Guarantees that AI never silently guesses. Ensures 100% accuracy before any voucher touches your books.
* **How It Works:**
  * If a client forwards a crumpled, blurry, or low-light receipt, the AI flags it as `needs_review` (confidence < 0.90).
  * **Side-by-Side Inspection:** You see the original bill image crop on the left and the extracted fields on the right.
  * **1-Click Actions:**
    * **Confirm:** Save verified bill to the client's purchase register.
    * **Edit:** Adjust any blurry digit in 2 seconds.
    * **Request Clearer Photo:** Sends an automated, polite WhatsApp message to the client asking for a flatter photo.

---

### 6. 📊 CA Client Dashboard & Reconciliation Strip
* **Location:** Main home view (`CA Multi-Client`).
* **Purpose:** Instant bird's-eye view of monthly filing progress and at-risk ITC across all your managed clients.
* **Key Indicators:**
  * **Total Managed Clients & Critical Issues Counter.**
  * **The Reconciliation Strip:**
    * **Teal Segment:** Fully captured & filed invoices.
    * **Red/Amber Segment:** Unfiled bills or missing ITC at risk.
  * **At-Risk Value (₹):** Real-time rupee amount of pending or blocked ITC that needs resolution before the GSTR-3B due date.

---

### 7. 📂 1-Click Tally Prime XML & GSTR-2B Export (Zero Lock-In)
* **Location:** Client Ledger Detail view (`Export to Tally XML` / `Export GSTR-2B CSV`).
* **Purpose:** Seamlessly bridge WhatsApp bill capture into your firm's existing accounting workflow.
* **Export Specs:**
  * **Tally Prime XML:** Generates compliant `<VOUCHER VCHTYPE="Purchase">` XML with standard ledger mapping:
    * Credit: Party Ledger Account (Vendor Name + Vendor GSTIN).
    * Debit: Purchase Account (Taxable Value).
    * Debit: Input CGST / SGST / IGST (Tax Amounts).
  * **GSTR-2B CSV:** Formatted strictly according to the GST portal purchase register upload schema.

---

### 8. 💬 WhatsApp Simulation (`WhatsApp Sim`)
* **Location:** Sidebar navigation (`WhatsApp Sim`).
* **Purpose:** Experience exactly how your shop owner clients experience the WhatsApp bot without needing a live WhatsApp Business API account connected.
* **Interactive Capabilities:**
  * Switch between **Business Mode** (Kirana store purchase bills) and **Salaried Mode** (Rent slips & Form 16s).
  * Simulate sending low-confidence photos and replying with GSTINs.
  * Experience the bot's instant GST registry validation responses.

---

### 9. 💼 Solo Shop (DIY) & Salaried Tax Locker
* **Location:** Sidebar navigation (`Solo Shop (DIY)` and `Salaried Tax Locker`).
* **Purpose:**
  * **Solo Shop (DIY):** Self-serve view for independent retailers to generate pre-filled GSTR-3B JSON files for direct upload to `gst.gov.in`.
  * **Salaried Tax Locker:** Year-round tax deduction organizer for salaried employees. Drop Form 16 PDF to get an instant **Old vs. New Tax Regime comparison** under Budget 2024 / FY 2026-27 rules.

---

## 🧪 The 10-Minute Pilot Protocol for Your CA

Share these exact 4 steps with your CA friend or relative to let them experience the product safely on their own laptop:

1. **Step 1 (Zero Data Signup):**
   * Register a test account using their name and firm name.
   * On registration, the **Guided Welcome Tour** will open. Click through the 3 slides to understand the purpose.
2. **Step 2 (Explore Demo Data):**
   * Click **"⚡ Load Practice Demo Data"**.
   * Notice the 3 simulated businesses on the dashboard.
   * Click on *Meena Kirana Store* to see the flags and click **"Export to Tally XML"** to inspect the clean XML file.
3. **Step 3 (Test AI Bill Scanner):**
   * Click **"🔍 Test Bill Scanner"** in the top bar.
   * Click the **"Gupta Distributors (Cancelled GSTIN Alert)"** sample to see how BillGuru catches fraudulent suppliers.
4. **Step 4 (Test Safe Client Addition):**
   * Click **"＋ Add Client Business"**.
   * Click **"⚡ Auto-Fill Demo Shop"** and observe how the WhatsApp invite remains safely turned off.
