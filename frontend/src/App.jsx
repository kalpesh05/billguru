import React, { useState, useEffect, useRef } from 'react';

// MOCK DATA (Fallback for local offline testing if backend is down)
const localFallbackData = {
  businesses: [
    { id: 1, name: 'Meena Kirana Store', gstin: '24ABCDE1234F1Z5', whatsapp_number: '9123456789', onboarding_status: 'active', total_invoices: 9, filed_invoices: 7, high_flags: 2, medium_flags: 1, at_risk_amount: 4200.00 },
    { id: 2, name: 'Sharma Electronics', gstin: '24FGHIJ5678K2Z3', whatsapp_number: '9234567890', onboarding_status: 'active', total_invoices: 24, filed_invoices: 22, high_flags: 1, medium_flags: 0, at_risk_amount: 9000.00 },
    { id: 3, name: 'Patel Textiles', gstin: '24KLMNO9012P3Z1', whatsapp_number: '9345678901', onboarding_status: 'active', total_invoices: 15, filed_invoices: 15, high_flags: 0, medium_flags: 0, at_risk_amount: 0.00 }
  ],
  invoices: [
    { id: 1, business_id: 1, source_type: 'whatsapp', file_url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500', vendor_name: 'Sharma Wholesale', vendor_gstin: '24SHRMA1234A1Z9', invoice_number: 'INV-4521', invoice_date: '2026-07-15', taxable_amount: 23333.33, cgst_rate: 9.0, cgst_amount: 2100.00, sgst_rate: 9.0, sgst_amount: 2100.00, igst_rate: 0.0, igst_amount: 0.0, total_amount: 27533.33, hsn_sac_code: '8471', extraction_confidence: 0.95, extraction_status: 'extracted' },
    { id: 2, business_id: 1, source_type: 'whatsapp', file_url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500', vendor_name: 'Shrma Traders', vendor_gstin: '24SHRMA1234A1Z9', invoice_number: 'INV-4519', invoice_date: '2026-07-12', taxable_amount: 15000.00, cgst_rate: 9.0, cgst_amount: 1350.00, sgst_rate: 9.0, sgst_amount: 1350.00, igst_rate: 0.0, igst_amount: 0.0, total_amount: 17700.00, hsn_sac_code: '8471', extraction_confidence: 0.82, extraction_status: 'extracted' },
    { id: 3, business_id: 1, source_type: 'whatsapp', file_url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500', vendor_name: 'Unclear Vendor', vendor_gstin: '24SHRMA1234A1Z9', invoice_number: 'INV-9921', invoice_date: '2026-07-28', taxable_amount: 3420.50, cgst_rate: 0, cgst_amount: 0, sgst_rate: 0, sgst_amount: 0, igst_rate: 0, igst_amount: 0, total_amount: 3420.50, hsn_sac_code: null, extraction_confidence: 0.42, extraction_status: 'needs_review' },
    { id: 4, business_id: 2, source_type: 'whatsapp', file_url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500', vendor_name: 'Gupta Distributors', vendor_gstin: '24GUPTA9999K1Z2', invoice_number: 'SE-89102', invoice_date: '2026-07-20', taxable_amount: 50000.00, cgst_rate: 0.0, cgst_amount: 0.0, sgst_rate: 0.0, sgst_amount: 0.0, igst_rate: 18.0, igst_amount: 9000.00, total_amount: 59000.00, hsn_sac_code: '8528', extraction_confidence: 0.98, extraction_status: 'extracted' }
  ],
  flags: [
    { id: 1, invoice_id: 1, business_id: 1, flag_type: 'missing_itc', severity: 'high', message: 'Invoice #INV-4521 not found in filed GSTR-3B. Potential ITC loss: ₹4,200.00', resolved: false },
    { id: 2, invoice_id: 2, business_id: 1, flag_type: 'slab_mismatch', severity: 'medium', message: 'Tax rate mismatch on Invoice #INV-4519: Charged 18% GST (9% CGST + 9% SGST), but HSN code 8471 expects 12% expected rate.', resolved: false },
    { id: 3, invoice_id: 4, business_id: 2, flag_type: 'gstin_invalid', severity: 'high', message: 'The GSTIN (24GUPTA9999K1Z2) on this invoice from Gupta Distributors appears to be Cancelled.', resolved: false }
  ]
};

const FAQ_ITEMS = [
  {
    id: 1,
    category: 'General',
    q: 'Do I or my clients need to install any mobile app from Play Store or App Store?',
    a: 'No! BillGuru AI is completely WhatsApp-native for end clients (shop owners and salaried employees). They simply forward photos and PDFs to the BillGuru WhatsApp bot. CAs and managers access the dashboard on any desktop or mobile browser without downloading anything.'
  },
  {
    id: 2,
    category: 'Businesses & GST',
    q: 'Can a small shop owner use BillGuru AI without hiring a CA?',
    a: 'Yes! The Solo Shop (DIY) mode is specifically created for independent retailers and traders. BillGuru validates all incoming bills, catches fake or cancelled vendor GSTINs, and generates pre-filled GSTR-3B JSON files that you can directly upload to gst.gov.in for free.'
  },
  {
    id: 3,
    category: 'Businesses & GST',
    q: 'How does BillGuru AI prevent Input Tax Credit (ITC) rejection and fake GSTIN fraud?',
    a: 'When an invoice photo arrives, our engine extracts the supplier’s GSTIN and validates it in real time against the government GST registry. If a vendor’s GSTIN is cancelled, suspended, or invalid, you receive an immediate WhatsApp warning to pause vendor payment and reject the bill before it results in a tax notice.'
  },
  {
    id: 4,
    category: 'Salaried Employees',
    q: 'How does the AI Regime Optimizer decide between Old vs. New Tax Regime?',
    a: 'Under FY 2026-27 tax rules, the system compares: (1) Old Regime with standard deduction ₹50,000 + your recorded Section 80C, 80D, HRA rent, and 80G deductions against (2) New Regime with ₹75,000 standard deduction (Budget 2024 update) and lower progressive slabs. It calculates your net tax payable for both and highlights the exact amount saved.'
  },
  {
    id: 5,
    category: 'Salaried Employees',
    q: 'How does the WhatsApp Tax Locker work for year-round tax saving?',
    a: 'Throughout the financial year, whenever you pay rent, health insurance, term insurance, or donations, snap a photo and forward it to BillGuru on WhatsApp. The AI categorizes it, tracks your Section 80C/80D limits, and keeps everything ready for your HR proof submission and ITR filing.'
  },
  {
    id: 6,
    category: 'Chartered Accountants',
    q: 'How does the Inward Triage Queue assist CAs during monthly filing?',
    a: 'Instead of AI silently guessing on blurry or smudged receipts (which risks penalties), any scan with low confidence routes to the Inward Triage Queue. The CA sees the crop side-by-side with extracted values to approve with 1 click or request a clearer photo from the client.'
  },
  {
    id: 7,
    category: 'Security & Privacy',
    q: 'Is my financial, PAN, and invoice data confidential and secure?',
    a: 'Yes. All data is encrypted with bank-grade TLS 1.3 in transit and AES-256 at rest. BillGuru AI strictly complies with India’s Digital Personal Data Protection (DPDP) Act 2023. We never share or sell financial information.'
  }
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';


export default function App() {
  // Authentication State
  const [token, setToken] = useState(localStorage.getItem('bg_token') || null);
  const [caUser, setCaUser] = useState(JSON.parse(localStorage.getItem('bg_user')) || null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [authError, setAuthError] = useState('');
  
  // Auth Form Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regFirm, setRegFirm] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Dashboard Core State
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'inward', 'outward', 'onboard', 'client-detail', 'settings', 'analytics', 'whatsapp'
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  
  // Responsive & Simulation Controls
  const [isMobileSim, setIsMobileSim] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const isMobileLayout = isMobileSim || isMobileScreen;
  const [isEmptyState, setIsEmptyState] = useState(false);

  // Toast Notification System
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' | 'info', undoAction?: () => void }
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = 'success', undoAction = null) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type, undoAction });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Viewport resize detection for genuine mobile screens
  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Data States
  const [businesses, setBusinesses] = useState([]);
  const [invoices, setInvoices] = useState(localFallbackData.invoices);
  const [flags, setFlags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ledgerBusinessFilter, setLedgerBusinessFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  // Form States (Onboarding)
  const [newClientName, setNewClientName] = useState('');
  const [newClientGstin, setNewClientGstin] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [onboardMessage, setOnboardMessage] = useState({ text: '', type: '' });

  // Form States (Review Queue Editing)
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [editGstin, setEditGstin] = useState('');
  const [editVendor, setEditVendor] = useState('');
  const [editTotal, setEditTotal] = useState('');

  // Salaried Professional State (ITR & Tax Locker)
  const [salariedUser, setSalariedUser] = useState({
    id: 1,
    name: 'Ananya Sharma',
    pan: 'ABCPS1234F',
    employer_name: 'TechCorp India Pvt Ltd',
    annual_ctc: 1800000.00
  });

  const [salariedProofs, setSalariedProofs] = useState([
    { id: 1, category: '80D_health_insurance', title: 'HDFC ERGO Health Suraksha', amount: 25000, date: '2026-05-10', verified: true, pan: 'AAACH1234H' },
    { id: 2, category: '80C_elss', title: 'Mirae Asset Tax Saver ELSS Fund', amount: 150000, date: '2026-06-15', verified: true, pan: 'AAACM5555M' },
    { id: 3, category: 'hra_rent_receipt', title: 'House Rent (Bandra West, Mumbai)', amount: 240000, date: '2026-07-01', verified: true, pan: 'ABCDE9876K' },
    { id: 4, category: '80G_donation', title: 'PM National Relief Fund', amount: 10000, date: '2026-07-20', verified: true, pan: 'PMRF12345T' }
  ]);

  const [form16Record, setForm16Record] = useState({
    employer_name: 'TechCorp India Pvt Ltd',
    employer_tan: 'MUMB12345C',
    gross_salary: 1800000.00,
    standard_deduction: 75000.00,
    exemptions_total: 180000.00,
    taxable_salary: 1545000.00,
    tds_deducted: 165000.00
  });

  const [showAddProofModal, setShowAddProofModal] = useState(false);
  const [newProofCat, setNewProofCat] = useState('80C_elss');
  const [newProofTitle, setNewProofTitle] = useState('');
  const [newProofAmount, setNewProofAmount] = useState('');
  const [newProofDate, setNewProofDate] = useState('2026-07-15');
  const [newProofPan, setNewProofPan] = useState('');

  // Solo Business State (Shop Owner DIY Mode)
  const [soloShopGstin, setSoloShopGstin] = useState('24ABCDE1234F1Z5');
  const [soloShopName, setSoloShopName] = useState('Meena Kirana Store');

  // WhatsApp Simulation States
  const [whatsappMode, setWhatsappMode] = useState('business'); // 'business' or 'salaried'
  const [whatsappClient, setWhatsappClient] = useState('Meena Kirana Store');
  const [whatsappStatus, setWhatsappStatus] = useState('Active');
  const [whatsappMessages, setWhatsappMessages] = useState([
    { sender: 'client', text: 'Sent the latest purchase bills for July reconciliation.', time: '09:12 AM' },
    { sender: 'bot', text: 'Got it! Checking your invoice now — back to you shortly.', time: '09:13 AM' },
    { sender: 'bot', text: 'Couldn\'t clearly read the GSTIN on this one. Can you send a clearer photo, or reply with the GSTIN directly?', time: '09:15 AM', type: 'low-confidence' }
  ]);
  const [whatsappInput, setWhatsappInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Guide & FAQ Page States
  const [guideTab, setGuideTab] = useState('overview'); // 'overview', 'ca', 'business', 'salaried', 'faq'
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState(1);


  // Fetch helper with JWT header
  const authFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(url, { ...options, headers });
  };

  // Load Data
  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const bizRes = await authFetch(`${API_BASE_URL}/businesses`);
      if (!bizRes.ok) throw new Error('Unauthorised or API Server down');
      const bizData = await bizRes.json();
      
      const flagRes = await authFetch(`${API_BASE_URL}/ca/1/flags?resolved=false`);
      const flagData = await flagRes.json();
      
      setBusinesses(bizData);
      setFlags(flagData);
      setBackendConnected(true);
      
      // If a newly registered CA has 0 clients, trigger Empty State automatically
      if (bizData.length === 0) {
        setIsEmptyState(true);
      } else {
        setIsEmptyState(false);
      }
    } catch (err) {
      console.warn('API Server connection failed. Operating in Local Mock Mode.', err.message);
      setBackendConnected(false);
      // Recalculate local mock data filtered to simulated Rajesh Shah CA
      recalculateLocalStats();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const recalculateLocalStats = () => {
    // Only show mock items if user is Rajesh Shah (id: 1) or mock token CA Rajesh
    const activeCaId = caUser ? caUser.id : 1;
    if (activeCaId !== 1) {
      setBusinesses([]);
      setFlags([]);
      setIsEmptyState(true);
      return;
    }

    const updated = localFallbackData.businesses.map(b => {
      const bInvoices = invoices.filter(i => i.business_id === b.id);
      const bFlags = localFallbackData.flags.filter(f => f.business_id === b.id && !f.resolved);
      const highFlags = bFlags.filter(f => f.severity === 'high').length;
      const medFlags = bFlags.filter(f => f.severity === 'medium').length;
      const totalCaptured = bInvoices.filter(i => i.extraction_status !== 'needs_review').length;
      const missingITC = bFlags.filter(f => f.flag_type === 'missing_itc').length;
      const filedCount = Math.max(0, totalCaptured - missingITC);

      return {
        ...b,
        total_invoices: bInvoices.length,
        filed_invoices: filedCount,
        high_flags: highFlags,
        medium_flags: medFlags,
        at_risk_amount: b.id === 1 ? 4200.00 : (b.id === 2 ? 9000.00 : 0.00)
      };
    });
    setBusinesses(updated);
    setFlags(localFallbackData.flags.filter(f => !f.resolved));
    setIsEmptyState(false);
  };

  // --- ACTIONS ---

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('bg_token', data.token);
        localStorage.setItem('bg_user', JSON.stringify(data.user));
        setToken(data.token);
        setCaUser(data.user);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setAuthError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      // Local Mock Login fallback
      if (loginEmail === 'rajesh@shah.com' && loginPassword === 'rajesh123') {
        const mockUser = { id: 1, name: 'Rajesh Shah', firm_name: 'Shah & Associates', email: 'rajesh@shah.com', plan_tier: 'pro' };
        const mockToken = 'mock-jwt-1';
        localStorage.setItem('bg_token', mockToken);
        localStorage.setItem('bg_user', JSON.stringify(mockUser));
        setToken(mockToken);
        setCaUser(mockUser);
        setLoginEmail('');
        setLoginPassword('');
      } else if (loginEmail && loginPassword) {
        // Fallback registration check
        setAuthError('Connection failed. Default credential: rajesh@shah.com / rajesh123');
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          firm_name: regFirm,
          email: regEmail,
          phone: regPhone,
          password: regPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('bg_token', data.token);
        localStorage.setItem('bg_user', JSON.stringify(data.user));
        setToken(data.token);
        setCaUser(data.user);
        setRegName('');
        setRegFirm('');
        setRegEmail('');
        setRegPhone('');
        setRegPassword('');
      } else {
        setAuthError(data.error || 'Registration failed');
      }
    } catch (err) {
      // Local Mock Registration
      const mockUser = { id: Date.now(), name: regName, firm_name: regFirm, email: regEmail, plan_tier: 'trial' };
      const mockToken = `mock-jwt-${mockUser.id}`;
      localStorage.setItem('bg_token', mockToken);
      localStorage.setItem('bg_user', JSON.stringify(mockUser));
      setToken(mockToken);
      setCaUser(mockUser);
      setRegName('');
      setRegFirm('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bg_token');
    localStorage.removeItem('bg_user');
    setToken(null);
    setCaUser(null);
    setBusinesses([]);
    setFlags([]);
    setSelectedBusiness(null);
    setCurrentView('dashboard');
  };

  const handleResolveFlag = async (flagId) => {
    const targetFlag = flags.find(f => f.id === flagId);
    if (!targetFlag) return;

    // Optimistically mark as resolved
    setFlags(prev => prev.map(f => f.id === flagId ? { ...f, resolved: true } : f));
    showToast('Compliance flag resolved.', 'success', () => {
      // Undo action
      setFlags(prev => prev.map(f => f.id === flagId ? { ...f, resolved: false } : f));
      setTimeout(() => recalculateLocalStats(), 50);
    });

    try {
      if (backendConnected) {
        const res = await authFetch(`${API_BASE_URL}/flags/${flagId}/resolve`, { method: 'POST' });
        if (res.ok) loadData();
      } else {
        setTimeout(() => recalculateLocalStats(), 50);
      }
    } catch (err) {
      console.error(err);
      setFlags(prev => prev.map(f => f.id === flagId ? { ...f, resolved: false } : f));
      showToast('Failed to resolve flag on server.', 'error');
    }
  };

  const handleRejectInvoice = (invoiceId) => {
    const inv = invoices.find(i => i.id === invoiceId);
    const prevInvoices = [...invoices];
    setInvoices(prev => prev.filter(i => i.id !== invoiceId));
    showToast(`Invoice #${inv?.invoice_number || invoiceId} rejected and removed from queue.`, 'info', () => {
      setInvoices(prevInvoices);
    });
  };

  const handleConfirmInvoice = async (invoiceId, confirmData = null) => {
    try {
      const invToConfirm = invoices.find(i => i.id === invoiceId);
      const updatedInfo = confirmData || {
        vendor_name: invToConfirm?.vendor_name || 'Confirmed Vendor',
        vendor_gstin: invToConfirm?.vendor_gstin || '24SHRMA1234A1Z9',
        total_amount: invToConfirm?.total_amount || 3420.50,
      };

      if (backendConnected) {
        await authFetch(`${API_BASE_URL}/invoices/review`, {
          method: 'POST',
          body: JSON.stringify({
            invoice_id: invoiceId,
            action: 'confirm',
            updated_data: updatedInfo
          })
        });
        loadData();
      } else {
        setInvoices(prev => prev.map(i => i.id === invoiceId ? {
          ...i,
          ...updatedInfo,
          extraction_status: 'confirmed',
          extraction_confidence: 1.0
        } : i));
      }
      setEditingInvoiceId(null);
      showToast('Invoice confirmed and saved to ledger.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to confirm invoice.', 'error');
    }
  };

  const handleRequestClearerPhoto = async (invoiceId) => {
    showToast('Pre-configured WhatsApp request sent to client.', 'success');
    if (backendConnected) {
      await authFetch(`${API_BASE_URL}/invoices/review`, {
        method: 'POST',
        body: JSON.stringify({ invoice_id: invoiceId, action: 'request_clearer' })
      });
    }
  };

  const handleOnboardClient = async (e) => {
    e.preventDefault();
    setOnboardMessage({ text: '', type: '' });

    if (!newClientName || !newClientGstin || !newClientPhone) {
      setOnboardMessage({ text: 'All fields are mandatory', type: 'error' });
      return;
    }

    try {
      if (backendConnected) {
        const res = await authFetch(`${API_BASE_URL}/businesses`, {
          method: 'POST',
          body: JSON.stringify({
            name: newClientName,
            gstin: newClientGstin,
            whatsapp_number: newClientPhone
          })
        });
        const data = await res.json();
        if (res.ok) {
          setOnboardMessage({ text: 'Client invited! WhatsApp opt-in greeting dispatched.', type: 'success' });
          loadData();
          setNewClientName('');
          setNewClientGstin('');
          setNewClientPhone('');
        } else {
          setOnboardMessage({ text: data.error || 'Failed to onboard', type: 'error' });
        }
      } else {
        const newBiz = {
          id: businesses.length + 1,
          name: newClientName,
          gstin: newClientGstin,
          whatsapp_number: newClientPhone,
          onboarding_status: 'invited',
          total_invoices: 0,
          filed_invoices: 0,
          high_flags: 0,
          medium_flags: 0,
          at_risk_amount: 0.00
        };
        setBusinesses(prev => [...prev, newBiz]);
        setOnboardMessage({ text: 'Client invited! WhatsApp opt-in greeting dispatched.', type: 'success' });
        setNewClientName('');
        setNewClientGstin('');
        setNewClientPhone('');
      }
    } catch (err) {
      setOnboardMessage({ text: 'Failed to connect to backend API', type: 'error' });
    }
  };

  const handleSendWhatsAppMessage = (e) => {
    e.preventDefault();
    if (!whatsappInput.trim()) return;

    const userText = whatsappInput.trim();
    const newMsg = { sender: 'client', text: userText, time: '10:45 AM' };
    setWhatsappMessages(prev => [...prev, newMsg]);
    setWhatsappInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      setIsBotTyping(false);
      let botResponse = '';
      if (/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/i.test(userText)) {
        botResponse = `✅ Valid GSTIN received for ${whatsappClient}. Extraction completed successfully. ₹3,420 logged.`;
        if (!backendConnected) {
          setInvoices(prev => prev.map(i => i.id === 3 ? {
            ...i,
            vendor_gstin: userText.toUpperCase(),
            vendor_name: 'Bharti Gas Ltd',
            extraction_status: 'confirmed',
            extraction_confidence: 1.0
          } : i));
          setTimeout(() => recalculateLocalStats(), 50);
        }
      } else if (userText.toLowerCase().includes('clear') || userText.toLowerCase().includes('photo')) {
        botResponse = '✅ Got the photo! Processing extraction in queue...';
      } else {
        botResponse = '⚠️ GSTIN structure unrecognized. Please verify structure (e.g. 24ABCDE1234F1Z5).';
      }
      setWhatsappMessages(prev => [...prev, { sender: 'bot', text: botResponse, time: '10:46 AM' }]);
    }, 2000);
  };

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.gstin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCriticalIssues = flags.filter(f => !f.resolved && f.severity === 'high').length;

  const navItems = [
    { view: 'dashboard', label: 'CA Multi-Client', icon: 'dashboard' },
    { view: 'inward', label: 'Inward Queue', icon: 'receipt_long' },
    { view: 'outward', label: 'Sales Ledger', icon: 'upload_file' },
    { view: 'solo-business', label: 'Solo Shop (DIY)', icon: 'storefront' },
    { view: 'salaried-portal', label: 'Salaried Tax Locker', icon: 'account_balance_wallet' },
    { view: 'analytics', label: 'Analytics', icon: 'analytics' },
    { view: 'whatsapp', label: 'WhatsApp Sim', icon: 'chat' },
    { view: 'guide', label: 'Guide & FAQ', icon: 'help_outline' },
  ];


  const downloadItrJson = () => {
    const payload = {
      schema_version: 'ITR-1_AY_2027-28_V1.0',
      creation_date: new Date().toISOString(),
      personal_info: {
        assessee_name: salariedUser.name,
        pan: salariedUser.pan,
        employer_category: 'Private Sector',
        filing_section: '139(1) - On or before due date'
      },
      gross_total_income: {
        salary: salariedUser.annual_ctc,
        standard_deduction: 75000,
        income_chargeable_under_salary: salariedUser.annual_ctc - 75000
      },
      tax_computation: {
        regime: '115BAC (New Regime)',
        total_tax_and_cess: 215800,
        tds_credited: 165000,
        balance_payable: 50800
      }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ITR1_AY2027-28_${salariedUser.pan}.json`;
    a.click();
    showToast('Downloaded official ITR-1 JSON for incometax.gov.in!', 'success');
  };

  const downloadGstr3bJson = () => {
    const payload = {
      gstin: soloShopGstin,
      fp: '072026',
      filing_mode: 'DIY_SELF_SERVE',
      sup_details: {
        osup_det: { txval: 185000.00, camt: 16650.00, samt: 16650.00, iamt: 0.00 }
      },
      itc_elg: {
        itc_avl: [{ ty: 'OTH', txval: 72000.00, camt: 6480.00, samt: 6480.00, iamt: 0.00 }]
      }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GSTR3B_072026_${soloShopGstin}.json`;
    a.click();
    showToast('Downloaded GSTR-3B JSON ready for gst.gov.in!', 'success');
  };


  // --- RENDER LOGIN / REGISTER VIEW ---
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center p-md text-ink-900 selection:bg-teal-600/10 w-full">
        <div className="bg-[#F7F8F6] border border-slate-200 p-xl rounded shadow-2xl w-full max-w-md space-y-lg relative overflow-hidden">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-600 text-white font-headline-sm font-bold text-2xl rounded mb-sm">
              B
            </div>
            <h1 className="font-headline-md text-headline-md font-bold text-ink-900">BillGuru AI</h1>
            <p className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase text-xs mt-1">GST Compliance Copilot</p>
          </div>

          {authError && (
            <div className="p-sm bg-error-container border border-error-container/20 text-on-error-container text-body-sm font-bold rounded flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{authError}</span>
            </div>
          )}

          {authView === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-md">
              <div>
                <label className="font-label-caps text-on-surface-variant block mb-xs">Email Address</label>
                <input 
                  type="email" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. rajesh@shah.com"
                  className="w-full bg-white border border-slate-200 p-sm rounded text-body-sm focus:border-teal-600 focus:ring-0"
                  required
                />
              </div>

              <div>
                <label className="font-label-caps text-on-surface-variant block mb-xs">Password</label>
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 p-sm rounded text-body-sm focus:border-teal-600 focus:ring-0"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-teal-600 hover:bg-teal-600/90 text-white font-bold py-sm rounded transition-all active:scale-95 shadow-sm text-body-md"
              >
                Log In
              </button>

              <div className="text-center pt-xs">
                <button 
                  type="button" 
                  onClick={() => { setAuthView('register'); setAuthError(''); }}
                  className="text-xs text-teal-600 hover:underline font-label-caps font-bold"
                >
                  Create a new CA Firm Account
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-md">
              <div>
                <label className="font-label-caps text-on-surface-variant block mb-xs">CA Full Name</label>
                <input 
                  type="text" 
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Rajesh Shah"
                  className="w-full bg-white border border-slate-200 p-xs px-sm rounded text-body-sm focus:border-teal-600"
                  required
                />
              </div>

              <div>
                <label className="font-label-caps text-on-surface-variant block mb-xs">Firm Legal Name</label>
                <input 
                  type="text" 
                  value={regFirm}
                  onChange={(e) => setRegFirm(e.target.value)}
                  placeholder="e.g. Shah & Associates"
                  className="w-full bg-white border border-slate-200 p-xs px-sm rounded text-body-sm focus:border-teal-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="font-label-caps text-on-surface-variant block mb-xs text-xs">Email</label>
                  <input 
                    type="email" 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@firm.com"
                    className="w-full bg-white border border-slate-200 p-xs px-sm rounded text-xs focus:border-teal-600"
                    required
                  />
                </div>
                <div>
                  <label className="font-label-caps text-on-surface-variant block mb-xs text-xs">Phone Number</label>
                  <input 
                    type="text" 
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-white border border-slate-200 p-xs px-sm rounded text-xs focus:border-teal-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-label-caps text-on-surface-variant block mb-xs">Choose Password</label>
                <input 
                  type="password" 
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 p-sm rounded text-body-sm focus:border-teal-600 focus:ring-0"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-teal-600 hover:bg-teal-600/90 text-white font-bold py-sm rounded transition-all active:scale-95 shadow-sm text-body-md"
              >
                Register & Start Free Trial
              </button>

              <div className="text-center pt-xs">
                <button 
                  type="button" 
                  onClick={() => { setAuthView('login'); setAuthError(''); }}
                  className="text-xs text-teal-600 hover:underline font-label-caps font-bold"
                >
                  Already have an account? Log In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER CA DASHBOARD WORKSPACE (Authenticated) ---
  return (
    <div className="min-h-screen flex selection:bg-teal-600/10 bg-slate-900 justify-center items-center p-0 md:p-6 transition-all duration-300">
      
      {/* FULL-PAGE BACKEND CONNECTION LOADING OVERLAY */}
      {loading && businesses.length === 0 && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-md">
          <div className="bg-white rounded-lg p-lg max-w-sm w-full text-center shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-md"></div>
            <h3 className="font-headline-sm font-bold text-ink-900 text-lg mb-xs">Connecting to Workspace</h3>
            <p className="text-on-surface-variant text-body-sm mb-md leading-relaxed">
              Loading GST compliance ledger & client risk profiles...
            </p>
            <div className="text-[11px] bg-slate-100 text-on-surface-variant p-sm rounded text-left border border-slate-200">
              💡 <strong>Note:</strong> Free cloud servers may take ~30–45s to wake up on first visit.
            </div>
          </div>
        </div>
      )}

      {/* DEVICE EMULATOR WRAPPER */}
      <div className={`w-full bg-[#F7F8F6] ${
        isMobileSim && !isMobileScreen
          ? 'w-[390px] h-[844px] shadow-2xl border-[10px] border-slate-950 rounded-[45px] overflow-hidden flex flex-col relative' 
          : 'min-h-screen flex flex-col w-full'
      } transition-all duration-300 text-ink-900`}>
        
        {/* Mobile Status Bar inside Emulator (Only when emulating on desktop) */}
        {isMobileSim && !isMobileScreen && (
          <div className="h-8 bg-slate-950 text-white flex justify-between items-center px-6 text-[11px] select-none shrink-0 font-label-caps font-bold">
            <span>09:41</span>
            <div className="w-16 h-4 bg-black rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0"></div>
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[12px]">signal_cellular_4_bar</span>
              <span className="material-symbols-outlined text-[12px]">wifi</span>
              <span className="material-symbols-outlined text-[12px]">battery_5_bar</span>
            </div>
          </div>
        )}

        {/* --- DESKTOP SIDEBAR NAVIGATION (Hidden in Mobile layout) --- */}
        {!isMobileLayout && (
          <aside className="h-full w-64 fixed left-0 top-0 bg-paper-50 border-r border-slate-200 flex flex-col p-md z-50">
            <div className="mb-md">
              <div className="flex items-center gap-sm mb-xs">
                <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center text-white font-headline-sm font-bold">B</div>
                <span className="font-headline-sm text-headline-sm font-bold text-ink-900">BillGuru AI</span>
              </div>
              <p className="font-label-caps text-label-caps text-on-surface-variant opacity-70">GST Compliance Copilot</p>
            </div>

            {/* PRIMARY ACTION CTA: ELEVATED TO TOP */}
            <button 
              onClick={() => { setCurrentView('onboard'); setSelectedBusiness(null); }}
              className="w-full bg-teal-600 hover:bg-teal-600/90 text-white font-bold py-sm px-md rounded-lg mb-md transition-all text-body-sm shadow-sm active:scale-95 flex items-center justify-center gap-xs"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>＋ Add Client Business</span>
            </button>
            
            <nav className="flex-1 space-y-unit">
              {navItems.map(item => (
                <button 
                  key={item.view}
                  onClick={() => { setCurrentView(item.view); setSelectedBusiness(null); }}
                  className={`w-full flex items-center gap-md p-sm font-label-caps text-label-caps rounded-lg transition-all ${
                    currentView === item.view && !selectedBusiness
                      ? 'bg-secondary-container text-on-secondary-container font-bold' 
                      : 'text-on-surface-variant hover:bg-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            
            <div className="mt-auto pt-md space-y-unit border-t border-slate-200">
              <button 
                onClick={() => setCurrentView('settings')}
                className={`w-full flex items-center gap-md p-sm font-label-caps text-label-caps rounded-lg transition-all ${
                  currentView === 'settings' ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant hover:bg-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">settings</span>
                <span>Firm Management</span>
              </button>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-md p-sm font-label-caps text-label-caps text-rust-600 hover:bg-red-50 rounded-lg transition-all text-left"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span>Log Out ({caUser?.name?.split(' ')[0] || 'CA'})</span>
              </button>

              <div className="pt-sm flex items-center gap-sm">
                <span className={`w-2.5 h-2.5 rounded-full ${backendConnected ? 'bg-moss-500' : 'bg-amber-500 animate-pulse'}`}></span>
                <span className="text-[11px] font-label-caps text-on-surface-variant tracking-wider uppercase">
                  {backendConnected ? 'API Connected' : 'Local Fallback'}
                </span>
              </div>
            </div>
          </aside>
        )}

        {/* --- MAIN CORE SECTION --- */}
        <div className={`flex flex-col flex-1 min-h-0 overflow-y-auto custom-scrollbar ${!isMobileLayout ? 'ml-64' : ''}`}>
          
          {/* Top Bar / Header */}
          <header className={`w-full bg-surface border-b border-slate-200 flex justify-between items-center sticky top-0 z-40 shrink-0 ${
            isMobileLayout ? 'px-md h-12' : 'px-margin-desktop h-16'
          }`}>
            <div className="flex items-center gap-sm min-w-0">
              {isMobileLayout && selectedBusiness && (
                <button 
                  onClick={() => setSelectedBusiness(null)}
                  className="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0"
                >
                  arrow_back
                </button>
              )}
              <h1 className={`${isMobileLayout ? 'text-body-md font-bold' : 'font-headline-sm text-headline-sm font-bold'} text-teal-600 truncate`}>
                {selectedBusiness ? selectedBusiness.name : (caUser?.firm_name || 'BillGuru AI')}
              </h1>
            </div>
            
            <div className="flex items-center gap-md shrink-0">
              {!isMobileLayout && currentView === 'dashboard' && (
                <div className="relative w-48 lg:w-64">
                  <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60 text-[18px]">search</span>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search businesses..." 
                    className="w-full bg-surface-container border border-slate-200 pl-xl pr-sm py-xs rounded text-body-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 placeholder:text-on-surface-variant/50"
                  />
                </div>
              )}
              
              {!isMobileScreen && (
                <button 
                  onClick={() => {
                    setIsMobileSim(!isMobileSim);
                    setSelectedBusiness(null);
                  }}
                  className={`flex items-center gap-xs px-2.5 py-1 border rounded-full text-xs font-bold font-label-caps transition-all ${
                    isMobileSim 
                      ? 'bg-teal-600 text-white border-teal-600' 
                      : 'bg-white text-on-surface-variant hover:text-ink-900 border-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isMobileSim ? 'desktop_windows' : 'stay_current_portrait'}
                  </span>
                  <span>{isMobileSim ? 'Desktop View' : 'Simulate Mobile'}</span>
                </button>
              )}
            </div>
          </header>

          {/* VIEW RENDERER */}
          <div className={`${isMobileLayout ? 'p-md flex-1 overflow-y-auto space-y-md' : 'p-margin-desktop flex-1 space-y-lg'}`}>
            
            {/* VIEW: DASHBOARD (Active Client list / Empty state) */}
            {currentView === 'dashboard' && !selectedBusiness && (
              <>
                {/* Metrics Card (Desktop only) */}
                {!isMobileLayout && !isEmptyState && (
                  <div className="bg-white p-lg border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-md shadow-sm rounded-sm">
                    <div>
                      <h2 className="font-headline-md text-headline-md text-ink-900 mb-xs">{caUser?.firm_name || 'My Firm'}</h2>
                      <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-sm">
                        <span>Managed clients: <strong className="font-data-mono font-bold text-ink-900">{businesses.length}</strong></span>
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                        <span className="text-rust-600 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-rust-600"></span>
                          {totalCriticalIssues} client business(es) require attention
                        </span>
                      </p>
                    </div>
                    
                    <div className="flex gap-sm">
                      <div className="px-md py-sm bg-paper-50 border border-slate-200 flex flex-col rounded-sm">
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-xs">Active CA Profile</span>
                        <span className="font-data-mono text-data-mono font-bold text-ink-900">{caUser?.name}</span>
                      </div>
                      <div className="px-md py-sm bg-paper-50 border border-slate-200 flex flex-col rounded-sm">
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-xs">Billing Tier</span>
                        <span className="font-data-mono text-data-mono font-bold text-teal-600 uppercase">{caUser?.plan_tier} TIER</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dashboard Control Panel: State simulator (DEVELOPMENT ONLY) */}
                {import.meta.env.DEV && (
                  <div className="flex justify-between items-center bg-white border border-slate-200 p-sm rounded-sm shrink-0">
                    <span className="text-body-sm text-on-surface-variant font-bold uppercase tracking-wide flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px] text-teal-600">tune</span>
                      Dev Layout Toggles:
                    </span>
                    <div className="flex gap-sm">
                      <button 
                        onClick={() => setIsEmptyState(!isEmptyState)}
                        className={`px-3 py-1 text-xs border rounded-full font-bold font-label-caps transition-all ${
                          isEmptyState 
                            ? 'bg-amber-500 text-white border-amber-500' 
                            : 'bg-white text-on-surface-variant hover:text-ink-900 border-slate-200'
                        }`}
                      >
                        {isEmptyState ? 'Simulating Empty' : 'Simulate Empty State'}
                      </button>
                    </div>
                  </div>
                )}

                {/* CONDITION: EMPTY STATE ACTIVE */}
                {isEmptyState ? (
                  <div className="grid grid-cols-12 gap-gutter max-w-7xl mx-auto w-full">
                    <div className={`col-span-12 ${isMobileLayout ? 'col-span-12' : 'lg:col-span-8'} bg-white border border-slate-200 p-lg md:p-xl relative overflow-hidden flex flex-col justify-center min-h-[380px] rounded-sm shadow-sm`}>
                      <div className="relative z-10">
                        <div className="mb-md inline-flex items-center justify-center w-12 h-12 bg-surface-container text-teal-600 rounded">
                          <span className="material-symbols-outlined text-3xl">folder_off</span>
                        </div>
                        <h3 className="font-headline-md text-headline-sm md:text-headline-md text-ink-900 mb-xs">Your Ledger is Quiet</h3>
                        <p className="font-body-md text-on-surface-variant mb-lg leading-relaxed">
                          No client businesses connected to this CA account yet. Forward invoices to start auto-processing.
                        </p>
                        
                        {/* Guided Checklist Section */}
                        <div className="mb-lg bg-surface-container-low border border-slate-200 rounded p-md space-y-md">
                          <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-xs flex items-center gap-xs font-bold">
                            <span className="material-symbols-outlined text-[16px]">checklist</span>
                            Quick Start Checklist
                          </h4>
                          
                          <div className="space-y-sm">
                            <div className="flex items-start gap-md group">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold">1</div>
                              <div>
                                <p className="font-body-sm font-bold text-ink-900 leading-tight">CA Account Created</p>
                                <p className="text-[11px] text-on-surface-variant leading-normal">Your firm is set up on the {caUser?.plan_tier} tier.</p>
                              </div>
                              <span className="material-symbols-outlined text-moss-500 ml-auto text-[18px]">check_circle</span>
                            </div>
                            
                            <div className="flex items-start gap-md group">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-[10px] font-bold">2</div>
                              <div>
                                <p className="font-body-sm font-bold text-on-surface-variant leading-tight">Add Your First Client Business</p>
                                <p className="text-[11px] text-on-surface-variant leading-normal">Enter their business name, phone number, and GSTIN code.</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-sm">
                          <button 
                            onClick={() => setCurrentView('onboard')}
                            className="px-md py-sm bg-teal-600 hover:bg-teal-600/90 text-white font-bold text-body-sm rounded-sm flex items-center gap-xs shadow active:scale-95"
                          >
                            <span className="material-symbols-outlined text-[18px]">person_add</span>
                            Add First Client
                          </button>
                        </div>
                      </div>
                    </div>

                    {!isMobileLayout && (
                      <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
                        <div className="bg-white border border-slate-200 p-lg rounded-sm shadow-sm">
                          <p className="font-label-caps text-label-caps text-teal-600 mb-xs uppercase font-bold">Commercial Integration</p>
                          <h4 className="font-headline-sm text-headline-sm text-ink-900 mb-xs">CA Multi-Tenancy</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                            You are logged in under a secure account. Your dashboard acts independently from other firms.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  
                  // CONDITION: POPULATED CLIENT LIST
                  <>
                    {/* MOBILE DEVICE LAYOUT (Card List) */}
                    {isMobileLayout ? (
                      <div className="space-y-sm">
                        {filteredBusinesses.map(business => {
                          const total = business.total_invoices || 0;
                          const filed = business.filed_invoices || 0;
                          const filedPercent = total > 0 ? (filed / total) * 100 : 100;
                          const missingPercent = total > 0 ? ((total - filed) / total) * 100 : 0;
                          const hasHigh = business.high_flags > 0;
                          const hasMed = business.medium_flags > 0;

                          return (
                            <div 
                              key={business.id}
                              onClick={() => { setSelectedBusiness(business); setCurrentView('client-detail'); }}
                              className="bg-white border border-slate-200 p-md rounded shadow-sm hover:border-teal-600/30 transition-all cursor-pointer flex flex-col gap-sm"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                  <span className="text-body-md font-bold text-ink-900">{business.name}</span>
                                  <span className="text-[10px] font-data-mono text-on-surface-variant">GST: {business.gstin}</span>
                                </div>
                                {hasHigh ? (
                                  <span className="px-2 py-0.5 bg-error-container text-rust-600 font-bold rounded text-[8px] font-label-caps">HIGH</span>
                                ) : hasMed ? (
                                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 font-bold rounded text-[8px] font-label-caps">MED</span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-moss-500/10 text-moss-500 font-bold rounded text-[8px] font-label-caps">OK</span>
                                )}
                              </div>

                              <div>
                                <div className="flex justify-between items-center text-[10px] text-on-surface-variant mb-1 font-label-caps">
                                  <span>Captured/Filed Progress</span>
                                  <span className="font-data-mono font-bold text-ink-900">{filed}/{total}</span>
                                </div>
                                {total > 0 ? (
                                  <div className="reconciliation-strip h-2">
                                    <div className="bg-teal-600 h-full" style={{ width: `${filedPercent}%` }}></div>
                                    <div className="bg-rust-600/60 h-full" style={{ width: `${missingPercent}%` }}></div>
                                  </div>
                                ) : (
                                  <div className="reconciliation-strip h-2">
                                    <div className="bg-slate-300 h-full w-full"></div>
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-sm">
                                <span className="text-on-surface-variant">At-Risk Value:</span>
                                <span className="font-data-mono font-bold text-rust-600">₹{business.at_risk_amount}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      
                      // DESKTOP LAYOUT (Dense table)
                      <div className="bg-white border border-slate-200 overflow-hidden shadow-sm rounded-sm">
                        <div className="px-md py-sm bg-paper-50 border-b border-slate-200 flex justify-between items-center">
                          <h3 className="font-label-caps text-label-caps text-ink-900 font-bold">CLIENT LEDGER REGISTRY</h3>
                          <span className="text-body-sm text-on-surface-variant">Showing {filteredBusinesses.length} businesses</span>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-white">
                                <th className="px-md py-sm border-b border-ink-900 text-left font-label-caps text-label-caps text-ink-900 w-16">Risk</th>
                                <th className="px-md py-sm border-b border-ink-900 text-left font-label-caps text-label-caps text-ink-900">Business Name</th>
                                <th className="px-md py-sm border-b border-ink-900 text-left font-label-caps text-label-caps text-ink-900 w-1/4">Reconciliation Progress</th>
                                <th className="px-md py-sm border-b border-ink-900 text-right font-label-caps text-label-caps text-ink-900">Count</th>
                                <th className="px-md py-sm border-b border-ink-900 text-right font-label-caps text-label-caps text-ink-900">At-Risk Value</th>
                                <th className="px-md py-sm border-b border-ink-900 text-center font-label-caps text-label-caps text-ink-900 w-24">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredBusinesses.map(business => {
                                const total = business.total_invoices || 0;
                                const filed = business.filed_invoices || 0;
                                const filedPercent = total > 0 ? (filed / total) * 100 : 100;
                                const missingPercent = total > 0 ? ((total - filed) / total) * 100 : 0;
                                
                                const hasHigh = business.high_flags > 0;
                                const hasMed = business.medium_flags > 0;

                                return (
                                  <tr 
                                    key={business.id}
                                    onClick={() => { setSelectedBusiness(business); setCurrentView('client-detail'); }}
                                    className="hover:bg-teal-600/5 group transition-colors cursor-pointer border-b border-slate-100"
                                  >
                                    <td className="px-md py-md">
                                      {hasHigh ? (
                                        <div className="flex items-center gap-xs">
                                          <div className="w-2.5 h-2.5 rounded-full bg-rust-600"></div>
                                          <span className="font-label-caps text-label-caps text-rust-600 font-bold">HIGH</span>
                                        </div>
                                      ) : hasMed ? (
                                        <div className="flex items-center gap-xs">
                                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                          <span className="font-label-caps text-label-caps text-amber-500 font-bold">MED</span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-xs">
                                          <div className="w-2.5 h-2.5 rounded-full bg-moss-500"></div>
                                          <span className="font-label-caps text-label-caps text-moss-500 font-bold">OK</span>
                                        </div>
                                      )}
                                    </td>
                                    
                                    <td className="px-md py-md">
                                      <div className="flex flex-col">
                                        <span className="font-body-md text-body-md font-bold text-ink-900 group-hover:text-teal-600 transition-colors">
                                          {business.name}
                                        </span>
                                        <span className="text-xs font-data-mono text-on-surface-variant mt-0.5">
                                          GSTIN: {business.gstin}
                                        </span>
                                      </div>
                                    </td>
                                    
                                    <td className="px-md py-md">
                                      {total > 0 ? (
                                        <div className="reconciliation-strip">
                                          <div className="bg-teal-600 h-full transition-all" style={{ width: `${filedPercent}%` }}></div>
                                          <div className="bg-rust-600/60 h-full transition-all" style={{ width: `${missingPercent}%` }}></div>
                                        </div>
                                      ) : (
                                        <div className="reconciliation-strip">
                                          <div className="bg-slate-300 h-full w-full"></div>
                                        </div>
                                      )}
                                    </td>
                                    
                                    <td className="px-md py-md text-right font-data-mono text-data-mono text-ink-900">
                                      {total > 0 ? `${filed}/${total}` : '0/0'}
                                    </td>
                                    
                                    <td className="px-md py-md text-right font-data-mono text-data-mono font-bold text-ink-900">
                                      ₹{business.at_risk_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    
                                    <td className="px-md py-md text-center">
                                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-teal-600 transition-colors">
                                        chevron_right
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* VIEW: INWARD QUEUE (Invoice Review Queue) */}
            {currentView === 'inward' && (
              <div className="space-y-lg max-w-7xl mx-auto w-full">
                <div>
                  <h3 className="font-headline-md text-headline-sm md:text-headline-md text-ink-900 mb-xs">Invoice Review Queue</h3>
                  <p className="text-on-surface-variant text-body-md">Confirm extraction results for low confidence captures from WhatsApp.</p>
                </div>

                <div className="space-y-gutter">
                  {invoices.filter(i => i.extraction_status === 'needs_review').length === 0 ? (
                    <div className="bg-white border border-slate-200 p-xl text-center rounded-sm">
                      <span className="material-symbols-outlined text-moss-500 text-[48px] mb-sm">task_alt</span>
                      <h4 className="font-headline-sm font-bold text-ink-900 mb-xs">Review Queue Clean</h4>
                      <p className="text-on-surface-variant text-body-md">All WhatsApp uploads successfully reconciled.</p>
                    </div>
                  ) : (
                    invoices.filter(i => i.extraction_status === 'needs_review').map(invoice => {
                      const client = businesses.find(b => b.id === invoice.business_id);
                      const isEditing = editingInvoiceId === invoice.id;

                      return (
                        <section 
                          key={invoice.id} 
                          className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col md:flex-row h-auto md:h-52 group hover:border-teal-600/30 transition-all"
                        >
                          <div className="w-full md:w-1/4 h-48 md:h-full bg-slate-50 border-r border-slate-100 flex items-center justify-center p-md relative overflow-hidden">
                            {invoice.file_url ? (
                              <img 
                                src={invoice.file_url} 
                                alt="raw invoice" 
                                className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="text-center text-on-surface-variant">
                                <span className="material-symbols-outlined text-[36px] opacity-40">receipt</span>
                                <p className="text-xs">No attachment</p>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 p-lg flex flex-col justify-between">
                            <div className="grid grid-cols-12 gap-md">
                              <div className="col-span-12 md:col-span-6">
                                <label className="font-label-caps text-on-surface-variant block mb-xs uppercase tracking-tight">Vendor Name</label>
                                {isEditing ? (
                                  <input 
                                    type="text" 
                                    value={editVendor}
                                    onChange={(e) => setEditVendor(e.target.value)}
                                    className="w-full bg-white border border-slate-200 p-sm rounded text-body-sm focus:border-teal-600 focus:ring-0"
                                  />
                                ) : (
                                  <div className="flex items-center gap-sm mb-xs">
                                    <h4 className="font-headline-sm text-ink-900 font-bold">{invoice.vendor_name || 'OM ENTERPRISES LTD.'}</h4>
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-error-container text-rust-600 rounded-full">
                                      <span className="w-1.5 h-1.5 bg-rust-600 rounded-full"></span>
                                      <span className="text-[10px] font-bold">LOW CONFIDENCE</span>
                                    </div>
                                  </div>
                                )}
                                <p className="text-body-sm text-on-surface-variant italic">
                                  Client: {client ? client.name : 'Unknown Client'}
                                </p>
                              </div>

                              <div className="col-span-12 md:col-span-6">
                                <label className="font-label-caps text-on-surface-variant block mb-xs uppercase tracking-tight">GSTIN (Extracted)</label>
                                {isEditing ? (
                                  <input 
                                    type="text" 
                                    value={editGstin}
                                    onChange={(e) => setEditGstin(e.target.value)}
                                    className="w-full bg-white border border-slate-200 p-sm rounded font-data-mono text-body-sm focus:border-teal-600 focus:ring-0"
                                  />
                                ) : (
                                  <div className="flex items-center gap-sm">
                                    <span className="font-data-mono text-headline-sm tracking-tight text-rust-600 bg-rust-600/5 px-2 py-1 border border-rust-600/20 rounded">
                                      {invoice.vendor_gstin || '27AAAC[O]456Z1ZX'}
                                    </span>
                                    <span className="material-symbols-outlined text-amber-500 text-[20px]" title="Verify character 'O' vs '0'">help</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="pt-md border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-sm mt-md">
                              <div>
                                {isEditing ? (
                                  <div className="flex items-center gap-sm">
                                    <span className="text-body-sm font-bold">Amount: </span>
                                    <input 
                                      type="number" 
                                      value={editTotal}
                                      onChange={(e) => setEditTotal(e.target.value)}
                                      className="w-28 bg-white border border-slate-200 p-1 rounded font-data-mono text-body-sm"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex gap-md mb-xs font-data-mono text-data-mono text-ink-900 font-bold">
                                    ₹{invoice.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-sm">
                                {isEditing ? (
                                  <>
                                    <button 
                                      onClick={() => setEditingInvoiceId(null)}
                                      className="px-md py-1.5 border border-slate-200 text-ink-900 font-bold hover:bg-slate-50 transition-colors rounded text-body-sm"
                                    >
                                      Cancel
                                    </button>
                                    <button 
                                      onClick={() => handleConfirmInvoice(invoice.id, {
                                        vendor_name: editVendor,
                                        vendor_gstin: editGstin,
                                        total_amount: parseFloat(editTotal) || 0
                                      })}
                                      className="px-lg py-1.5 bg-teal-600 text-white font-bold hover:bg-teal-600/90 transition-colors rounded text-body-sm"
                                    >
                                      Save
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button 
                                      onClick={() => handleRejectInvoice(invoice.id)}
                                      className="px-md py-1.5 border border-red-200 text-rust-600 hover:bg-red-50 font-bold transition-colors rounded text-body-sm flex items-center gap-xs"
                                      title="Discard from review queue"
                                    >
                                      <span className="material-symbols-outlined text-[16px]">close</span>
                                      Reject
                                    </button>
                                    <button 
                                      onClick={() => handleRequestClearerPhoto(invoice.id)}
                                      className="px-md py-1.5 border border-slate-200 text-ink-900 font-bold hover:bg-slate-50 transition-colors rounded text-body-sm flex items-center gap-xs"
                                    >
                                      <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                                      Photo
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setEditingInvoiceId(invoice.id);
                                        setEditGstin(invoice.vendor_gstin || '27AAACO456Z1ZX');
                                        setEditVendor(invoice.vendor_name || 'OM ENTERPRISES LTD.');
                                        setEditTotal(invoice.total_amount || 45200);
                                      }}
                                      className="px-md py-1.5 border border-slate-200 text-ink-900 font-bold hover:bg-slate-50 transition-colors rounded text-body-sm"
                                    >
                                      Edit
                                    </button>
                                    <button 
                                      onClick={() => handleConfirmInvoice(invoice.id)}
                                      className="px-lg py-1.5 bg-teal-600 text-white font-bold hover:bg-teal-600/90 transition-colors rounded text-body-sm shadow active:scale-95"
                                    >
                                      Confirm
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </section>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* VIEW: OUTWARD REGISTER (Sales Ledger) */}
            {currentView === 'outward' && (() => {
              const ledgerInvoices = invoices.filter(i => {
                if (i.extraction_status === 'needs_review') return false;
                if (ledgerBusinessFilter !== 'all' && i.business_id !== Number(ledgerBusinessFilter)) return false;
                return true;
              });

              const totalTaxable = ledgerInvoices.reduce((sum, i) => sum + (Number(i.taxable_amount) || 0), 0);
              const totalCgstSgst = ledgerInvoices.reduce((sum, i) => sum + ((Number(i.cgst_amount) || 0) + (Number(i.sgst_amount) || 0)), 0);
              const totalIgst = ledgerInvoices.reduce((sum, i) => sum + (Number(i.igst_amount) || 0), 0);
              const grandTotal = ledgerInvoices.reduce((sum, i) => sum + (Number(i.total_amount) || 0), 0);

              return (
                <div className="space-y-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
                    <div>
                      <h3 className="font-headline-md text-headline-sm md:text-headline-md text-ink-900 mb-xs">Sales Outward Register</h3>
                      <p className="text-on-surface-variant text-body-md">Comprehensive sales ledger. Monetary figures aligned for compliance verification.</p>
                    </div>

                    <div className="flex items-center gap-sm bg-white border border-slate-200 p-1.5 px-3 rounded shadow-sm">
                      <label className="text-xs font-bold text-on-surface-variant uppercase font-label-caps shrink-0">Client:</label>
                      <select 
                        value={ledgerBusinessFilter} 
                        onChange={(e) => setLedgerBusinessFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs font-medium py-1 px-2 rounded focus:ring-2 focus:ring-teal-600 text-ink-900 outline-none"
                      >
                        <option value="all">All Clients ({businesses.length})</option>
                        {businesses.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {isMobileLayout ? (
                    <div className="space-y-sm">
                      {ledgerInvoices.map(invoice => (
                        <div key={invoice.id} className="bg-white border border-slate-200 p-md rounded shadow-sm flex flex-col gap-sm font-body-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-data-mono font-bold text-teal-600">{invoice.invoice_number}</span>
                            <span className="font-data-mono text-on-surface-variant">{invoice.invoice_date}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-ink-900">{invoice.vendor_name}</span>
                            <span className="font-data-mono text-on-surface-variant">GST: {invoice.vendor_gstin}</span>
                          </div>
                          <div className="flex justify-between items-center border-t border-slate-100 pt-sm font-data-mono font-bold">
                            <span className="text-on-surface-variant text-[11px] font-label-caps">Total:</span>
                            <span className="text-ink-900">₹{invoice.total_amount.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 overflow-hidden shadow-sm rounded-sm">
                      <div className="px-md py-sm bg-paper-50 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-label-caps text-label-caps text-ink-900 font-bold">MONOSPACED SALES RECORDS</h3>
                        <span className="text-body-sm text-on-surface-variant">Showing {ledgerInvoices.length} records</span>
                      </div>

                      <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-white border-b border-slate-200">
                              <th className="px-md py-sm text-left font-label-caps text-label-caps text-ink-900">Invoice No.</th>
                              <th className="px-md py-sm text-left font-label-caps text-label-caps text-ink-900">Date</th>
                              <th className="px-md py-sm text-left font-label-caps text-label-caps text-ink-900">Vendor / Customer</th>
                              <th className="px-md py-sm text-left font-label-caps text-label-caps text-ink-900">GSTIN</th>
                              <th className="px-md py-sm text-left font-label-caps text-label-caps text-ink-900 w-16">HSN</th>
                              <th className="px-md py-sm text-right font-label-caps text-label-caps text-ink-900">Taxable Val</th>
                              <th className="px-md py-sm text-right font-label-caps text-label-caps text-ink-900">CGST+SGST</th>
                              <th className="px-md py-sm text-right font-label-caps text-label-caps text-ink-900">IGST</th>
                              <th className="px-md py-sm text-right font-label-caps text-label-caps text-ink-900">Total Amt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ledgerInvoices.map(invoice => (
                              <tr key={invoice.id} className="hover:bg-teal-600/5 transition-colors border-b border-slate-100">
                                <td className="px-md py-md font-data-mono text-data-mono text-ink-900 font-bold">{invoice.invoice_number}</td>
                                <td className="px-md py-md font-data-mono text-data-mono text-on-surface-variant">{invoice.invoice_date}</td>
                                <td className="px-md py-md font-body-md text-body-md text-ink-900">{invoice.vendor_name}</td>
                                <td className="px-md py-md font-data-mono text-data-mono text-on-surface-variant">{invoice.vendor_gstin}</td>
                                <td className="px-md py-md font-data-mono text-data-mono text-center">{invoice.hsn_sac_code || '—'}</td>
                                <td className="px-md py-md text-right font-data-mono text-data-mono text-ink-900">₹{invoice.taxable_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                <td className="px-md py-md text-right font-data-mono text-data-mono text-ink-900">
                                  ₹{(invoice.cgst_amount + invoice.sgst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                  <span className="text-[10px] text-on-surface-variant block">{invoice.cgst_rate > 0 ? `@${invoice.cgst_rate * 2}%` : '—'}</span>
                                </td>
                                <td className="px-md py-md text-right font-data-mono text-data-mono text-ink-900">
                                  ₹{invoice.igst_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                  <span className="text-[10px] text-on-surface-variant block">{invoice.igst_rate > 0 ? `@${invoice.igst_rate}%` : '—'}</span>
                                </td>
                                <td className="px-md py-md text-right font-data-mono text-data-mono text-ink-900 font-bold">₹{invoice.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              </tr>
                            ))}
                          </tbody>
                          {ledgerInvoices.length > 0 && (
                            <tfoot>
                              <tr className="bg-slate-50 border-t-2 border-slate-300 font-bold text-ink-900">
                                <td colSpan={5} className="px-md py-sm font-label-caps text-label-caps uppercase">Total ({ledgerInvoices.length} Invoices)</td>
                                <td className="px-md py-sm text-right font-data-mono text-data-mono">₹{totalTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                <td className="px-md py-sm text-right font-data-mono text-data-mono">₹{totalCgstSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                <td className="px-md py-sm text-right font-data-mono text-data-mono">₹{totalIgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                <td className="px-md py-sm text-right font-data-mono text-data-mono text-teal-700">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              </tr>
                            </tfoot>
                          )}
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* VIEW: SOLO BUSINESS (Shop Owner DIY Mode) */}
            {currentView === 'solo-business' && (() => {
              const shopInvoices = invoices.filter(i => i.business_id === 1);
              const validInvoices = shopInvoices.filter(i => i.extraction_status !== 'needs_review');
              const totalTaxable = validInvoices.reduce((s, i) => s + (Number(i.taxable_amount) || 0), 0);
              const totalTax = validInvoices.reduce((s, i) => s + (Number(i.cgst_amount) || 0) + (Number(i.sgst_amount) || 0) + (Number(i.igst_amount) || 0), 0);
              const blockedVendor = shopInvoices.find(i => i.vendor_gstin === '24GUPTA9999K1Z2' || i.extraction_status === 'needs_review');

              return (
                <div className="space-y-lg">
                  {/* Shop Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md bg-white border border-slate-200 p-md md:p-lg rounded shadow-sm">
                    <div>
                      <div className="flex items-center gap-sm">
                        <span className="material-symbols-outlined text-teal-600 text-[28px]">storefront</span>
                        <h2 className="font-headline-md text-headline-md font-bold text-ink-900">{soloShopName}</h2>
                        <span className="px-sm py-xs bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full uppercase tracking-wider">
                          Solo DIY Mode (No CA)
                        </span>
                      </div>
                      <p className="text-body-sm text-on-surface-variant font-data-mono mt-1">
                        GSTIN: {soloShopGstin} • State: Gujarat (24) • Filing Period: July 2026
                      </p>
                    </div>

                    <div className="flex items-center gap-sm w-full md:w-auto">
                      <button
                        onClick={downloadGstr3bJson}
                        className="flex-1 md:flex-initial bg-teal-600 hover:bg-teal-700 text-white font-bold py-sm px-md rounded transition-all text-body-sm flex items-center justify-center gap-xs shadow-sm active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        <span>Download GSTR-3B JSON</span>
                      </button>
                      <button
                        onClick={() => { setCurrentView('whatsapp'); setWhatsappMode('business'); }}
                        className="bg-paper-50 hover:bg-slate-200 border border-slate-300 text-ink-900 font-bold py-sm px-md rounded transition-all text-body-sm flex items-center gap-xs"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                        <span>Snap on WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Warning / Error Prevention Banner */}
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-md rounded flex items-start gap-md">
                    <span className="material-symbols-outlined text-amber-600 text-[24px]">verified_user</span>
                    <div className="flex-1">
                      <h4 className="font-label-caps text-label-caps font-bold text-amber-900">PROACTIVE FRAUD & NOTICE SHIELD ACTIVE</h4>
                      <p className="text-body-sm text-amber-800 mt-0.5">
                        BillGuru AI automatically checked your vendor GSTINs against the government database. 1 invalid/cancelled vendor bill was blocked, saving you from a ₹4,200 penalty notice from the GST department!
                      </p>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                    <div className="bg-white border border-slate-200 p-md rounded shadow-sm">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">Total Bills Scanned</span>
                      <p className="font-data-mono text-headline-md font-bold text-ink-900 mt-xs">{shopInvoices.length}</p>
                      <span className="text-[11px] text-teal-600 font-medium">via WhatsApp</span>
                    </div>

                    <div className="bg-white border border-slate-200 p-md rounded shadow-sm">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">Total Taxable Purchases</span>
                      <p className="font-data-mono text-headline-md font-bold text-ink-900 mt-xs">₹{totalTaxable.toLocaleString('en-IN')}</p>
                      <span className="text-[11px] text-on-surface-variant">Purchase ledger</span>
                    </div>

                    <div className="bg-white border border-slate-200 p-md rounded shadow-sm">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">Verified ITC Saved</span>
                      <p className="font-data-mono text-headline-md font-bold text-emerald-600 mt-xs">₹{totalTax.toLocaleString('en-IN')}</p>
                      <span className="text-[11px] text-emerald-700">100% safe to claim</span>
                    </div>

                    <div className="bg-white border border-slate-200 p-md rounded shadow-sm">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">Estimated Net GST to Pay</span>
                      <p className="font-data-mono text-headline-md font-bold text-teal-700 mt-xs">₹13,500</p>
                      <span className="text-[11px] text-on-surface-variant">Due by 20th August</span>
                    </div>
                  </div>

                  {/* Shop Purchase Invoices Table */}
                  <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
                    <div className="p-md bg-paper-50 border-b border-slate-200 flex justify-between items-center">
                      <div>
                        <h3 className="font-label-caps text-label-caps font-bold text-ink-900">YOUR VERIFIED PURCHASE BILLS</h3>
                        <p className="text-body-sm text-on-surface-variant">Every bill is OCR-verified with active GSTIN confirmation</p>
                      </div>
                      <span className="text-body-sm font-data-mono text-on-surface-variant">{validInvoices.length} Verified</span>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-white border-b border-slate-200">
                            <th className="px-md py-sm text-left font-label-caps text-label-caps text-ink-900">Invoice #</th>
                            <th className="px-md py-sm text-left font-label-caps text-label-caps text-ink-900">Supplier Name</th>
                            <th className="px-md py-sm text-left font-label-caps text-label-caps text-ink-900">GSTIN Status</th>
                            <th className="px-md py-sm text-right font-label-caps text-label-caps text-ink-900">Taxable</th>
                            <th className="px-md py-sm text-right font-label-caps text-label-caps text-ink-900">GST Rate</th>
                            <th className="px-md py-sm text-right font-label-caps text-label-caps text-ink-900">Total Amt</th>
                            <th className="px-md py-sm text-center font-label-caps text-label-caps text-ink-900">Compliance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shopInvoices.map(inv => (
                            <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                              <td className="px-md py-md font-data-mono font-bold text-ink-900">{inv.invoice_number}</td>
                              <td className="px-md py-md font-body-md text-ink-900">{inv.vendor_name}</td>
                              <td className="px-md py-md">
                                <span className={`px-sm py-0.5 rounded text-[11px] font-bold ${
                                  inv.vendor_gstin === '24GUPTA9999K1Z2' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {inv.vendor_gstin === '24GUPTA9999K1Z2' ? 'Cancelled / Suspended' : 'Active GSTIN'}
                                </span>
                              </td>
                              <td className="px-md py-md text-right font-data-mono text-ink-900">₹{Number(inv.taxable_amount || 0).toLocaleString('en-IN')}</td>
                              <td className="px-md py-md text-right font-data-mono text-on-surface-variant">{inv.cgst_rate > 0 ? `${inv.cgst_rate * 2}%` : '18%'}</td>
                              <td className="px-md py-md text-right font-data-mono font-bold text-teal-700">₹{Number(inv.total_amount || 0).toLocaleString('en-IN')}</td>
                              <td className="px-md py-md text-center">
                                <span className="inline-flex items-center gap-1 text-emerald-700 text-body-sm font-medium">
                                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                  Ready
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* VIEW: SALARIED TAX HUB & ITR-1 COPILOT */}
            {currentView === 'salaried-portal' && (() => {
              // Calculate deductions summary dynamically
              let sec80CTotal = 0;
              let sec80DTotal = 0;
              let hraTotal = 0;
              let donationTotal = 0;

              salariedProofs.forEach(p => {
                const amt = Number(p.amount) || 0;
                if (p.category.startsWith('80C')) sec80CTotal += amt;
                else if (p.category.startsWith('80D')) sec80DTotal += amt;
                else if (p.category === 'hra_rent_receipt') hraTotal += amt;
                else if (p.category === '80G_donation') donationTotal += amt;
              });

              const capped80C = Math.min(150000, sec80CTotal);
              const capped80D = Math.min(25000, sec80DTotal);
              const hraExemption = Math.min(hraTotal * 0.40, 150000);
              const totalDeductionsClaimed = capped80C + capped80D + hraExemption + donationTotal;

              // Compute Tax: Old vs New
              const grossSalary = salariedUser.annual_ctc;
              const oldStandardDed = 50000;
              const oldTaxableIncome = Math.max(0, grossSalary - oldStandardDed - totalDeductionsClaimed);
              
              // Old regime tax
              let oldTax = 0;
              if (oldTaxableIncome > 1000000) oldTax = 112500 + (oldTaxableIncome - 1000000) * 0.30;
              else if (oldTaxableIncome > 500000) oldTax = 12500 + (oldTaxableIncome - 500000) * 0.20;
              else if (oldTaxableIncome > 250000) oldTax = (oldTaxableIncome - 250000) * 0.05;
              const oldTotalTaxWithCess = Math.round(oldTax * 1.04);

              // New regime tax (Budget 2024 revised slabs)
              const newStandardDed = 75000;
              const newTaxableIncome = Math.max(0, grossSalary - newStandardDed);
              let newTax = 0;
              if (newTaxableIncome > 1500000) newTax = 140000 + (newTaxableIncome - 1500000) * 0.30;
              else if (newTaxableIncome > 1200000) newTax = 80000 + (newTaxableIncome - 1200000) * 0.20;
              else if (newTaxableIncome > 1000000) newTax = 50000 + (newTaxableIncome - 1000000) * 0.15;
              else if (newTaxableIncome > 700000) newTax = 20000 + (newTaxableIncome - 700000) * 0.10;
              else if (newTaxableIncome > 300000) newTax = (newTaxableIncome - 300000) * 0.05;
              const newTotalTaxWithCess = Math.round(newTax * 1.04);

              const savings = Math.abs(oldTotalTaxWithCess - newTotalTaxWithCess);
              const winner = newTotalTaxWithCess <= oldTotalTaxWithCess ? 'New Regime' : 'Old Regime';

              const handleDeleteProof = (id) => {
                setSalariedProofs(salariedProofs.filter(p => p.id !== id));
                showToast('Tax deduction proof removed.', 'info');
              };

              const handleAddProofSubmit = (e) => {
                e.preventDefault();
                if (!newProofTitle || !newProofAmount) return;
                const newProof = {
                  id: Date.now(),
                  category: newProofCat,
                  title: newProofTitle,
                  amount: parseFloat(newProofAmount),
                  date: newProofDate,
                  pan: newProofPan || 'ABCDE1234F',
                  verified: true
                };
                setSalariedProofs([newProof, ...salariedProofs]);
                setShowAddProofModal(false);
                setNewProofTitle('');
                setNewProofAmount('');
                showToast(`Saved ₹${parseFloat(newProofAmount).toLocaleString('en-IN')} to your Tax Locker!`, 'success');
              };

              return (
                <div className="space-y-lg">
                  {/* Salaried Profile Banner */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md bg-white border border-slate-200 p-md md:p-lg rounded shadow-sm">
                    <div>
                      <div className="flex items-center gap-sm">
                        <span className="material-symbols-outlined text-teal-600 text-[28px]">account_balance_wallet</span>
                        <h2 className="font-headline-md text-headline-md font-bold text-ink-900">{salariedUser.name}</h2>
                        <span className="px-sm py-xs bg-indigo-100 text-indigo-800 text-[11px] font-bold rounded-full uppercase tracking-wider">
                          Salaried Taxpayer
                        </span>
                      </div>
                      <p className="text-body-sm text-on-surface-variant font-data-mono mt-1">
                        PAN: {salariedUser.pan} • Employer: {salariedUser.employer_name} • Annual CTC: ₹{salariedUser.annual_ctc.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-sm w-full md:w-auto">
                      <button
                        onClick={downloadItrJson}
                        className="flex-1 md:flex-initial bg-teal-600 hover:bg-teal-700 text-white font-bold py-sm px-md rounded transition-all text-body-sm flex items-center justify-center gap-xs shadow-sm active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        <span>Download ITR-1 JSON</span>
                      </button>
                      <button
                        onClick={() => setShowAddProofModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-sm px-md rounded transition-all text-body-sm flex items-center gap-xs shadow-sm active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        <span>＋ Add Tax Proof</span>
                      </button>
                      <button
                        onClick={() => { setCurrentView('whatsapp'); setWhatsappMode('salaried'); }}
                        className="bg-paper-50 hover:bg-slate-200 border border-slate-300 text-ink-900 font-bold py-sm px-md rounded transition-all text-body-sm flex items-center gap-xs"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                        <span>WhatsApp Locker</span>
                      </button>
                    </div>
                  </div>

                  {/* ⚖️ Old vs New Regime Live Comparison Matrix */}
                  <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-lg rounded-xl shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-md border-b border-teal-800 pb-md">
                      <div>
                        <span className="text-teal-400 font-label-caps text-label-caps uppercase tracking-wider text-[11px]">AI REGIME OPTIMIZER</span>
                        <h3 className="text-xl font-bold text-white mt-0.5">Old vs. New Tax Regime Analysis (FY 2026-27)</h3>
                      </div>
                      <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-md py-sm rounded-lg flex items-center gap-sm">
                        <span className="material-symbols-outlined text-[20px]">thumb_up</span>
                        <span className="font-bold text-body-sm">
                          🏆 {winner} saves you ₹{savings.toLocaleString('en-IN')}!
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      {/* Old Regime Card */}
                      <div className={`p-md rounded-lg border transition-all ${
                        winner === 'Old Regime' ? 'bg-teal-800/40 border-teal-400' : 'bg-slate-800/40 border-slate-700'
                      }`}>
                        <div className="flex justify-between items-center mb-sm">
                          <h4 className="font-bold text-white">Old Tax Regime</h4>
                          <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">With Deductions</span>
                        </div>
                        <div className="space-y-xs text-sm text-slate-300">
                          <div className="flex justify-between">
                            <span>Standard Deduction:</span>
                            <span className="font-data-mono">₹50,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Section 80 & HRA Claimed:</span>
                            <span className="font-data-mono text-teal-300">₹{totalDeductionsClaimed.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-700 pt-xs">
                            <span>Net Taxable Income:</span>
                            <span className="font-data-mono font-bold text-white">₹{oldTaxableIncome.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-base font-bold text-white pt-xs border-t border-slate-700">
                            <span>Total Tax Payable:</span>
                            <span className="font-data-mono text-teal-400">₹{oldTotalTaxWithCess.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      {/* New Regime Card */}
                      <div className={`p-md rounded-lg border transition-all ${
                        winner === 'New Regime' ? 'bg-teal-800/40 border-teal-400' : 'bg-slate-800/40 border-slate-700'
                      }`}>
                        <div className="flex justify-between items-center mb-sm">
                          <h4 className="font-bold text-white">New Tax Regime (Sec 115BAC)</h4>
                          <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded">Default Standard</span>
                        </div>
                        <div className="space-y-xs text-sm text-slate-300">
                          <div className="flex justify-between">
                            <span>Standard Deduction (Budget 2024):</span>
                            <span className="font-data-mono text-emerald-300">₹75,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Deductions Allowed:</span>
                            <span className="font-data-mono text-slate-400">₹0 (Zero paperwork)</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-700 pt-xs">
                            <span>Net Taxable Income:</span>
                            <span className="font-data-mono font-bold text-white">₹{newTaxableIncome.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-base font-bold text-white pt-xs border-t border-slate-700">
                            <span>Total Tax Payable:</span>
                            <span className="font-data-mono text-teal-400">₹{newTotalTaxWithCess.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deduction Progress Bars */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                    {/* Section 80C */}
                    <div className="bg-white border border-slate-200 p-md rounded shadow-sm">
                      <div className="flex justify-between items-center mb-xs">
                        <span className="font-label-caps text-label-caps font-bold text-ink-900">SECTION 80C (ELSS, LIC, PPF)</span>
                        <span className="font-data-mono text-xs font-bold text-teal-700">
                          ₹{capped80C.toLocaleString('en-IN')} / ₹1,50,000
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-teal-600 h-2.5 rounded-full transition-all" 
                          style={{ width: `${Math.min(100, (sec80CTotal / 150000) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1.5">
                        {sec80CTotal >= 150000 ? '✅ 100% Maximum deduction reached!' : `₹${(150000 - sec80CTotal).toLocaleString('en-IN')} left to invest before March 31`}
                      </p>
                    </div>

                    {/* Section 80D */}
                    <div className="bg-white border border-slate-200 p-md rounded shadow-sm">
                      <div className="flex justify-between items-center mb-xs">
                        <span className="font-label-caps text-label-caps font-bold text-ink-900">SECTION 80D (HEALTH INSURANCE)</span>
                        <span className="font-data-mono text-xs font-bold text-teal-700">
                          ₹{capped80D.toLocaleString('en-IN')} / ₹25,000
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full transition-all" 
                          style={{ width: `${Math.min(100, (sec80DTotal / 25000) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1.5">
                        {sec80DTotal >= 25000 ? '✅ Full ₹25,000 premium claimed' : `₹${(25000 - sec80DTotal).toLocaleString('en-IN')} remaining limit`}
                      </p>
                    </div>

                    {/* HRA Rent Receipts */}
                    <div className="bg-white border border-slate-200 p-md rounded shadow-sm">
                      <div className="flex justify-between items-center mb-xs">
                        <span className="font-label-caps text-label-caps font-bold text-ink-900">HRA RENT RECEIPTS TRACKER</span>
                        <span className="font-data-mono text-xs font-bold text-teal-700">
                          ₹{hraTotal.toLocaleString('en-IN')} Total
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1.5">
                        Landlord PAN verified for all rent over ₹1L/year
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp Tax Savings Locker Document List */}
                  <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
                    <div className="p-md bg-paper-50 border-b border-slate-200 flex justify-between items-center">
                      <div>
                        <h3 className="font-label-caps text-label-caps font-bold text-ink-900">YOUR TAX SAVINGS LOCKER</h3>
                        <p className="text-body-sm text-on-surface-variant">Proof documents captured via WhatsApp or Web, organized for HR & ITR-1</p>
                      </div>
                      <button
                        onClick={() => setShowAddProofModal(true)}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-1 px-3 rounded text-xs flex items-center gap-1 active:scale-95 transition-all shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        <span>Add Proof</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-white border-b border-slate-200">
                            <th className="px-md py-sm text-left font-label-caps text-label-caps text-ink-900">Section</th>
                            <th className="px-md py-sm text-left font-label-caps text-label-caps text-ink-900">Proof Title</th>
                            <th className="px-md py-sm text-left font-label-caps text-label-caps text-ink-900">Institution / Landlord PAN</th>
                            <th className="px-md py-sm text-left font-label-caps text-label-caps text-ink-900">Date</th>
                            <th className="px-md py-sm text-right font-label-caps text-label-caps text-ink-900">Amount</th>
                            <th className="px-md py-sm text-center font-label-caps text-label-caps text-ink-900">Status</th>
                            <th className="px-md py-sm text-center font-label-caps text-label-caps text-ink-900">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salariedProofs.map(proof => (
                            <tr key={proof.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                              <td className="px-md py-md">
                                <span className={`px-sm py-0.5 rounded text-[11px] font-bold ${
                                  proof.category.startsWith('80C') ? 'bg-teal-100 text-teal-800' :
                                  proof.category.startsWith('80D') ? 'bg-indigo-100 text-indigo-800' :
                                  proof.category === 'hra_rent_receipt' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {proof.category.replace('_', ' ').toUpperCase()}
                                </span>
                              </td>
                              <td className="px-md py-md font-body-md font-medium text-ink-900">{proof.title}</td>
                              <td className="px-md py-md font-data-mono text-sm text-on-surface-variant">{proof.pan || '—'}</td>
                              <td className="px-md py-md font-data-mono text-sm text-on-surface-variant">{proof.date}</td>
                              <td className="px-md py-md text-right font-data-mono font-bold text-ink-900">₹{Number(proof.amount).toLocaleString('en-IN')}</td>
                              <td className="px-md py-md text-center">
                                <span className="inline-flex items-center gap-1 text-emerald-700 text-body-sm font-medium">
                                  <span className="material-symbols-outlined text-[16px]">verified</span>
                                  Verified
                                </span>
                              </td>
                              <td className="px-md py-md text-center">
                                <button
                                  onClick={() => handleDeleteProof(proof.id)}
                                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                  title="Delete proof"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* MODAL: ADD TAX PROOF POPUP */}
            {showAddProofModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-md">
                <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-md p-lg space-y-md">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-sm">
                    <h3 className="font-headline-sm font-bold text-ink-900 flex items-center gap-xs">
                      <span className="material-symbols-outlined text-teal-600">receipt_long</span>
                      <span>Add Tax Deduction Proof</span>
                    </h3>
                    <button onClick={() => setShowAddProofModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>

                  <form onSubmit={handleAddProofSubmit} className="space-y-sm">
                    <div>
                      <label className="font-label-caps text-on-surface-variant block mb-1 text-xs">Tax Deduction Category</label>
                      <select
                        value={newProofCat}
                        onChange={(e) => setNewProofCat(e.target.value)}
                        className="w-full bg-white border border-slate-300 p-sm rounded text-body-sm focus:border-teal-600 focus:ring-0"
                      >
                        <option value="80C_elss">Section 80C (ELSS Mutual Fund, PPF, Term LIC)</option>
                        <option value="80D_health_insurance">Section 80D (Health Insurance Premium)</option>
                        <option value="hra_rent_receipt">House Rent Receipt (HRA Exemption)</option>
                        <option value="80G_donation">Section 80G (Charitable Donation)</option>
                        <option value="education_loan">Section 80E (Education Loan Interest)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-label-caps text-on-surface-variant block mb-1 text-xs">Proof / Institution Title</label>
                      <input
                        type="text"
                        value={newProofTitle}
                        onChange={(e) => setNewProofTitle(e.target.value)}
                        placeholder="e.g. Star Health Insurance Policy"
                        className="w-full bg-white border border-slate-300 p-sm rounded text-body-sm focus:border-teal-600 focus:ring-0"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-sm">
                      <div>
                        <label className="font-label-caps text-on-surface-variant block mb-1 text-xs">Amount (₹)</label>
                        <input
                          type="number"
                          value={newProofAmount}
                          onChange={(e) => setNewProofAmount(e.target.value)}
                          placeholder="e.g. 25000"
                          className="w-full bg-white border border-slate-300 p-sm rounded text-body-sm font-data-mono focus:border-teal-600 focus:ring-0"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-label-caps text-on-surface-variant block mb-1 text-xs">Receipt Date</label>
                        <input
                          type="date"
                          value={newProofDate}
                          onChange={(e) => setNewProofDate(e.target.value)}
                          className="w-full bg-white border border-slate-300 p-sm rounded text-body-sm font-data-mono focus:border-teal-600 focus:ring-0"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-label-caps text-on-surface-variant block mb-1 text-xs">Institution / Landlord PAN (Optional)</label>
                      <input
                        type="text"
                        value={newProofPan}
                        onChange={(e) => setNewProofPan(e.target.value.toUpperCase())}
                        placeholder="e.g. AAACH1234H"
                        maxLength={10}
                        className="w-full bg-white border border-slate-300 p-sm rounded text-body-sm font-data-mono uppercase focus:border-teal-600 focus:ring-0"
                      />
                    </div>

                    <div className="flex justify-end gap-sm pt-sm border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setShowAddProofModal(false)}
                        className="px-md py-sm border border-slate-300 text-ink-900 rounded font-bold text-body-sm hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-md py-sm bg-teal-600 hover:bg-teal-700 text-white rounded font-bold text-body-sm shadow-sm active:scale-95"
                      >
                        Save to Locker
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* VIEW: COMPLIANCE ANALYTICS */}
            {currentView === 'analytics' && (() => {
              const totalItcClaimed = invoices
                .filter(i => i.extraction_status !== 'needs_review')
                .reduce((sum, i) => sum + (Number(i.cgst_amount) || 0) + (Number(i.sgst_amount) || 0) + (Number(i.igst_amount) || 0), 0);

              const totalBlockedItc = businesses.reduce((sum, b) => sum + (Number(b.at_risk_amount) || 0), 0);
              const totalInvoicesAll = businesses.reduce((sum, b) => sum + (Number(b.total_invoices) || 0), 0);
              const totalFiledAll = businesses.reduce((sum, b) => sum + (Number(b.filed_invoices) || 0), 0);
              const filingPercent = totalInvoicesAll > 0 ? Math.round((totalFiledAll / totalInvoicesAll) * 100) : 100;

              const reconciledBizCount = businesses.filter(b => b.total_invoices > 0 && b.high_flags === 0).length;
              const pendingBizCount = businesses.filter(b => (b.high_flags > 0 || b.medium_flags > 0)).length;

              // Month names for dynamic trend calculation
              const trendMonths = [
                { month: 'FEB', captured: 15, filed: 14 },
                { month: 'MAR', captured: 25, filed: 23 },
                { month: 'APR', captured: 18, filed: 18 },
                { month: 'MAY', captured: 30, filed: 27 },
                { month: 'JUN', captured: 38, filed: 32 },
                { 
                  month: 'JUL', 
                  captured: Math.max(10, invoices.length * 10), 
                  filed: Math.max(8, invoices.filter(i => i.extraction_status !== 'needs_review').length * 10) 
                }
              ];

              return (
                <div className="space-y-lg max-w-7xl mx-auto w-full">
                  <div>
                    <h3 className="font-headline-md text-headline-sm md:text-headline-md text-ink-900 mb-xs">Tax Compliance Analytics</h3>
                    <p className="text-on-surface-variant text-body-md">Analyze Input Tax Credit trends and track filing deadlines across businesses.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
                    <div className="bg-white border border-slate-200 p-md flex flex-col gap-xs rounded shadow-sm">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-bold">Total ITC Claimed</span>
                      <div className="flex items-baseline gap-xs">
                        <span className="font-data-mono text-[24px] font-bold text-teal-600">
                          {totalItcClaimed >= 100000 
                            ? `₹${(totalItcClaimed / 100000).toFixed(1)}L` 
                            : `₹${totalItcClaimed.toLocaleString('en-IN')}`}
                        </span>
                        <span className="text-moss-500 font-data-mono text-[12px] flex items-center font-bold">
                          <span className="material-symbols-outlined text-[14px]">arrow_drop_up</span>Verified
                        </span>
                      </div>
                      <div className="mt-sm h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-600 w-[80%]"></div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-md flex flex-col gap-xs border-l-4 border-l-rust-600 rounded shadow-sm">
                      <span className="font-label-caps text-label-caps text-rust-600 uppercase font-bold">Blocked ITC (Risk)</span>
                      <div className="flex items-baseline gap-xs">
                        <span className="font-data-mono text-[24px] font-bold text-rust-600">
                          ₹{totalBlockedItc.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                        </span>
                        <span className="text-rust-600 font-data-mono text-[12px] flex items-center font-bold">
                          <span className="material-symbols-outlined text-[14px]">warning</span>High Risk
                        </span>
                      </div>
                      <div className="mt-sm h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rust-600" style={{ width: `${Math.min(100, (totalBlockedItc / Math.max(1, totalItcClaimed + totalBlockedItc)) * 100)}%` }}></div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-md flex flex-col gap-xs rounded shadow-sm">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-bold">Filing Completion</span>
                      <div className="flex items-baseline gap-xs">
                        <span className="font-data-mono text-[24px] font-bold text-ink-900">{filingPercent}%</span>
                      </div>
                      <div className="mt-sm h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-moss-500" style={{ width: `${filingPercent}%` }}></div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-md flex flex-col gap-xs rounded shadow-sm">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-bold">Avg Reconcile Time</span>
                      <div className="flex items-baseline gap-xs">
                        <span className="font-data-mono text-[24px] font-bold text-ink-900">1.2 Days</span>
                      </div>
                      <div className="mt-sm h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-600 w-1/2"></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                    <div className="lg:col-span-2 bg-white border border-slate-200 flex flex-col rounded-sm shadow-sm">
                      <div className="p-md border-b border-slate-200 flex justify-between items-center">
                        <h2 className="font-headline-sm text-headline-sm text-ink-900 font-bold">ITC Trend Analysis</h2>
                        <div className="flex gap-md font-label-caps text-label-caps">
                          <div className="flex items-center gap-xs">
                            <span className="w-2.5 h-2.5 bg-teal-600 rounded-sm"></span>
                            <span>Captured</span>
                          </div>
                          <div className="flex items-center gap-xs">
                            <span className="w-2.5 h-2.5 bg-slate-200 rounded-sm"></span>
                            <span>Filed</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-lg h-64 flex items-end justify-between gap-md relative">
                        {trendMonths.map((item, idx) => (
                          <div key={idx} className="flex-1 flex flex-col justify-end gap-2 group h-full">
                            <div className="flex gap-1 items-end h-[80%]">
                              <div className="w-full bg-teal-600 rounded-t-sm transition-all duration-300 hover:brightness-95" style={{ height: `${Math.min(100, item.captured)}%` }}></div>
                              <div className="w-full bg-slate-200 rounded-t-sm transition-all duration-300 hover:bg-slate-300" style={{ height: `${Math.min(100, item.filed)}%` }}></div>
                            </div>
                            <span className="font-label-caps text-[9px] text-center font-bold text-on-surface-variant">{item.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-md flex flex-col rounded-sm shadow-sm gap-md">
                      <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase font-bold border-b border-slate-100 pb-xs">
                        Practice Capacity
                      </h4>
                      
                      <div className="space-y-md">
                        <div>
                          <div className="flex justify-between items-center text-body-sm font-bold text-ink-900 mb-xs">
                            <span>CA Capacity Index</span>
                            <span>{Math.min(5.0, (businesses.length * 1.4)).toFixed(1)} / 5.0</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-600" style={{ width: `${Math.min(100, (businesses.length / 5) * 100)}%` }}></div>
                          </div>
                          <span className="text-[10px] text-on-surface-variant mt-xs block">Safe threshold is 5.0 businesses/auditor.</span>
                        </div>

                        <div className="bg-paper-50 p-sm rounded border border-slate-200 space-y-xs">
                          <div className="flex justify-between text-xs">
                            <span className="text-on-surface-variant">Reconciled Clients:</span>
                            <span className="font-data-mono font-bold text-moss-500">
                              {reconciledBizCount} {reconciledBizCount === 1 ? 'Business' : 'Businesses'}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-on-surface-variant">Pending Actions:</span>
                            <span className="font-data-mono font-bold text-rust-600">
                              {pendingBizCount} {pendingBizCount === 1 ? 'Business' : 'Businesses'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* VIEW: WHATSAPP BOT SIMULATION */}
            {currentView === 'whatsapp' && (() => {
              const triageList = businesses.length > 0 ? businesses.map(b => {
                const needsRev = invoices.find(i => i.business_id === b.id && i.extraction_status === 'needs_review');
                const bFlags = flags.filter(f => f.business_id === b.id && !f.resolved);
                if (needsRev) {
                  return {
                    name: b.name,
                    rate: `${Math.round((needsRev.extraction_confidence || 0.42) * 100)}% confidence`,
                    status: 'needs_review',
                    invoice: needsRev
                  };
                } else if (bFlags.length > 0) {
                  return {
                    name: b.name,
                    rate: bFlags[0].severity === 'high' ? 'High Risk Flag' : 'Review Warning',
                    status: 'flagged',
                    flag: bFlags[0]
                  };
                } else {
                  return {
                    name: b.name,
                    rate: `${b.filed_invoices || 0}/${b.total_invoices || 0} Reconciled`,
                    status: 'matched'
                  };
                }
              }) : [
                { name: 'Meena Kirana Store', rate: '42% confidence', status: 'needs_review' },
                { name: 'Sharma Electronics', rate: 'Matched', status: 'matched' }
              ];

              return (
                <div className="space-y-lg max-w-7xl mx-auto w-full">
                  <div>
                    <h3 className="font-headline-md text-headline-sm md:text-headline-md text-ink-900 mb-xs">WhatsApp Bot Triage Simulator</h3>
                    <p className="text-on-surface-variant text-body-md">Simulate and preview what business clients see on WhatsApp during verification cycles.</p>
                  </div>

                  <div className="flex flex-col lg:flex-row bg-white border border-slate-200 rounded shadow-sm overflow-hidden h-[540px]">
                    <div className="flex-1 overflow-y-auto p-md border-r border-slate-200 flex flex-col justify-between">
                      <div>
                        <header className="mb-sm">
                          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px] font-bold">Active Triage Feed</span>
                          <h4 className="text-headline-sm font-headline-sm text-ink-900 font-bold mb-xs">Client Ingestion Feed</h4>
                          
                          {/* DUAL FEED SWITCHER: BUSINESS VS SALARIED */}
                          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setWhatsappMode('business');
                                setWhatsappClient('Meena Kirana Store');
                                setWhatsappStatus('Active');
                                setWhatsappMessages([
                                  { sender: 'client', text: 'Sent the latest purchase bills for July reconciliation.', time: '09:12 AM' },
                                  { sender: 'bot', text: 'Got it! Checking your invoice now — back to you shortly.', time: '09:13 AM' },
                                  { sender: 'bot', text: 'Couldn\'t clearly read the GSTIN on this one. Can you send a clearer photo, or reply with the GSTIN directly?', time: '09:15 AM', type: 'low-confidence' }
                                ]);
                              }}
                              className={`flex-1 py-1 px-2 rounded text-xs font-bold transition-all ${
                                whatsappMode === 'business' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-ink-900'
                              }`}
                            >
                              🏪 Shop Invoices
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setWhatsappMode('salaried');
                                setWhatsappClient('Ananya Sharma');
                                setWhatsappStatus('Active');
                                setWhatsappMessages([
                                  { sender: 'client', text: 'Forwarding my HDFC ERGO health insurance premium receipt (80D).', time: '11:20 AM' },
                                  { sender: 'bot', text: '✅ Saved ₹25,000 to your Tax Locker under Section 80D (Health Insurance)! Landlord/Insurer PAN AAACH1234H verified.', time: '11:21 AM' },
                                  { sender: 'client', text: 'Forwarded Form 16 Part A & B from TechCorp India.', time: '11:25 AM' },
                                  { sender: 'bot', text: '📄 Form 16 Parsed! Gross CTC: ₹18,00,000 | TDS: ₹1,65,000.\n💡 Comparison: New Regime saves you ₹10,400 over Old Regime! Pre-filled ITR-1 is ready.', time: '11:26 AM' }
                                ]);
                              }}
                              className={`flex-1 py-1 px-2 rounded text-xs font-bold transition-all ${
                                whatsappMode === 'salaried' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-ink-900'
                              }`}
                            >
                              👔 Salaried Tax Proofs
                            </button>
                          </div>
                        </header>

                        <div className="space-y-sm">
                          {whatsappMode === 'salaried' ? (
                            [
                              { name: 'Ananya Sharma', role: 'Software Engineer (TechCorp)', status: 'Active', proofs: 4 },
                              { name: 'Vikram Mehta', role: 'Lead Architect (Fintech Co)', status: 'Active', proofs: 2 }
                            ].map((user, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
                                  setWhatsappClient(user.name);
                                  setWhatsappStatus('Active');
                                  setWhatsappMessages([
                                    { sender: 'client', text: `Forwarding tax deduction proofs for ${user.name}.`, time: '10:00 AM' },
                                    { sender: 'bot', text: `Hi ${user.name}! Forward your Rent receipts, 80C/80D proofs or Form 16 anytime. We automatically organize them into your Tax Locker.`, time: '10:01 AM' }
                                  ]);
                                }}
                                className={`p-sm border rounded cursor-pointer transition-colors ${
                                  whatsappClient === user.name ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-ink-900">{user.name}</span>
                                  <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded">
                                    {user.proofs} PROOFS
                                  </span>
                                </div>
                                <div className="text-[11px] text-on-surface-variant mt-0.5">{user.role}</div>
                              </div>
                            ))
                          ) : (
                            triageList.map((client, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => {
                                setWhatsappClient(client.name);
                                setWhatsappStatus(client.status === 'needs_review' ? 'Needs Input' : 'Active');
                                if (client.status === 'needs_review') {
                                  setWhatsappMessages([
                                    { sender: 'client', text: `Sent the latest purchase bills for ${client.name}.`, time: '09:12 AM' },
                                    { sender: 'bot', text: 'Got it! Checking your invoice now — back to you shortly.', time: '09:13 AM' },
                                    { sender: 'bot', text: 'Couldn\'t clearly read the GSTIN on this invoice. Can you send a clearer photo, or reply with the GSTIN directly?', time: '09:15 AM', type: 'low-confidence' }
                                  ]);
                                } else if (client.status === 'flagged') {
                                  setWhatsappMessages([
                                    { sender: 'client', text: `Uploaded invoice for ${client.name}.`, time: '11:02 AM' },
                                    { sender: 'bot', text: 'Processing extraction and running compliance cross-match...', time: '11:03 AM' },
                                    { sender: 'bot', text: `⚠️ Notice: ${client.flag?.message || 'Compliance risk detected on this invoice. CA has been notified.'}`, time: '11:04 AM', type: 'cancelled-alert' }
                                  ]);
                                } else {
                                  setWhatsappMessages([
                                    { sender: 'client', text: `Forwarding recent bills for ${client.name}.`, time: '10:15 AM' },
                                    { sender: 'bot', text: 'Invoice received! All GSTINs, taxable values, and HSN codes verified.', time: '10:16 AM' },
                                    { sender: 'bot', text: '✅ Reconciled successfully. ITC is safe for GSTR-3B filing.', time: '10:17 AM' }
                                  ]);
                                }
                              }}
                              className={`p-sm border rounded cursor-pointer transition-colors ${
                                whatsappClient === client.name ? 'border-teal-600 bg-teal-600/5' : 'border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-ink-900">{client.name}</span>
                                <span className={`text-[8px] font-bold font-label-caps px-1.5 py-0.5 rounded ${
                                  client.status === 'needs_review' 
                                    ? 'bg-error-container text-rust-600' 
                                    : client.status === 'flagged'
                                    ? 'bg-amber-500/10 text-amber-500'
                                    : 'bg-secondary-container text-on-secondary-container'
                                }`}>
                                  {client.status.toUpperCase()}
                                </span>
                              </div>
                              <span className="text-[10px] text-on-surface-variant font-data-mono block mt-1">{client.rate}</span>
                            </div>
                          )))}
                        </div>
                      </div>

                      <div className="mt-md p-sm bg-slate-50 border border-slate-200 rounded">
                        <span className="font-label-caps text-[9px] text-on-surface-variant font-bold block mb-1">OCR Crop Preview</span>
                        <div className="bg-slate-200 h-32 flex items-center justify-center border border-dashed border-slate-300 relative text-center text-xs p-md text-on-surface-variant">
                          <div>
                            <span className="material-symbols-outlined text-[28px] text-rust-600 mb-1">blur_on</span>
                            <p className="font-bold text-rust-600">SMUDGED FIELD ENCOUNTERED</p>
                            <p className="text-[10px]">Cursive / smudged text overlap at GSTIN index</p>
                          </div>
                        </div>
                      </div>
                    </div>

                  <div className="w-full lg:w-[380px] bg-slate-200 flex flex-col shrink-0 h-full border-t lg:border-t-0 border-slate-200">
                    <div className="h-14 bg-teal-600 flex justify-between items-center px-md text-white shadow z-10 shrink-0">
                      <div className="flex items-center gap-sm">
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                          {whatsappClient.charAt(0)}
                        </div>
                        <div>
                          <div className="text-body-sm font-bold leading-tight">{whatsappClient}</div>
                          <div className="text-[9px] font-label-caps tracking-wider text-moss-500 font-bold uppercase">{whatsappStatus}</div>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[20px] opacity-80">more_vert</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-sm space-y-sm flex flex-col custom-scrollbar">
                      {whatsappMessages.map((msg, idx) => (
                        <div 
                          key={idx} 
                          className={`max-w-[85%] p-sm rounded shadow-sm text-xs leading-relaxed ${
                            msg.sender === 'client' 
                              ? 'self-start bg-white text-ink-900 border-l-2 border-teal-600/30' 
                              : 'self-end bg-[#E7FCE3] text-ink-900'
                          }`}
                        >
                          {msg.sender === 'bot' && (
                            <div className="flex items-center gap-xs mb-1 text-[8px] font-bold text-teal-600 uppercase font-label-caps">
                              <span className="material-symbols-outlined text-[10px]">smart_toy</span>
                              <span>BillGuru Bot</span>
                            </div>
                          )}
                          <p>{msg.text}</p>
                          <div className="text-[8px] text-right text-on-surface-variant/70 mt-1">{msg.time}</div>
                        </div>
                      ))}
                      {isBotTyping && (
                        <div className="self-end bg-[#E7FCE3] p-sm rounded text-[11px] italic text-on-surface-variant/80">
                          Bot is typing...
                        </div>
                      )}
                    </div>

                    {whatsappMessages.length > 0 && whatsappMessages[whatsappMessages.length-1].type === 'low-confidence' && (
                      <div className="p-sm bg-slate-300/50 flex flex-col gap-xs shrink-0 border-t border-slate-300">
                        <button 
                          onClick={() => setWhatsappInput('24SHRMA1234A1Z9')}
                          className="w-full py-1.5 bg-white border border-teal-600 text-teal-600 font-bold text-xs rounded hover:bg-teal-600/5 active:scale-95 transition-all text-center"
                        >
                          🔑 Submit Valid GSTIN: 24SHRMA1234A1Z9
                        </button>
                      </div>
                    )}

                    {/* QUICK ACTION SIMULATION BUTTONS FOR SALARIED */}
                    {whatsappMode === 'salaried' && (
                      <div className="p-xs bg-slate-100 border-t border-slate-300 flex flex-wrap gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setWhatsappMessages(prev => [
                              ...prev,
                              { sender: 'client', text: '📸 [Photo] House Rent receipt for Bandra flat: ₹20,000 for July.', time: 'Just now' },
                              { sender: 'bot', text: '✅ Saved ₹20,000 under HRA Rent Receipts! Landlord PAN ABCDE9876K verified. Total HRA tracked: ₹2,60,000.', time: 'Just now' }
                            ]);
                            setSalariedProofs(prev => [
                              { id: Date.now(), category: 'hra_rent_receipt', title: 'July Rent Receipt (Bandra)', amount: 20000, date: '2026-07-31', pan: 'ABCDE9876K', verified: true },
                              ...prev
                            ]);
                            showToast('Rent receipt parsed & saved to Tax Locker!', 'success');
                          }}
                          className="text-[10px] bg-white border border-teal-600 text-teal-700 px-2 py-1 rounded font-bold hover:bg-teal-50 active:scale-95"
                        >
                          📸 Snap Rent (HRA)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setWhatsappMessages(prev => [
                              ...prev,
                              { sender: 'client', text: '📄 [PDF] Uploaded Form 16 Part A & B for FY 2026-27.', time: 'Just now' },
                              { sender: 'bot', text: '📄 Form 16 extracted! Standard Deduction: ₹75,000. New Regime wins with ₹10,400 tax saved.', time: 'Just now' }
                            ]);
                            showToast('Form 16 analyzed and regime comparison refreshed!', 'success');
                          }}
                          className="text-[10px] bg-white border border-indigo-600 text-indigo-700 px-2 py-1 rounded font-bold hover:bg-indigo-50 active:scale-95"
                        >
                          📄 Send Form 16 PDF
                        </button>
                      </div>
                    )}

                    <form onSubmit={handleSendWhatsAppMessage} className="p-sm bg-paper-50 flex items-center gap-sm border-t border-slate-300 shrink-0">
                      <input 
                        type="text"
                        value={whatsappInput}
                        onChange={(e) => setWhatsappInput(e.target.value)}
                        placeholder="Type a response..."
                        className="flex-1 bg-white border border-slate-300 rounded-full px-md py-xs text-xs focus:outline-none focus:border-teal-600 font-body-sm"
                      />
                      <button 
                        type="submit"
                        className="h-8 w-8 rounded-full bg-teal-600 hover:bg-teal-600/90 text-white flex items-center justify-center shrink-0"
                      >
                        <span className="material-symbols-outlined text-[18px]">send</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })()}

            {/* VIEW: ONBOARD (Invite New Business) */}
            {currentView === 'onboard' && (
              <div className="max-w-xl mx-auto w-full bg-white border border-slate-200 p-xl shadow-sm rounded-sm space-y-lg">
                <div>
                  <h3 className="font-headline-md text-headline-sm md:text-headline-md text-ink-900 mb-xs">Onboard New Client Business</h3>
                  <p className="text-on-surface-variant text-body-md">Establish CA compliance relationship. System triggers automatic WhatsApp opt-in greeting.</p>
                </div>

                {onboardMessage.text && (
                  <div className={`p-md rounded flex items-center gap-sm text-body-sm font-bold ${
                    onboardMessage.type === 'success' ? 'bg-moss-500/10 text-moss-500 border border-moss-500/20' : 'bg-error-container text-on-error-container border border-error-container/20'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {onboardMessage.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    <span>{onboardMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleOnboardClient} className="space-y-md">
                  <div>
                    <label className="font-label-caps text-on-surface-variant block mb-xs">Business Legal Name</label>
                    <input 
                      type="text" 
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="e.g. Meena Kirana Store" 
                      className="w-full bg-white border border-slate-200 p-sm rounded text-body-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-xs">
                      <label className="font-label-caps text-on-surface-variant block">GSTIN (15 characters)</label>
                      {newClientGstin.length > 0 && (
                        <span className={`text-[11px] font-bold flex items-center gap-0.5 ${
                          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(newClientGstin.trim())
                            ? 'text-moss-500'
                            : newClientGstin.trim().length === 15
                            ? 'text-rust-600'
                            : 'text-on-surface-variant'
                        }`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(newClientGstin.trim())
                              ? 'check_circle'
                              : newClientGstin.trim().length === 15
                              ? 'error'
                              : 'pending'}
                          </span>
                          {/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(newClientGstin.trim())
                            ? 'Valid GSTIN structure'
                            : newClientGstin.trim().length === 15
                            ? 'Invalid GSTIN pattern'
                            : `${newClientGstin.trim().length}/15 characters`}
                        </span>
                      )}
                    </div>
                    <input 
                      type="text" 
                      value={newClientGstin}
                      onChange={(e) => setNewClientGstin(e.target.value.toUpperCase())}
                      placeholder="e.g. 24ABCDE1234F1Z5" 
                      maxLength={15}
                      className={`w-full bg-white border p-sm rounded font-data-mono text-body-sm uppercase focus:ring-2 focus:ring-teal-600/20 ${
                        newClientGstin.length === 15
                          ? (/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(newClientGstin.trim()) ? 'border-moss-500 focus:border-moss-500' : 'border-rust-600 focus:border-rust-600')
                          : 'border-slate-200 focus:border-teal-600'
                      }`}
                      required
                    />
                    <span className="text-[10px] text-on-surface-variant mt-xs block">Format: 2-digit state code + 10-char PAN + 1 entity count + Z + checksum.</span>
                  </div>

                  <div>
                    <label className="font-label-caps text-on-surface-variant block mb-xs">WhatsApp Registered Number</label>
                    <input 
                      type="text" 
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      placeholder="e.g. 9123456789" 
                      className="w-full bg-white border border-slate-200 p-sm rounded font-data-mono text-body-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
                      required
                    />
                    <span className="text-[11px] text-on-surface-variant mt-xs block">Invoice photographs forwarded from this number are automatically parsed.</span>
                  </div>

                  <div className="pt-sm flex justify-end gap-sm">
                    <button 
                      type="button"
                      onClick={() => setCurrentView('dashboard')}
                      className="px-md py-sm border border-slate-200 text-ink-900 font-bold hover:bg-slate-50 transition-colors rounded-sm text-body-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-lg py-sm bg-teal-600 hover:bg-teal-600/90 text-white font-bold transition-colors rounded-sm text-body-sm active:scale-95 shadow-sm"
                    >
                      Send Invitation
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* VIEW: SETTINGS */}
            {currentView === 'settings' && (
              <div className="max-w-3xl mx-auto w-full bg-white border border-slate-200 p-lg md:p-xl shadow-sm rounded-sm space-y-lg">
                <div>
                  <h3 className="font-headline-md text-headline-sm md:text-headline-md text-ink-900 mb-xs">Firm Profile & Integrations</h3>
                  <p className="text-on-surface-variant text-body-md">Configure CA practice details, billing tier, and API integrations.</p>
                </div>

                <div className="border-t border-slate-100 pt-lg space-y-lg">
                  <div className="grid grid-cols-12 gap-md font-body-sm">
                    <div className="col-span-12 md:col-span-6">
                      <label className="font-label-caps text-on-surface-variant block mb-xs">CA FIRM NAME</label>
                      <p className="font-body-md text-body-md text-ink-900 font-bold">{caUser?.firm_name}</p>
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <label className="font-label-caps text-on-surface-variant block mb-xs">BILLING PLAN</label>
                      <span className="inline-flex items-center gap-xs px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold font-label-caps uppercase">
                        {caUser?.plan_tier} TIER
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-lg space-y-md">
                    <h4 className="font-headline-sm text-[16px] text-ink-900 font-bold">Compliance Integrations</h4>
                    
                    <div className="flex justify-between items-center bg-paper-50 p-md border border-slate-200 rounded">
                      <div>
                        <span className="font-body-md text-body-sm md:text-body-md font-bold block text-ink-900">Tally ERP Cloud Sync</span>
                        <span className="text-xs text-on-surface-variant">Automated ledger exporting for active clients.</span>
                      </div>
                      <span className="px-3 py-1 bg-moss-500/10 text-moss-500 border border-moss-500/20 text-xs font-bold rounded-full font-label-caps uppercase">
                        Linked
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: USER GUIDE & FAQ CENTER */}
            {currentView === 'guide' && (() => {

              const filteredFaqs = FAQ_ITEMS.filter(item => 
                !faqSearchQuery.trim() ||
                item.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
                item.a.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(faqSearchQuery.toLowerCase())
              );

              return (
                <div className="space-y-lg max-w-7xl mx-auto w-full">
                  {/* Header Banner */}
                  <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white p-lg md:p-xl rounded-xl shadow-md border border-slate-700">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-teal-500/30">
                          <span className="material-symbols-outlined text-[14px]">school</span>
                          <span>Help Center & Knowledge Base</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-headline-md font-bold text-white">How to Use BillGuru AI</h2>
                        <p className="text-slate-300 text-body-sm md:text-body-md mt-1 max-w-2xl">
                          Everything you need to know: step-by-step guides for Chartered Accountants, independent shop owners, and salaried taxpayers, plus answers to top questions.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setCurrentView('whatsapp'); }}
                          className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-2 rounded-lg text-body-sm flex items-center gap-1.5 shadow active:scale-95 transition-all"
                        >
                          <span className="material-symbols-outlined text-[18px]">chat</span>
                          <span>Try Live WhatsApp Sim</span>
                        </button>
                      </div>
                    </div>

                    {/* Guide Tabs Switcher */}
                    <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-700/80">
                      {[
                        { id: 'overview', label: '🚀 Quick Start', icon: 'bolt' },
                        { id: 'ca', label: '💼 CA Firm Hub', icon: 'business_center' },
                        { id: 'business', label: '🏪 Shop Owner (DIY)', icon: 'storefront' },
                        { id: 'salaried', label: '👔 Salaried Tax Locker', icon: 'account_balance_wallet' },
                        { id: 'faq', label: '❓ FAQ & Answers', icon: 'quiz' }
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setGuideTab(t.id)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            guideTab === t.id
                              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
                              : 'bg-white/10 text-slate-200 hover:bg-white/20'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* TAB 1: OVERVIEW & 3-STEP QUICK START */}
                  {guideTab === 'overview' && (
                    <div className="space-y-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                        {/* Persona Card: CA */}
                        <div className="bg-white border border-slate-200 p-lg rounded-xl shadow-sm hover:border-teal-500/50 transition-all flex flex-col justify-between">
                          <div>
                            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-md">
                              <span className="material-symbols-outlined text-[24px]">business_center</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 font-label-caps">FOR ACCOUNTANTS</span>
                            <h3 className="text-lg font-bold text-ink-900 mt-0.5">Chartered Accountants (CAs)</h3>
                            <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                              Collect bills automatically from 30–200+ clients via WhatsApp. Low-confidence OCR routed to Triage Queue for 1-click verification.
                            </p>
                          </div>
                          <button
                            onClick={() => setGuideTab('ca')}
                            className="mt-4 text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                          >
                            <span>Read CA Walkthrough</span>
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </button>
                        </div>

                        {/* Persona Card: Shop Owner */}
                        <div className="bg-white border border-slate-200 p-lg rounded-xl shadow-sm hover:border-teal-500/50 transition-all flex flex-col justify-between">
                          <div>
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-md">
                              <span className="material-symbols-outlined text-[24px]">storefront</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-label-caps">FOR RETAILERS & SHOPS</span>
                            <h3 className="text-lg font-bold text-ink-900 mt-0.5">Shop Owners (DIY Mode)</h3>
                            <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                              No expensive software or CA required. Forward bills on WhatsApp, catch fake GSTINs immediately, and download GSTR-3B JSON with 1 click.
                            </p>
                          </div>
                          <button
                            onClick={() => setGuideTab('business')}
                            className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                          >
                            <span>Read Shop Owner Walkthrough</span>
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </button>
                        </div>

                        {/* Persona Card: Salaried */}
                        <div className="bg-white border border-slate-200 p-lg rounded-xl shadow-sm hover:border-indigo-500/50 transition-all flex flex-col justify-between">
                          <div>
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-md">
                              <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 font-label-caps">FOR SALARIED EMPLOYEES</span>
                            <h3 className="text-lg font-bold text-ink-900 mt-0.5">Salaried Professionals</h3>
                            <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                              WhatsApp Tax Locker saves rent and 80D receipts year-round. Drop Form 16 PDF to find out whether Old or New Regime saves you more.
                            </p>
                          </div>
                          <button
                            onClick={() => setGuideTab('salaried')}
                            className="mt-4 text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1"
                          >
                            <span>Read Salaried Walkthrough</span>
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </button>
                        </div>
                      </div>

                      {/* 3-Step Visual Architecture Strip */}
                      <div className="bg-white border border-slate-200 p-lg rounded-xl shadow-sm">
                        <h4 className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold text-xs mb-md">
                          HOW BILLGURU AI OPERATES IN 3 SIMPLE STEPS
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-md relative">
                          <div className="p-md bg-paper-50 border border-slate-200 rounded-lg">
                            <span className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs mb-sm">1</span>
                            <h5 className="font-bold text-ink-900">Snap on WhatsApp</h5>
                            <p className="text-body-sm text-on-surface-variant mt-1">Take a photo of any bill or proof document. No login, no password, zero learning curve.</p>
                          </div>

                          <div className="p-md bg-paper-50 border border-slate-200 rounded-lg">
                            <span className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs mb-sm">2</span>
                            <h5 className="font-bold text-ink-900">Real-Time AI Validation</h5>
                            <p className="text-body-sm text-on-surface-variant mt-1">Our engine checks active GST registry status, HSN tax rates, and Section 80 deduction caps in 3 seconds.</p>
                          </div>

                          <div className="p-md bg-paper-50 border border-slate-200 rounded-lg">
                            <span className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs mb-sm">3</span>
                            <h5 className="font-bold text-ink-900">1-Click Portal JSON</h5>
                            <p className="text-body-sm text-on-surface-variant mt-1">Export clean GSTR-3B or ITR-1 JSON ready to upload directly to government tax portals.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CA FIRM GUIDE */}
                  {guideTab === 'ca' && (
                    <div className="bg-white border border-slate-200 p-lg md:p-xl rounded-xl shadow-sm space-y-lg">
                      <div className="border-b border-slate-200 pb-md">
                        <span className="text-teal-700 font-label-caps text-label-caps font-bold text-xs uppercase">CA Firm Manual</span>
                        <h3 className="text-xl font-bold text-ink-900 mt-1">Managing 30–200+ Clients with Zero Receipt Chasing</h3>
                        <p className="text-body-sm text-on-surface-variant mt-1">Transform your firm's monthly compliance cycle from reactive firefighting to automated ingest.</p>
                      </div>

                      <div className="space-y-md">
                        <div className="flex gap-md items-start">
                          <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-sm">1</span>
                          <div>
                            <h4 className="font-bold text-ink-900">Onboarding Clients (30 Seconds per Client)</h4>
                            <p className="text-body-sm text-on-surface-variant mt-0.5">
                              Click <strong>"＋ Add Client Business"</strong> in your sidebar. Enter client name, GSTIN, and mobile number. The system dispatches an automatic WhatsApp opt-in message with your firm's name. Your client just replies "YES" and starts snapping photos.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-md items-start">
                          <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-sm">2</span>
                          <div>
                            <h4 className="font-bold text-ink-900">Inward Triage Queue for Low-Confidence Scans</h4>
                            <p className="text-body-sm text-on-surface-variant mt-0.5">
                              Unlike generic OCR tools that guess and risk filing penalties, anything with confidence &lt; 0.70 enters your <strong>Inward Queue</strong>. You see the cropped image side-by-side with extracted values. Correct any typo in 2 seconds and confirm, or click "Request Clearer Photo".
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-md items-start">
                          <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-sm">3</span>
                          <div>
                            <h4 className="font-bold text-ink-900">The Reconciliation Strip</h4>
                            <p className="text-body-sm text-on-surface-variant mt-0.5">
                              On the dashboard, every client has a green/amber reconciliation bar showing total bills captured vs. draft GSTR-3B filings. Spot missing ITC before filing deadline rather than waiting for tax notice.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-teal-50 border border-teal-200 p-md rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-sm">
                          <span className="material-symbols-outlined text-teal-700">lightbulb</span>
                          <span className="text-body-sm font-medium text-teal-900">Ready to onboard your first business client?</span>
                        </div>
                        <button
                          onClick={() => setCurrentView('onboard')}
                          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded text-xs shadow-sm"
                        >
                          Open Client Onboarding
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: SHOP OWNER DIY GUIDE */}
                  {guideTab === 'business' && (
                    <div className="bg-white border border-slate-200 p-lg md:p-xl rounded-xl shadow-sm space-y-lg">
                      <div className="border-b border-slate-200 pb-md">
                        <span className="text-emerald-700 font-label-caps text-label-caps font-bold text-xs uppercase">Shop Owner Manual</span>
                        <h3 className="text-xl font-bold text-ink-900 mt-1">Self-Serve GST Compliance (No CA Fees)</h3>
                        <p className="text-body-sm text-on-surface-variant mt-1">Save ₹2,000–₹5,000 every month by managing your purchase bills and GSTR-3B yourself.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                        <div className="p-md bg-paper-50 border border-slate-200 rounded-lg">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-sm">📸</div>
                          <h4 className="font-bold text-ink-900">1. Snap Bill on WhatsApp</h4>
                          <p className="text-body-sm text-on-surface-variant mt-1">
                            When goods arrive at your shop, snap a photo of the invoice and send it to our WhatsApp number. That's it!
                          </p>
                        </div>

                        <div className="p-md bg-paper-50 border border-slate-200 rounded-lg">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-sm">🛡️</div>
                          <h4 className="font-bold text-ink-900">2. Fake GSTIN Shield</h4>
                          <p className="text-body-sm text-on-surface-variant mt-1">
                            The AI instantly pings the government portal. If a supplier's GSTIN is cancelled, you get an immediate red warning to pause payment!
                          </p>
                        </div>

                        <div className="p-md bg-paper-50 border border-slate-200 rounded-lg">
                          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold mb-sm">📥</div>
                          <h4 className="font-bold text-ink-900">3. Download GSTR-3B JSON</h4>
                          <p className="text-body-sm text-on-surface-variant mt-1">
                            At month-end, click <strong>"Download GSTR-3B JSON"</strong> in the Solo Shop tab and upload it directly to gst.gov.in.
                          </p>
                        </div>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 p-md rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-sm">
                          <span className="material-symbols-outlined text-emerald-700">storefront</span>
                          <span className="text-body-sm font-medium text-emerald-900">Switch to your self-serve shop portal now:</span>
                        </div>
                        <button
                          onClick={() => setCurrentView('solo-business')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded text-xs shadow-sm"
                        >
                          View Solo Shop Portal
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: SALARIED TAX LOCKER GUIDE */}
                  {guideTab === 'salaried' && (
                    <div className="bg-white border border-slate-200 p-lg md:p-xl rounded-xl shadow-sm space-y-lg">
                      <div className="border-b border-slate-200 pb-md">
                        <span className="text-indigo-700 font-label-caps text-label-caps font-bold text-xs uppercase">Salaried Professional Manual</span>
                        <h3 className="text-xl font-bold text-ink-900 mt-1">WhatsApp Tax Locker & ITR-1 Copilot</h3>
                        <p className="text-body-sm text-on-surface-variant mt-1">Keep deduction proofs organized year-round, compare regimes with mathematical accuracy, and file ITR-1.</p>
                      </div>

                      <div className="space-y-md">
                        <div className="p-md bg-paper-50 border border-slate-200 rounded-lg flex gap-md items-start">
                          <span className="material-symbols-outlined text-indigo-600 text-[28px]">lock</span>
                          <div>
                            <h4 className="font-bold text-ink-900">Your Year-Round WhatsApp Tax Locker</h4>
                            <p className="text-body-sm text-on-surface-variant mt-0.5">
                              Stop scrambling in January when HR asks for investment proof. Whenever you pay rent, buy medical insurance, or make donations, forward the slip to WhatsApp. BillGuru tags it under Section 80C, 80D, or HRA and keeps your progress bars updated.
                            </p>
                          </div>
                        </div>

                        <div className="p-md bg-paper-50 border border-slate-200 rounded-lg flex gap-md items-start">
                          <span className="material-symbols-outlined text-teal-600 text-[28px]">balance</span>
                          <div>
                            <h4 className="font-bold text-ink-900">Old vs. New Tax Regime Optimizer</h4>
                            <p className="text-body-sm text-on-surface-variant mt-0.5">
                              Our tax engine factors in the ₹75,000 standard deduction under the New Regime versus your recorded HRA and 80C/80D deductions under the Old Regime. You receive an instant verdict showing exactly how many rupees you save under each regime!
                            </p>
                          </div>
                        </div>

                        <div className="p-md bg-paper-50 border border-slate-200 rounded-lg flex gap-md items-start">
                          <span className="material-symbols-outlined text-emerald-600 text-[28px]">download</span>
                          <div>
                            <h4 className="font-bold text-ink-900">1-Click ITR-1 JSON Download</h4>
                            <p className="text-body-sm text-on-surface-variant mt-0.5">
                              When tax season arrives, click <strong>"Download ITR-1 JSON"</strong> to get the official schema file. Upload it directly on the income tax portal (incometax.gov.in) with zero manual form filling.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-indigo-50 border border-indigo-200 p-md rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-sm">
                          <span className="material-symbols-outlined text-indigo-700">account_balance_wallet</span>
                          <span className="text-body-sm font-medium text-indigo-900">Explore your personal Tax Savings Locker:</span>
                        </div>
                        <button
                          onClick={() => setCurrentView('salaried-portal')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded text-xs shadow-sm"
                        >
                          View Salaried Tax Locker
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: INTERACTIVE ACCORDION FAQ */}
                  {guideTab === 'faq' && (
                    <div className="space-y-md">
                      {/* Search Bar */}
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">search</span>
                        <input
                          type="text"
                          value={faqSearchQuery}
                          onChange={(e) => setFaqSearchQuery(e.target.value)}
                          placeholder="Search questions (e.g. fake GSTIN, Form 16, pricing, privacy, filing)..."
                          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-body-sm focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                        />
                      </div>

                      {/* Accordion FAQ Items */}
                      <div className="space-y-sm">
                        {filteredFaqs.length === 0 ? (
                          <div className="bg-white p-lg text-center rounded border border-slate-200 text-on-surface-variant">
                            No matching questions found for "{faqSearchQuery}". Try another keyword!
                          </div>
                        ) : (
                          filteredFaqs.map(item => {
                            const isExpanded = expandedFaqId === item.id;
                            return (
                              <div
                                key={item.id}
                                className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all shadow-sm"
                              >
                                <button
                                  type="button"
                                  onClick={() => setExpandedFaqId(isExpanded ? null : item.id)}
                                  className="w-full text-left p-md flex justify-between items-center gap-md hover:bg-slate-50 transition-colors"
                                >
                                  <div className="flex items-center gap-sm">
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                      {item.category}
                                    </span>
                                    <span className="font-bold text-ink-900 text-body-md">{item.q}</span>
                                  </div>
                                  <span className="material-symbols-outlined text-slate-400 shrink-0">
                                    {isExpanded ? 'expand_less' : 'expand_more'}
                                  </span>
                                </button>

                                {isExpanded && (
                                  <div className="p-md pt-0 text-body-sm text-slate-700 bg-slate-50/50 border-t border-slate-100 leading-relaxed">
                                    {item.a}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* VIEW: CLIENT DETAIL */}
            {currentView === 'client-detail' && selectedBusiness && (

              <div className="space-y-lg max-w-7xl mx-auto w-full">
                {!isMobileLayout && (
                  <div className="flex items-center gap-sm">
                    <button 
                      onClick={() => { setCurrentView('dashboard'); setSelectedBusiness(null); }}
                      className="p-sm hover:bg-slate-200 rounded transition-colors text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                      <h3 className="font-headline-md text-ink-900">{selectedBusiness.name}</h3>
                      <p className="font-data-mono text-body-sm text-on-surface-variant uppercase">
                        GSTIN: {selectedBusiness.gstin} · WhatsApp: {selectedBusiness.whatsapp_number}
                      </p>
                    </div>
                  </div>
                )}

                {isMobileLayout && (
                  <div className="bg-white p-sm border border-slate-200 rounded text-center">
                    <span className="font-data-mono text-[11px] font-bold text-ink-900">{selectedBusiness.gstin}</span>
                  </div>
                )}

                <div className="bg-white border border-slate-200 p-md md:p-lg shadow-sm rounded-sm space-y-md">
                  <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase font-bold text-[10px]">RECONCILIATION PROGRESS</h4>
                  <div className="flex items-center gap-md">
                    <div className="flex-1">
                      <div className="reconciliation-strip h-3">
                        <div 
                          className="bg-teal-600 h-full" 
                          style={{ width: `${selectedBusiness.total_invoices > 0 ? (selectedBusiness.filed_invoices / selectedBusiness.total_invoices) * 100 : 100}%` }}
                        ></div>
                        <div 
                          className="bg-rust-600/60 h-full" 
                          style={{ width: `${selectedBusiness.total_invoices > 0 ? ((selectedBusiness.total_invoices - selectedBusiness.filed_invoices) / selectedBusiness.total_invoices) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="font-data-mono text-body-md md:text-headline-sm font-bold text-ink-900 shrink-0">
                      {selectedBusiness.filed_invoices}/{selectedBusiness.total_invoices} filed
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                  <div className="px-md py-sm bg-paper-50 border-b border-slate-200">
                    <h4 className="font-label-caps text-label-caps text-ink-900 font-bold">COMPLIANCE RISK AUDIT FLAGS</h4>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {flags.filter(f => f.business_id === selectedBusiness.id).length === 0 ? (
                      <div className="p-xl text-center">
                        <span className="material-symbols-outlined text-moss-500 text-[36px] mb-xs">check_circle</span>
                        <p className="text-body-md text-on-surface-variant">No unresolved compliance flags for this business client.</p>
                      </div>
                    ) : (
                      flags.filter(f => f.business_id === selectedBusiness.id).map(flag => (
                        <div key={flag.id} className="p-md md:p-lg flex flex-col justify-between items-start gap-md bg-white">
                          <div className="space-y-unit flex-1 w-full">
                            <div className="flex items-center gap-sm">
                              {flag.severity === 'high' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-error-container text-rust-600 border border-error-container/20 rounded text-[10px] font-bold font-label-caps">
                                  🔴 HIGH
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded text-[10px] font-bold font-label-caps">
                                  🟡 MED
                                </span>
                              )}
                            </div>
                            <p className="font-body-md text-body-sm md:text-body-md text-ink-900 font-bold leading-normal mt-1">
                              {flag.message}
                            </p>
                          </div>

                          <div className="flex gap-sm w-full justify-end border-t border-slate-50 pt-xs mt-xs">
                            <button 
                              onClick={() => {
                                const inv = invoices.find(i => i.id === flag.invoice_id);
                                if (inv && inv.extraction_status === 'needs_review') {
                                  setCurrentView('inward');
                                } else {
                                  setCurrentView('outward');
                                }
                              }}
                              className="px-md py-1 border border-slate-200 text-ink-900 font-bold hover:bg-slate-50 transition-colors rounded text-body-sm"
                            >
                              View Invoice
                            </button>
                            <button 
                              onClick={() => handleResolveFlag(flag.id)}
                              className="px-md py-1 bg-teal-600 text-white font-bold hover:bg-teal-600/90 transition-colors rounded text-body-sm shadow-sm active:scale-95"
                            >
                              Resolve
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* --- MOBILE NAVIGATION BAR --- */}
          {isMobileLayout && (
            <nav className="h-14 bg-white border-t border-slate-200 flex justify-around items-center shrink-0 pb-1 z-40">
              {[
                { view: 'dashboard', label: 'Home', icon: 'dashboard' },
                { view: 'solo-business', label: 'Shop', icon: 'storefront' },
                { view: 'salaried-portal', label: 'Salaried', icon: 'account_balance_wallet' },
                { view: 'guide', label: 'Guide & FAQ', icon: 'help_outline' },
                { view: 'settings', label: 'Settings', icon: 'settings' }
              ].map(item => (
                <button 
                  key={item.view}
                  onClick={() => {
                    setCurrentView(item.view);
                    setSelectedBusiness(null);
                  }}
                  className={`flex flex-col items-center justify-center transition-all ${
                    currentView === item.view && !selectedBusiness
                      ? 'text-teal-600 font-bold' 
                      : 'text-on-surface-variant hover:text-ink-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="text-[9px] font-label-caps uppercase mt-0.5">{item.label}</span>
                </button>
              ))}
            </nav>
          )}

        </div>
      </div>

      {/* GLOBAL TOAST NOTIFICATION CONTAINER */}
      {toast && (
        <div className={`fixed z-50 transition-all duration-300 transform translate-y-0 ${
          isMobileLayout ? 'top-4 left-4 right-4 flex justify-center' : 'bottom-6 right-6 max-w-md'
        }`}>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl text-sm font-medium border ${
            toast.type === 'error' 
              ? 'bg-red-50 text-red-900 border-red-200' 
              : toast.type === 'info'
              ? 'bg-sky-50 text-sky-900 border-sky-200'
              : 'bg-[#1C2B33] text-white border-slate-700'
          }`}>
            <span className={`material-symbols-outlined text-[20px] ${
              toast.type === 'error' ? 'text-red-600' : toast.type === 'info' ? 'text-sky-600' : 'text-teal-400'
            }`}>
              {toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'check_circle'}
            </span>
            <span className="flex-1 leading-snug">{toast.message}</span>
            {toast.undoAction && (
              <button 
                onClick={() => { toast.undoAction(); setToast(null); }}
                className="text-xs bg-teal-600 hover:bg-teal-500 text-white font-bold px-2 py-1 rounded ml-1 uppercase active:scale-95 transition-all shadow-sm"
              >
                Undo
              </button>
            )}
            <button 
              onClick={() => setToast(null)} 
              className="opacity-50 hover:opacity-100 text-xs ml-1 p-0.5"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
