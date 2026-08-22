---
name: BillGuru AI
colors:
  surface: '#f9faf8'
  surface-dim: '#d9dad8'
  surface-bright: '#f9faf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f2'
  surface-container: '#edeeec'
  surface-container-high: '#e7e8e6'
  surface-container-highest: '#e2e3e1'
  on-surface: '#191c1b'
  on-surface-variant: '#3f4946'
  inverse-surface: '#2e3130'
  inverse-on-surface: '#f0f1ef'
  outline: '#6f7976'
  outline-variant: '#bfc9c5'
  surface-tint: '#28695d'
  primary: '#0e554a'
  on-primary: '#ffffff'
  primary-container: '#2e6e62'
  on-primary-container: '#adeede'
  inverse-primary: '#93d3c4'
  secondary: '#51616a'
  on-secondary: '#ffffff'
  secondary-container: '#d2e2ed'
  on-secondary-container: '#55656e'
  tertiary: '#474d4d'
  on-tertiary: '#ffffff'
  tertiary-container: '#5f6564'
  on-tertiary-container: '#dde2e1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#afefe0'
  primary-fixed-dim: '#93d3c4'
  on-primary-fixed: '#00201b'
  on-primary-fixed-variant: '#045045'
  secondary-fixed: '#d5e5f0'
  secondary-fixed-dim: '#b9c9d3'
  on-secondary-fixed: '#0e1d25'
  on-secondary-fixed-variant: '#3a4951'
  tertiary-fixed: '#dee3e2'
  tertiary-fixed-dim: '#c2c7c7'
  on-tertiary-fixed: '#171d1c'
  on-tertiary-fixed-variant: '#424847'
  background: '#f9faf8'
  on-background: '#191c1b'
  surface-variant: '#e2e3e1'
  rust-600: '#B14A3A'
  amber-500: '#C98A2C'
  moss-500: '#5C8A5A'
  ink-900: '#1C2B33'
  paper-50: '#F7F8F6'
  slate-200: '#DCE1E0'
  teal-600: '#2E6E62'
typography:
  display-lg:
    fontFamily: Fraunces
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Fraunces
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Fraunces
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Fraunces
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
  data-mono:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '450'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  data-mono-sm:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: '450'
    lineHeight: '1.4'
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system for this product is built on a foundation of **Trust over Polish**. It rejects the high-gloss, neon-accented aesthetics typical of modern AI SaaS in favor of an **Institutional Minimalism** that evokes the reliability of physical accounting registers and financial ledgers. 

The target audience consists of Chartered Accountants (CAs) and business owners who require high information density and absolute clarity. The emotional response should be one of calm, precision, and authority.

### Style Principles
*   **Precision over Delight:** Every visual element serves a functional purpose. Avoid unnecessary animations or decorative flourishes that could distract from the data.
*   **Information Density:** The layout prioritizes a "table-first" approach, mimicking the efficiency of spreadsheets to allow professionals to scan dozens of clients and hundreds of invoices rapidly.
*   **Severity-Driven Hierarchy:** Visual attention is directed through color-coded severity states (High, Medium, Success) rather than traditional marketing hierarchy.
*   **Plain Language:** Technical jargon is replaced with concrete financial consequences (e.g., "Potential ITC loss" instead of "extraction_error").

## Colors

The "Teal-and-Ink" palette is designed to feel established and sturdy. 

*   **Primary (Teal-600):** Used for primary actions and brand accents. It is a ledger-inspired green that signals financial trust.
*   **Secondary/Text (Ink-900):** The primary color for headers and body text, providing high contrast against the paper background.
*   **Background (Paper-50):** A warm, off-white neutral that reduces eye strain during long periods of data entry and review.
*   **Borders (Slate-200):** Used for hair-line dividers and structural boundaries to maintain a clean, organized grid.

### Semantic Severity
Color is a critical functional tool in this system. It must always be paired with text or icons to ensure accessibility:
*   **High Severity (Rust-600):** Used for critical errors or potential financial loss.
*   **Medium Severity (Amber-500):** Used for warnings or items requiring review.
*   **Success (Moss-500):** Used for resolved states and validated invoices.

## Typography

This system employs a tri-font strategy to balance institutional authority with modern legibility.

*   **Fraunces (Headers):** A "soft-serif" that provides an academic, trustworthy feel. Use for page titles and section headers to ground the interface.
*   **Inter (UI/Body):** A highly legible sans-serif used for all functional UI elements, instructions, and descriptions. It excels in dense layouts where space is at a premium.
*   **IBM Plex Mono (Data):** Specifically utilized for GSTINs, currency amounts, and invoice numbers. The monospace nature ensures that digits align perfectly in columns, preventing misinterpretation of financial figures.

### Accessibility Note
Maintain a minimum contrast ratio of 4.5:1 for all body text. Monospaced data should use "tabular figures" where possible to ensure columns of numbers remain perfectly vertical.

## Layout & Spacing

The layout follows a **Density-First Fluid Grid** model. It is designed to maximize the "above the fold" information for CAs who need to triage large client lists.

### Grid System
- **Desktop:** 12-column fluid grid with 16px gutters.
- **Tablet:** 8-column grid with 16px gutters.
- **Mobile:** 4-column grid with 16px margins. Below 640px, tables collapse into high-density stacked cards.

### Spacing Rhythm
The system uses a 4px baseline shift. Layouts should favor tight vertical spacing (`sm` or `md`) to keep data rows compact. Use `lg` and `xl` spacing only for separating major logical sections or page headers.

### The "Reconciliation Strip"
This is the signature layout element. It is a horizontal 2-segment bar (Teal vs. Rust) that must be consistently placed at the start of client rows. It serves as a visual indicator of "Captured vs. Filed" progress.

## Elevation & Depth

To maintain the "Institutional" feel, this system avoids heavy shadows and complex blurs.

*   **Low-Contrast Outlines:** Depth is primarily communicated via `slate-200` hair-line borders. Surfaces are flat.
*   **Tonal Layering:** Use `paper-50` for the main canvas. Use pure white (`#FFFFFF`) for active surface elements like open cards or modals to make them "pop" slightly without needing shadows.
*   **Subtle Inset:** For interactive data fields or inputs, use a subtle 1px inset border or a slightly darker background shade to indicate "input capability" without breaking the flat aesthetic.
*   **No Glassmorphism:** Avoid translucent effects as they compromise the legibility of dense tabular data.

## Shapes

The shape language is **Soft (0.25rem)**. This provides a professional, modern touch without feeling too "consumer-grade" or overly friendly.

*   **Standard Elements:** Buttons, input fields, and tags use a 4px (`0.25rem`) corner radius.
*   **Large Elements:** Cards and modals use an 8px (`0.5rem`) radius.
*   **Reconciliation Strips:** These should have fully rounded (pill-shaped) ends to differentiate them from functional buttons.

## Components

### Buttons
*   **Primary:** `teal-600` background with white text. 4px roundedness.
*   **Secondary/Ghost:** `slate-200` border, `ink-900` text.
*   **Destructive:** `rust-600` text with a subtle background tint or border.

### Severity Badges
Small, high-contrast pills.
*   **High:** `rust-600` dot + Bold "HIGH" label.
*   **Medium:** `amber-500` dot + "MED" label.
*   **Success:** `moss-500` checkmark or dot + "OK" label.

### The Reconciliation Strip
A custom component:
*   Height: 8px to 12px.
*   Left Segment: `teal-600` (Filled invoices).
*   Right Segment: `slate-200` or `rust-600` (Missing invoices).
*   Total width scales to fill available column space in the dashboard.

### Input Fields
*   Border: 1px solid `slate-200`.
*   Focus State: 2px solid `teal-600` with no outer glow.
*   Font: `Inter` for labels, `IBM Plex Mono` for numeric inputs.

### Data Tables
*   Rows: 48px height for standard density; 40px for high-density.
*   Header: `label-caps` typography with a bottom border of `ink-900`.
*   Hover State: Background shifts to a 5% opacity version of `teal-600` to help guide the eye across the row.