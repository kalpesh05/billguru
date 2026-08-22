# BillGuru AI — Final Design Specifications

## 1. Design Strategy: "Trust Over Polish"
BillGuru AI is built for professional tax compliance. The visual language prioritizes data integrity, clarity of action, and institutional trust over generic SaaS aesthetics.

### Core Principles:
- **Severity-First Triage:** Use color and position to highlight critical issues (High/Red, Med/Amber, OK/Teal) so CAs can scan dozens of clients in seconds.
- **Data Precision:** Monospaced typography for all financial and tax identifiers to ensure vertical alignment and legibility.
- **Instrument-Grade UI:** Progress bars and status indicators are designed to look like precise instruments, reinforcing the accuracy of the underlying AI.

---

## 2. Visual Identity (Design System)

### Typography
- **Fraunces (Serif):** Used for primary headers and branding to evoke a traditional, trustworthy, institutional feel.
- **Inter (Sans-Serif):** Used for general UI labels and secondary body text for high legibility.
- **IBM Plex Mono (Monospaced):** **Mandatory** for all GSTINs, Invoice Numbers, Tax Rates, and Financial Amounts.

### Color Palette
- **Primary Brand (Teal-600):** `#2E6E62` — Evokes accounting ledgers and financial trust.
- **Background (Paper-50):** `#F7F8F6` — A calm, off-white background to reduce eye strain.
- **High Severity (Rust-600):** `#B14A3A` — For critical ITC losses and invalid GSTINs.
- **Medium Severity (Amber-500):** `#C98A2C` — For tax rate mismatches and missing info.
- **Success/OK (Moss-500):** `#5C8A5A` — For reconciled and verified states.
- **Text (Ink-900):** `#1C2B33` — High-contrast primary text.

---

## 3. Signature Component: The "Reconciliation Strip"
A two-segment horizontal bar showing captured-vs-filed invoice counts.
- **Teal Segment:** Represents filed/captured invoices.
- **Rust/Amber Segment:** Represents missing or flagged invoices.
- **Track:** A light gray background track ensures the bar feels like a contained instrument.

---

## 4. Screen Inventory & Flow

### 4.1 CA Dashboard (Desktop & Mobile)
- **Primary View:** {{DATA:SCREEN:SCREEN_2}} (Desktop), {{DATA:SCREEN:SCREEN_23}} (Mobile).
- **Empty State:** {{DATA:SCREEN:SCREEN_3}} — Includes a "Quick Start Guide" checklist.

### 4.2 Ledgers & Registers
- **Outward Register:** {{DATA:SCREEN:SCREEN_4}} — High-density sales ledger with monospace alignment.
- **Inward Register (Triage):** {{DATA:SCREEN:SCREEN_27}} — Review queue for low-confidence AI extractions.

### 4.3 Client Management
- **Detail View:** {{DATA:SCREEN:SCREEN_13}} (Desktop), {{DATA:SCREEN:SCREEN_12}} (Mobile) — Deep dive into compliance flags.
- **Onboarding:** {{DATA:SCREEN:SCREEN_18}} — Flow for setting up new business clients.

### 4.4 Communication (WhatsApp)
- **Triage Flows:** {{DATA:SCREEN:SCREEN_7}} and {{DATA:SCREEN:SCREEN_5}} — Actions like "Request Clearer Photo" or "Invalid GSTIN Alert" triggered directly from the dashboard.

---

## 5. Technical Notes
- **Responsiveness:** Desktop uses a side-bar navigation model; Mobile uses a bottom navigation bar + drawer.
- **Accessibility:** Color is never the sole indicator of status; icons and text labels (🔴 HIGH, 🟡 MED) always accompany status dots.
- **State Management:** The dashboard reflects real-time syncing status with Tally ERP Cloud and WhatsApp Business API.