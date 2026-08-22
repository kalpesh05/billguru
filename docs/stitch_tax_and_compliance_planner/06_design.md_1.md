# BillGuru AI — Design Document

Version 1.0 | Audience: Design/frontend team

---

## 1. Design Principles for This Product

1. **Trust over polish.** This product handles tax compliance data — the design should read as precise and calm, not flashy. A shop owner or CA needs to trust the numbers on screen more than they need to be delighted by them.
2. **WhatsApp is the primary interface for end users** — most of the product experience for business owners happens inside WhatsApp's own UI, which we don't control. Our design effort concentrates on the CA dashboard and the small set of WhatsApp message templates we do control.
3. **Severity should be visually obvious at a glance.** A CA scanning 80 clients needs to spot the 3 with high-severity issues in seconds, not read every row.
4. **No jargon.** "Missing ITC" means real money to a CA, but "extraction_status: needs_review" means nothing to anyone outside engineering. Every user-facing label is written in plain language.

## 2. Visual Identity

### Color palette
| Token | Hex | Use |
|---|---|---|
| `ink-900` | #1C2B33 | Primary text, headers |
| `paper-50` | #F7F8F6 | App background |
| `slate-200` | #DCE1E0 | Borders, dividers |
| `teal-600` | #2E6E62 | Primary actions, brand accent (evokes ledger/finance trust, not generic SaaS blue) |
| `amber-500` | #C98A2C | Medium-severity flags |
| `rust-600` | #B14A3A | High-severity flags |
| `moss-500` | #5C8A5A | Resolved/success states |

Rationale: avoids the generic AI-product cream-and-terracotta or dark-mode-with-neon-accent look. A teal-and-ink palette reads closer to financial/ledger software (think physical accounting registers), which suits a product whose core promise is trustworthiness with money.

### Typography
| Role | Typeface | Notes |
|---|---|---|
| Display/headers | **Fraunces** (serif, moderate weight) | Gives the dashboard a slightly institutional, trustworthy feel — not startup-generic |
| Body/UI | **Inter** | Neutral, highly legible at small sizes for dense tabular data |
| Numeric/data | **IBM Plex Mono** (tabular figures) | Amounts and GSTINs align cleanly in columns; monospace prevents digit-misreading, which matters a lot for financial figures |

### Layout concept
Dense, table-first dashboard — not card-heavy. CAs are professionals scanning many rows quickly (similar mental model to email inbox or spreadsheet), so the design favors information density with clear severity color-coding over spacious card layouts.

### Signature element
**The "reconciliation strip"** — a horizontal bar per business showing captured-vs-filed invoice count as a simple two-segment bar (filed in teal, missing in rust), so a CA can visually scan 80 client rows and instantly see which ones have gaps, without reading numbers first. This becomes the product's one memorable visual device, used consistently across the client list and individual client detail views.

## 3. Key Screens

### 3.1 CA Dashboard — Client List (primary screen)

```
┌──────────────────────────────────────────────────────────┐
│  BillGuru AI                              Rajesh Shah ▾   │
├──────────────────────────────────────────────────────────┤
│  This month: 847 invoices · 12 businesses need attention  │
├──────────────────────────────────────────────────────────┤
│  🔴 Meena Kirana Store        [███████░░] 7/9 filed       │
│     2 high-severity flags · ₹4,200 at risk                │
│  ────────────────────────────────────────────────────     │
│  🟡 Sharma Electronics        [████████░] 22/24 filed     │
│     1 medium flag                                          │
│  ────────────────────────────────────────────────────     │
│  🟢 Patel Textiles            [██████████] 15/15 filed    │
│     No issues                                              │
└──────────────────────────────────────────────────────────┘
```

- Sorted by severity, not alphabetically, by default (matches the "CA's time is scarcest resource" principle from the detailed explanation doc)
- The reconciliation strip (bar) is the first visual element per row — severity color dot + strip together let a CA triage without reading text

### 3.2 Client Detail View — Flag List

```
┌──────────────────────────────────────────────────────────┐
│  ← Meena Kirana Store                                     │
│  GSTIN: 24ABCDE1234F1Z5                                   │
├──────────────────────────────────────────────────────────┤
│  🔴 HIGH   Invoice #4521 not found in filed GSTR-3B        │
│            Potential ITC loss: ₹4,200                      │
│            [View invoice]  [Mark resolved]                 │
│  ────────────────────────────────────────────────────     │
│  🟡 MED    Tax rate mismatch on Invoice #4519               │
│            Charged 18% GST, HSN code 8471 expects 12%      │
│            [View invoice]  [Mark resolved]                 │
└──────────────────────────────────────────────────────────┘
```

- Every flag states the concrete financial consequence ("Potential ITC loss: ₹4,200"), not just the technical mismatch — this is the plain-language principle in action
- Direct link to the original invoice image side-by-side for verification, since CAs won't trust a flag they can't verify against the source document

### 3.3 Invoice Review Queue (needs_review items)

```
┌──────────────────────────────────────────────────────────┐
│  Needs your confirmation (3)                               │
├──────────────────────────────────────────────────────────┤
│  [invoice photo thumbnail]                                 │
│  Vendor: "Shrma Traders" (low confidence)                  │
│  GSTIN: could not read clearly                             │
│  [Confirm as shown]  [Edit]  [Request clearer photo]        │
└──────────────────────────────────────────────────────────┘
```

- Never silently auto-corrects — always shows exactly what the AI saw, with explicit user action required
- "Request clearer photo" sends a pre-written WhatsApp message directly, no manual typing needed

## 4. WhatsApp Message Design

WhatsApp UI itself isn't ours to design, but message *content and structure* is:

| Trigger | Message |
|---|---|
| Invoice received | "Got it! Checking your invoice now — back to you shortly." |
| Extraction successful | "✅ Invoice from [Vendor] logged — ₹[amount], [date]." |
| Low confidence | "Couldn't clearly read the GSTIN on this one. Can you send a clearer photo, or reply with the GSTIN directly?" |
| Invalid GSTIN detected | "⚠️ Heads up — the GSTIN on this invoice from [Vendor] appears to be cancelled. Your CA has been notified." |
| Monthly summary | "This month: 24 invoices logged, 2 need your attention. Your CA can see the details." |

Voice: plain, direct, no exclamation-heavy "friendly bot" tone — matches the trust-first principle. Never says "our AI thinks" or exposes system internals; speaks in terms of what was found and what to do next.

## 5. Empty & Error States

- **No invoices yet** (new client): "No invoices logged yet. Forward a photo of any invoice on WhatsApp to get started." — an invitation to act, not a blank table.
- **GSTIN validation service down**: dashboard shows "Validation temporarily delayed — showing last known status" rather than failing silently or showing a raw error.

## 6. Accessibility & Responsiveness

- CA dashboard must work on mobile web (many CAs check client status from phone between client meetings) — table view collapses to stacked cards below 640px, retaining the severity-first sort order
- Color is never the only signal for severity — icon/label (🔴 HIGH, 🟡 MED, 🟢 OK) always pairs with color for colorblind accessibility
- All interactive elements have visible keyboard focus states for dashboard users on desktop

## 7. Next Steps for Design Team

- [ ] Build high-fidelity mockup of Client List + Detail views in Figma using token system above
- [ ] Prototype the WhatsApp message flow as a click-through (Figma or actual WhatsApp Business sandbox)
- [ ] User-test the reconciliation strip concept with 2-3 real CAs before committing to it as the signature element
- [ ] Define full component library (buttons, badges, table rows) once mockups are validated
