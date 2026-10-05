# BillGuru AI

AI-Powered GST & Personal Tax Copilot for Indian Businesses, Salaried Professionals, and Chartered Accountants (CAs).

BillGuru AI acts as a proactive validation and tax organization layer via **WhatsApp**:
- **For Shop Owners & Small Businesses:** Snaps purchase/sales bills to catch fake GSTINs, tax slab errors, and protect Input Tax Credit (ITC) before filing.
- **For Salaried Professionals:** Snaps rent slips and investment proofs (80C/80D/HRA) into a WhatsApp Tax Locker, parses Form 16 PDFs, and optimizes Old vs. New Tax Regime.
- **For Chartered Accountants (CAs):** A multi-client command center providing unified client ledgers, OCR triage queues, and filing preparation for both GST and ITR seasons.

---

## 📂 Project Structure

*   **`backend/`**: Node.js + Express API server. Connects to a local MySQL instance (e.g. XAMPP). Contains schema scripts and handles invoice & proof processing webhooks, GSTIN validations, and client management.
*   **`frontend/`**: React + Vite SPA. Features the CA multi-client dashboard, ledgers, analytics, self-service portals, and includes a WhatsApp Bot phone simulator and screen emulator.
*   **`docs/`**: Product Requirements Documents (PRD), Architecture Designs, and Stitch exported UI code.

---

## ⚡ Key Features Integrated

1.  **CA Multi-Client Hub (Desktop & Mobile)**: Dense, ledger-style tables featuring monospaced amounts (`IBM Plex Mono`) and the signature **Reconciliation Strip** showing filing progress.
2.  **Compliance Analytics**: Statistics Bento grid and monthly **ITC Trend Analysis** bar chart.
3.  **Inward Triage Queue**: Fast verification screen for low-confidence WhatsApp OCR receipt parses.
4.  **WhatsApp Bot Simulator**: Phone chassis frame simulating how the bot handles business bills (checking GSTINs) and personal tax proofs.
5.  **Device Emulator Toggle**: Switch between Desktop Layout and simulated Mobile screen view.
6.  **XAMPP MySQL Integration**: Automatically handles database creation, schema tables setup, and mock client seeding on startup. Gracefully falls back to local mock memory if MySQL is offline.

---

## 🚀 How to Run Locally

### Prerequisites
*   Node.js installed (v18 or higher recommended).
*   **XAMPP** (or local MySQL server) installed and running.

### 1. Database Setup
1.  Open your **XAMPP Control Panel** and click **Start** next to the **MySQL** service (and optionally **Apache**).
2.  The backend is configured to automatically create the database `billguru_ai`, create all required tables, and seed them with initial mock data on first launch.

### 2. Run the Backend API
Navigate to the `backend` folder and start the server:
```bash
cd backend
npm install
npm run dev
```
The backend server will list on `http://localhost:5001`.

### 3. Run the Frontend Dashboard
Navigate to the `frontend` folder and start the dev server:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. Use the header toggle to switch between **Desktop View** and **Simulate Mobile**.

---

## 🔑 Environment Configuration (`.env`)

Create a `.env` file in the `backend/` directory to configure credentials:

```env
PORT=5001
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=billguru_ai
JWT_SECRET=billguru-super-secret-key-123
WHATSAPP_VERIFY_TOKEN=billguru_verify_token

# Production Cloud Keys
META_ACCESS_TOKEN=YOUR_META_SYSTEM_USER_ACCESS_TOKEN
META_PHONE_NUMBER_ID=YOUR_META_WHATSAPP_PHONE_NUMBER_ID
GEMINI_API_KEY=YOUR_GOOGLE_AI_STUDIO_API_KEY
```

---

## 🌐 Production Deployment

### 1. Backend Hosting (Render.com)
*   **Service Type:** Web Service
*   **Root Directory:** `backend`
*   **Build Command:** `npm install`
*   **Start Command:** `npm start`
*   **Environment Variables:** Copy all keys from your local `.env`. If a cloud database is not provided, the server automatically defaults to **Mock In-Memory DB Mode** (for easy interface demoing).

### 2. Frontend Hosting (Netlify)
*   **Base Directory:** `frontend`
*   **Build Command:** `npm run build`
*   **Publish Directory:** `dist` (resolves as `frontend/dist`)
*   **Environment Variables:** Add `VITE_API_BASE_URL` pointing to your Render server (e.g. `https://your-backend.onrender.com/api`).
*   **Client-Side Routing:** The repository includes a `frontend/public/_redirects` file (`/* /index.html 200`) which Netlify uses to prevent 404 page errors on page refresh.
