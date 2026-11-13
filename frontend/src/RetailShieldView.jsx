import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  PackageX,
  FileText,
  Share2,
  CheckCircle2,
  ArrowRight,
  Plus,
  Download,
  Lock,
  MessageCircle,
  HelpCircle,
  RefreshCw,
  Sliders,
  Send,
  Store,
  Building,
  Calculator,
  UserCheck,
  Smartphone,
} from 'lucide-react';

export const DEMO_VENDORS = [
  {
    id: 'ven-001',
    gstin: '24AABCS1429B1Z1',
    tradeName: 'Shree Ganesh Wholesalers & FMCG',
    legalName: 'Shree Ganesh Trading Co. LLP',
    city: 'Ahmedabad, Gujarat',
    status: 'ACTIVE',
    filingFrequency: 'MONTHLY',
    lastGstr1FilingDate: '2026-10-11',
    lastGstr3bFilingDate: '2026-10-19',
    riskCategory: 'SAFE',
    totalPurchasesYTD: 4250000,
    atRiskGstAmount: 0,
    complianceScore: 98,
    warningMessage: 'Fully compliant. All GSTR-1 and 3B returns filed on time.',
  },
  {
    id: 'ven-002',
    gstin: '24AAECB9981K1Z4',
    tradeName: 'Balaji Agro & Staples Depot',
    legalName: 'Balaji Agro Commodities Pvt Ltd',
    city: 'Rajkot, Gujarat',
    status: 'ACTIVE',
    filingFrequency: 'MONTHLY',
    lastGstr1FilingDate: '2026-10-10',
    lastGstr3bFilingDate: '2026-10-18',
    riskCategory: 'SAFE',
    totalPurchasesYTD: 2840000,
    atRiskGstAmount: 0,
    complianceScore: 95,
    warningMessage: 'Verified supplier. Reliable GSTR-2B reflection history.',
  },
  {
    id: 'ven-003',
    gstin: '27AABCT8842L1Z9',
    tradeName: 'Sunrise Dairy & Frozen Hub',
    legalName: 'Sunrise Cold Storage & Foods',
    city: 'Surat / Mumbai Border',
    status: 'ACTIVE',
    filingFrequency: 'MONTHLY',
    lastGstr1FilingDate: '2026-09-24',
    lastGstr3bFilingDate: '2026-09-28',
    riskCategory: 'WATCHLIST',
    totalPurchasesYTD: 1120000,
    atRiskGstAmount: 85000,
    complianceScore: 68,
    warningMessage: 'Late filer! Last month GSTR-1 delayed. Hold ₹85,000 GST until 2B confirmation.',
  },
  {
    id: 'ven-004',
    gstin: '07AAAFM4412Q1Z8',
    tradeName: 'Apex General Goods (Fly-by-Night Flagged)',
    legalName: 'Apex Multitrade Syndicate',
    city: 'Delhi / Transporter Depot',
    status: 'CANCELLED',
    filingFrequency: 'MONTHLY',
    lastGstr1FilingDate: '2026-04-12',
    lastGstr3bFilingDate: '2026-04-15',
    riskCategory: 'CRITICAL_RISK',
    totalPurchasesYTD: 9500000,
    atRiskGstAmount: 1710000,
    complianceScore: 12,
    warningMessage: '🚨 CRITICAL WARNING: GST Cancelled by Tax Dept! High Court notice risk. DO NOT RELEASE GST PAYMENT!',
  },
];

export const DEMO_PURCHASE_BILLS = [
  {
    id: 'bill-101',
    vendorId: 'ven-001',
    vendorName: 'Shree Ganesh Wholesalers & FMCG',
    gstin: '24AABCS1429B1Z1',
    invoiceNumber: 'SGW/26/1042',
    invoiceDate: '2026-10-04',
    baseAmount: 180000,
    gstRate: 18,
    gstAmount: 32400,
    totalAmount: 212400,
    gstr2bStatus: 'MATCHED',
    paymentStatus: 'FULL_PAID',
    safePayBaseAmount: 180000,
    heldGstAmount: 0,
    invoiceCategory: 'fmcg_grocery',
  },
  {
    id: 'bill-102',
    vendorId: 'ven-002',
    vendorName: 'Balaji Agro & Staples Depot',
    gstin: '24AAECB9981K1Z4',
    invoiceNumber: 'BA-2026-884',
    invoiceDate: '2026-10-08',
    baseAmount: 350000,
    gstRate: 5,
    gstAmount: 17500,
    totalAmount: 367500,
    gstr2bStatus: 'MATCHED',
    paymentStatus: 'FULL_PAID',
    safePayBaseAmount: 350000,
    heldGstAmount: 0,
    invoiceCategory: 'staples',
  },
  {
    id: 'bill-103',
    vendorId: 'ven-003',
    vendorName: 'Sunrise Dairy & Frozen Hub',
    gstin: '27AABCT8842L1Z9',
    invoiceNumber: 'INV-SDF-901',
    invoiceDate: '2026-10-18',
    baseAmount: 472222,
    gstRate: 18,
    gstAmount: 85000,
    totalAmount: 557222,
    gstr2bStatus: 'NOT_REFLECTED',
    paymentStatus: 'SAFE_SPLIT_PAID',
    safePayBaseAmount: 472222,
    heldGstAmount: 85000,
    invoiceCategory: 'dairy_beverages',
  },
  {
    id: 'bill-104',
    vendorId: 'ven-004',
    vendorName: 'Apex General Goods (Fly-by-Night Flagged)',
    gstin: '07AAAFM4412Q1Z8',
    invoiceNumber: 'APX-MUM-449',
    invoiceDate: '2026-10-22',
    baseAmount: 9500000,
    gstRate: 18,
    gstAmount: 1710000,
    totalAmount: 11210000,
    gstr2bStatus: 'NOT_REFLECTED',
    paymentStatus: 'PAYMENT_HELD',
    safePayBaseAmount: 9500000,
    heldGstAmount: 1710000,
    invoiceCategory: 'general',
  },
];

export const DEMO_STOCK_LOSSES = [
  {
    id: 'loss-01',
    date: '2026-10-14',
    itemName: 'Fortune Sunlite Refined Oil 5L Jar (Pack of 4)',
    category: 'Edible Oils',
    quantity: 6,
    unit: 'Jars',
    costPricePerUnit: 620,
    totalLossAmount: 3720,
    reason: 'leakage',
    estimatedTaxSaved: 1116,
    loggedBy: 'Ramesh (Store Boy)',
    notes: 'Forklift punctured corner carton in warehouse bay 3. Photo logged.',
  },
  {
    id: 'loss-02',
    date: '2026-10-19',
    itemName: 'Britannia Good Day Butter Biscuits 200g (Carton)',
    category: 'Bakery & Biscuits',
    quantity: 12,
    unit: 'Cartons',
    costPricePerUnit: 1450,
    totalLossAmount: 17400,
    reason: 'expiry',
    estimatedTaxSaved: 5220,
    loggedBy: 'Kailash (Floor Supervisor)',
    notes: 'Expired batch rejected by counter scanner. Write-down approved.',
  },
  {
    id: 'loss-03',
    date: '2026-10-25',
    itemName: 'Kissan Fresh Tomato Ketchup 1kg Glass Bottles',
    category: 'Sauces & Spreads',
    quantity: 18,
    unit: 'Bottles',
    costPricePerUnit: 115,
    totalLossAmount: 2070,
    reason: 'damage',
    estimatedTaxSaved: 621,
    loggedBy: 'Suresh (Counter 2)',
    notes: 'Shelf collapse near aisle 4. Glass shattered.',
  },
  {
    id: 'loss-04',
    date: '2026-10-28',
    itemName: 'Cadbury Dairy Milk Silk Assorted Display Box',
    category: 'Confectionery',
    quantity: 1,
    unit: 'Display Unit',
    costPricePerUnit: 4800,
    totalLossAmount: 4800,
    reason: 'theft_shrinkage',
    estimatedTaxSaved: 1440,
    loggedBy: 'Mehtaji (Quarterly Stock Tally)',
    notes: 'Inventory audit variance detected at cash counter display.',
  },
];

export default function RetailShieldView() {
  const [currentPersona, setCurrentPersona] = useState('shop_owner');
  const [activeTab, setActiveTab] = useState('parties');
  const [vendors] = useState(DEMO_VENDORS);
  const [purchaseBills] = useState(DEMO_PURCHASE_BILLS);
  const [stockLosses, setStockLosses] = useState(DEMO_STOCK_LOSSES);
  
  const [selectedVendorSearch, setSelectedVendorSearch] = useState('');
  const [calcInvoiceAmount, setCalcInvoiceAmount] = useState(118000);
  const [calcGstRate, setCalcGstRate] = useState(18);
  const [calcVendorRisk, setCalcVendorRisk] = useState('CRITICAL_RISK');

  const [isLossModalOpen, setIsLossModalOpen] = useState(false);
  const [lossItemName, setLossItemName] = useState('');
  const [lossCategory] = useState('Edible Oils & Groceries');
  const [lossQty, setLossQty] = useState(1);
  const [lossUnit, setLossUnit] = useState('Boxes');
  const [lossCost, setLossCost] = useState(1200);
  const [lossReason, setLossReason] = useState('damage');
  const [lossNotes, setLossNotes] = useState('Punctured in transit');

  const [targetMarginPct, setTargetMarginPct] = useState(7.2);

  const [chatMessages, setChatMessages] = useState([
    {
      id: 'm1',
      sender: 'bot',
      timestamp: '10:45 AM',
      message: '🙏 Radhe Radhe! Main hoon aapka Digital Mehtaji. Aap yahan bill ka photo bhej sakte hain, party ka GST check kar sakte hain, ya tuta-phoota maal ka hisab daal sakte hain. Main sab sambhal loonga!',
    },
    {
      id: 'm2',
      sender: 'user',
      timestamp: '10:46 AM',
      message: 'Party check karo: 07AAAFM4412Q1Z8 (Apex General Goods)',
    },
    {
      id: 'm3',
      sender: 'bot',
      timestamp: '10:46 AM',
      message: '🚨 KHATRA ALERT: Apex General Goods ka GST Sarkari Dept ne CANCEL kar diya hai! Inse bill mat lijiye. Agar bill aa gaya hai, to GST ka ₹18,000 turant HOLD kar lo, varna department aapko ₹17 Lakh jaisa notice bhej dega!',
    },
  ]);
  const [inputChatText, setInputChatText] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const calcBaseAmount = Math.round(calcInvoiceAmount / (1 + calcGstRate / 100));
  const calcGstAmount = calcInvoiceAmount - calcBaseAmount;
  const isSafeVendor = calcVendorRisk === 'SAFE';
  const safePayAmount = isSafeVendor ? calcInvoiceAmount : calcBaseAmount;
  const heldGstAmount = isSafeVendor ? 0 : calcGstAmount;

  const filteredVendors = vendors.filter(
    (v) =>
      v.tradeName.toLowerCase().includes(selectedVendorSearch.toLowerCase()) ||
      v.gstin.toLowerCase().includes(selectedVendorSearch.toLowerCase()) ||
      v.legalName.toLowerCase().includes(selectedVendorSearch.toLowerCase())
  );

  const totalProtectedGst = purchaseBills
    .filter((b) => b.gstr2bStatus === 'NOT_REFLECTED')
    .reduce((sum, b) => sum + b.heldGstAmount, 0);

  const totalStockLossValue = stockLosses.reduce((sum, item) => sum + item.totalLossAmount, 0);
  const totalTaxSavedFromLoss = Math.round(totalStockLossValue * 0.30);

  const handleAddLossItem = (e) => {
    e.preventDefault();
    if (!lossItemName.trim()) return;

    const totalLoss = lossQty * lossCost;
    const newItem = {
      id: `loss-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      itemName: lossItemName,
      category: lossCategory,
      quantity: Number(lossQty),
      unit: lossUnit,
      costPricePerUnit: Number(lossCost),
      totalLossAmount: totalLoss,
      reason: lossReason,
      estimatedTaxSaved: Math.round(totalLoss * 0.30),
      loggedBy: 'Shop Floor Boy / Cashier',
      notes: lossNotes,
    };

    setStockLosses([newItem, ...stockLosses]);
    setIsLossModalOpen(false);
    setLossItemName('');
    showToast(`✅ "${newItem.itemName}" recorded as legitimate stock loss! Saved ₹${newItem.estimatedTaxSaved} in estimated tax.`);
  };

  const handleSendWhatsAppNudge = (bill) => {
    showToast(`📲 WhatsApp Nudge sent to ${bill.vendorName}: "Holding ₹${bill.gstAmount.toLocaleString('en-IN')} GST until GSTR-1 reflects in 2B."`);
  };

  const handleSendChatMessage = (textToSend) => {
    const text = (textToSend || inputChatText).trim();
    if (!text) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: text,
    };

    let botReplyText = '';
    const lower = text.toLowerCase();

    if (lower.includes('photo') || lower.includes('bill') || lower.includes('118000') || lower.includes('payment')) {
      botReplyText = '🧾 Bill Photo Scanned (₹1,18,000)! Base Goods: ₹1,00,000 | GST: ₹18,000. 🔒 Safe-Pay Rule: Supplier ka GSTR-1 check ho raha hai. Abhi sirf ₹1,00,000 transfer karo, ₹18,000 hold par rakha gaya hai!';
    } else if (lower.includes('tuta') || lower.includes('expire') || lower.includes('oil') || lower.includes('damage')) {
      botReplyText = '📸 Damaged Maal Photo Received! 6 Oil Jars (Loss: ₹3,720) Legitimate Loss Register mein add ho gaya. Aapke Balance Sheet par ₹1,116 ka Income Tax legally bach gaya!';
    } else if (lower.includes('khatre') || lower.includes('risk') || lower.includes('gst')) {
      botReplyText = '⚠️ Is mahine aapka ₹17.95 Lakhs GST khatre mein tha (Apex Traders & Sunrise ne return nahi bhara). Humne inka payment hold kiya hua hai, isliye aapko government se koi ₹17L ka notice nahi aayega! Aap 100% surakshit hain.';
    } else if (lower.includes('ca') || lower.includes('report') || lower.includes('whatsapp')) {
      botReplyText = '📄 CA Pack Ready! Tally XML Voucher + Reconciled GSTR-2B Excel + Damage Photos aapke CA Sharma ke WhatsApp (+91 98250 XXXXX) par bhej diya gaya hai!';
    } else if (lower.includes('party') || lower.includes('24aabcs') || lower.includes('shree ganesh')) {
      botReplyText = '🟢 Party Check: Shree Ganesh Wholesalers & FMCG (GSTIN: 24AABCS1429B1Z1) - 100% SAFE! Last 6 mahine se GSTR-1 aur 3B time par bhara hai. Poora payment de sakte ho.';
    } else {
      botReplyText = `Ji seth ji! Main aapki dukan ka Mehtaji hoon. "${text}" ke baare mein chinta mat kijiye. Hamara system aapka hisab aur GST suraksha 24/7 dekhta hai. Koi bhi bill photo ya party ka naam bhejein!`;
    }

    const botMsg = {
      id: `bot-${Date.now() + 1}`,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: botReplyText,
    };

    setChatMessages((prev) => [...prev, userMsg, botMsg]);
    setInputChatText('');
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* RETAIL PERSONA SELECTOR BAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" /> Select Persona (भूमिका चुनें):
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Each screen adapts to who is using the app!
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              setCurrentPersona('shop_owner');
              setActiveTab('whatsapp-bot');
              showToast('Switched to Small Shopkeeper Persona: WhatsApp-First Experience!');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentPersona === 'shop_owner'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>🏪 Chhota Dukan Owner (WhatsApp-First)</span>
          </button>

          <button
            onClick={() => {
              setCurrentPersona('mall_owner');
              setActiveTab('parties');
              showToast('Switched to Mall Owner Persona: ₹17L Risk Protection & High Volume!');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentPersona === 'mall_owner'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/50'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>🏬 Mall / Supermarket Owner (Jiju View)</span>
          </button>

          <button
            onClick={() => {
              setCurrentPersona('mehtaji');
              setActiveTab('reconciliation');
              showToast('Switched to In-House Mehtaji Persona: Bill Entries & Safe-Pay Payouts!');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentPersona === 'mehtaji'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-400/50'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>📒 Mehtaji (Munshi / Accountant)</span>
          </button>

          <button
            onClick={() => {
              setCurrentPersona('ca');
              setActiveTab('ca-pack');
              showToast('Switched to Chartered Accountant Persona: Tally XML & 2B Audit!');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentPersona === 'ca'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-400/50'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>⚖️ CA (Tax Auditor / Tally)</span>
          </button>
        </div>
      </div>

      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <ShieldAlert className="w-7 h-7 text-indigo-400" />
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  दुकान सुरक्षा कवच <span className="text-indigo-400 font-medium text-lg md:text-xl">| Retail GST & Margin Shield</span>
                </h1>
                <p className="text-slate-400 text-sm">
                  {currentPersona === 'shop_owner' && '🏪 Kirana & Dukan Mode: No computer needed! Send bills or photo on WhatsApp, get instant party check and tax savings.'}
                  {currentPersona === 'mall_owner' && '🏬 Mall Owner Mode: High volume turnover protection. ₹17.95 Lakhs at-risk GST stopped before release.'}
                  {currentPersona === 'mehtaji' && '📒 Mehtaji Mode: Manage day-to-day purchase bills, approve Safe-Pay vouchers, and reconcile 2B without manual stress.'}
                  {currentPersona === 'ca' && '⚖️ CA Mode: Direct GSTR-2B audit variance, verified stock loss deduction journals, and 1-click Tally Prime XML export.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full md:w-auto">
            <div className="bg-slate-800/80 border border-emerald-500/30 rounded-xl p-3 text-center">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> GST Protected
              </div>
              <div className="text-xl font-bold text-white mt-1">₹{(totalProtectedGst / 100000).toFixed(2)} Lakhs</div>
              <div className="text-[11px] text-slate-400">Held in Safe-Pay Escrow</div>
            </div>

            <div className="bg-slate-800/80 border border-amber-500/30 rounded-xl p-3 text-center">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1">
                <PackageX className="w-3.5 h-3.5" /> Damage Logged
              </div>
              <div className="text-xl font-bold text-white mt-1">₹{totalStockLossValue.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-emerald-400 font-medium">Saved ₹{totalTaxSavedFromLoss.toLocaleString('en-IN')} Tax Legally</div>
            </div>

            <div className="col-span-2 md:col-span-1 bg-slate-800/80 border border-indigo-500/30 rounded-xl p-3 text-center">
              <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center justify-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Mehtaji
              </div>
              <div className="text-xl font-bold text-emerald-400 mt-1">Active 24/7</div>
              <div className="text-[11px] text-indigo-400">Zero App Install Required</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 border-t border-slate-800/80 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('whatsapp-bot')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'whatsapp-bot'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-300" />
            📲 Mehtaji on WhatsApp (लाइव चैट)
            <span className="px-1.5 py-0.2 text-[9px] bg-emerald-400/20 text-emerald-300 rounded-full font-bold">New</span>
          </button>

          <button
            onClick={() => setActiveTab('parties')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'parties'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Party Check (Safe ya Khatra?)
          </button>

          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reconciliation'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            GSTR-2B vs Dukan Register
          </button>

          <button
            onClick={() => setActiveTab('stock-loss')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'stock-loss'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PackageX className="w-4 h-4 text-rose-400" />
            Tuta-Phoota & Expire Maal
          </button>

          <button
            onClick={() => setActiveTab('ca-pack')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ca-pack'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            CA & Mehtaji WhatsApp Pack
          </button>
        </div>
      </div>

      {/* TAB 0: MEHTAJI ON WHATSAPP */}
      {activeTab === 'whatsapp-bot' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Digital Mehtaji on WhatsApp</h3>
                  <p className="text-xs text-slate-400">No app login, no English typing required.</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Small shop owners and floor staff don't open software dashboards every morning. They live on **WhatsApp**. Our AI Mehtaji answers all their doubts, checks GST numbers, and records damaged stock directly inside WhatsApp!
              </p>

              <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs">
                <div className="font-bold text-slate-200">Try Instant Quick Prompts:</div>
                <button
                  onClick={() => handleSendChatMessage('Party check: 07AAAFM4412Q1Z8 (Apex Traders)')}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-between"
                >
                  <span>🔍 Party check: 07AAAFM4412Q1Z8</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                </button>

                <button
                  onClick={() => handleSendChatMessage('Naya Bill photo bheja: Total Rs 1,18,000')}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-between"
                >
                  <span>🧾 Bill photo bheja: ₹1,18,000</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>

                <button
                  onClick={() => handleSendChatMessage('5 Oil Cans puncture ho gaye, tuta maal register mein daalo')}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-between"
                >
                  <span>📦 5 Oil Cans toot gaye (Damage)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <button
                  onClick={() => handleSendChatMessage('Mera kitna GST khatre mein hai?')}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-between"
                >
                  <span>⚠️ Mera kitna GST khatre mein hai?</span>
                  <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
                </button>

                <button
                  onClick={() => handleSendChatMessage('CA Sharma ko mahine ki report bhej do')}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-between"
                >
                  <span>📄 CA Sharma ko file bhej do</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                </button>
              </div>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-2xl p-4 text-xs text-emerald-300 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% WhatsApp Cloud API Ready
              </div>
              <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                Powered by official WhatsApp Business Webhooks. The store owner can even send voice notes in Hindi or Gujarati, and the AI transcribes and executes the ledger update!
              </p>
            </div>
          </div>

          {/* Right Column: Live Phone Mockup with WhatsApp Simulator */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="w-full max-w-md bg-slate-950 rounded-[2.5rem] border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[650px]">
              <div className="bg-emerald-800 px-4 py-3 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 border border-emerald-400 flex items-center justify-center font-bold text-sm">
                    🤖
                  </div>
                  <div>
                    <div className="font-bold text-sm flex items-center gap-1.5">
                      Digital Mehtaji (दुकान सुरक्षा)
                      <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                    </div>
                    <div className="text-[10px] text-emerald-200">Online • Verified AI Assistant</div>
                  </div>
                </div>
                <div className="text-xs text-emerald-200 font-mono">100% Safe</div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-900/90">
                {chatMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                          isUser
                            ? 'bg-emerald-700 text-white rounded-tr-none'
                            : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                        }`}
                      >
                        {msg.message}
                        <div
                          className={`text-[9px] mt-1 text-right ${
                            isUser ? 'text-emerald-200' : 'text-slate-400'
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Kuch bhi puchiye ya bill/loss likhein..."
                  value={inputChatText}
                  onChange={(e) => setInputChatText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendChatMessage();
                  }}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => handleSendChatMessage()}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: Party GST Check & Safe-Pay Calculator */}
      {activeTab === 'parties' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Supplier name ya GST number daalein (e.g. 24AABCS...)..."
                  value={selectedVendorSearch}
                  onChange={(e) => setSelectedVendorSearch(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Safe (3)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Khatra (1)
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {filteredVendors.map((vendor) => {
                const isRisk = vendor.riskCategory === 'CRITICAL_RISK';
                const isWatch = vendor.riskCategory === 'WATCHLIST';

                return (
                  <div
                    key={vendor.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isRisk
                        ? 'bg-rose-950/20 border-rose-600/50 hover:border-rose-500'
                        : isWatch
                        ? 'bg-amber-950/20 border-amber-600/40 hover:border-amber-500'
                        : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{vendor.tradeName}</h3>
                          {isRisk ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                              🔴 KHATRA (GST Cancelled)
                            </span>
                          ) : isWatch ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              🟡 WATCHLIST (Late Filer)
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              🟢 100% SAFE PARTY
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="font-mono text-slate-300">GSTIN: {vendor.gstin}</span>
                          <span>•</span>
                          <span>{vendor.city}</span>
                          <span>•</span>
                          <span>Last 3B: {vendor.lastGstr3bFilingDate}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-slate-400">Trust Score</div>
                        <div
                          className={`text-xl font-extrabold ${
                            isRisk ? 'text-rose-400' : isWatch ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {vendor.complianceScore} / 100
                        </div>
                      </div>
                    </div>

                    <div
                      className={`mt-4 p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                        isRisk
                          ? 'bg-rose-900/30 text-rose-200 border border-rose-700/40'
                          : isWatch
                          ? 'bg-amber-900/30 text-amber-200 border border-amber-700/40'
                          : 'bg-emerald-900/20 text-emerald-200 border border-emerald-700/30'
                      }`}
                    >
                      {isRisk ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-semibold">{vendor.warningMessage}</span>
                        {isRisk && (
                          <div className="mt-1 font-bold text-rose-300">
                            🚨 ₹{(vendor.atRiskGstAmount / 100000).toFixed(2)} Lakhs at-risk GST! If you pay him GST, the government will fine you in audit.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                      <div className="text-xs text-slate-400">
                        Total Purchases This Year:{' '}
                        <span className="font-semibold text-white">₹{(vendor.totalPurchasesYTD / 100000).toFixed(1)} L</span>
                      </div>
                      <button
                        onClick={() => {
                          setCalcVendorRisk(vendor.riskCategory);
                          showToast(`Loaded ${vendor.tradeName} into Safe-Pay Calculator!`);
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
                      >
                        Calculate Safe Payout <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Safe-Pay Vendor Payment Gate */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 h-fit sticky top-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Safe-Pay Calculator</h2>
                <p className="text-xs text-slate-400">GST Hold Rule: Never pay tax twice.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Total Bill Amount (with GST) ₹
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={calcInvoiceAmount}
                    onChange={(e) => setCalcInvoiceAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-bold text-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">GST Rate (%)</label>
                  <select
                    value={calcGstRate}
                    onChange={(e) => setCalcGstRate(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value={5}>5% (Staples / Edibles)</option>
                    <option value={12}>12% (Processed Goods)</option>
                    <option value={18}>18% (FMCG / General)</option>
                    <option value={28}>28% (Electronics / Luxury)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Party Status</label>
                  <select
                    value={calcVendorRisk}
                    onChange={(e) => setCalcVendorRisk(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="SAFE">🟢 100% Safe Party</option>
                    <option value="WATCHLIST">🟡 Late Filer (Hold GST)</option>
                    <option value="CRITICAL_RISK">🔴 Cancelled / High Risk</option>
                  </select>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isSafeVendor
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-rose-950/20 border-rose-500/40'
                }`}
              >
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Base Goods Cost:</span>
                    <span className="font-mono text-white font-semibold">₹{calcBaseAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>GST Component ({calcGstRate}%):</span>
                    <span className="font-mono text-white font-semibold">₹{calcGstAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        Transfer to Vendor Now:
                      </div>
                      <div className="text-xs text-slate-400">
                        {isSafeVendor ? 'Full amount safe to pay' : 'Safe base goods cost only'}
                      </div>
                    </div>
                    <div className="text-2xl font-black text-emerald-400">
                      ₹{safePayAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {!isSafeVendor && (
                    <div className="bg-rose-900/30 border border-rose-800/50 p-2.5 rounded-lg flex items-center justify-between text-xs text-rose-300">
                      <span className="font-semibold flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Hold in Safe Escrow:
                      </span>
                      <span className="font-bold text-rose-200">₹{heldGstAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  showToast(
                    `Created NEFT payout voucher: Pay ₹${safePayAmount.toLocaleString(
                      'en-IN'
                    )} | Retained ₹${heldGstAmount.toLocaleString('en-IN')} GST safely!`
                  );
                }}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" /> Generate Safe-Pay Bank Voucher
              </button>

              <div className="text-[11px] text-slate-500 leading-relaxed text-center">
                * When this vendor's return officially appears in next month's GSTR-2B, the app unlocks the held ₹{heldGstAmount.toLocaleString('en-IN')}.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GSTR-2B vs Dukan Register */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Sarkari GSTR-2B vs Dukan Register Matcher
                </h2>
                <p className="text-sm text-slate-400">
                  Government portal checks if your suppliers have actually deposited the GST you paid them.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => showToast('Simulating GSTR-2B auto-sync with GST portal... 100% up to date!')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400" /> Sync with GST Portal (2B)
                </button>
              </div>
            </div>

            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-xs uppercase font-semibold text-slate-400 tracking-wider">
                  <tr>
                    <th className="p-3.5 rounded-l-lg">Supplier & Invoice</th>
                    <th className="p-3.5">Invoice Date</th>
                    <th className="p-3.5">Bill Amount</th>
                    <th className="p-3.5">GST (Tax)</th>
                    <th className="p-3.5">Govt Portal Status</th>
                    <th className="p-3.5">Payment Action</th>
                    <th className="p-3.5 rounded-r-lg text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {purchaseBills.map((bill) => {
                    const isMatched = bill.gstr2bStatus === 'MATCHED';
                    return (
                      <tr key={bill.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-white">{bill.vendorName}</div>
                          <div className="text-xs text-slate-400 font-mono">
                            Inv: {bill.invoiceNumber} | GST: {bill.gstin}
                          </div>
                        </td>
                        <td className="p-3.5 text-xs text-slate-400">{bill.invoiceDate}</td>
                        <td className="p-3.5 font-mono font-semibold text-white">
                          ₹{bill.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5 font-mono text-indigo-300 font-semibold">
                          ₹{bill.gstAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5">
                          {isMatched ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Matched in 2B
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                              <AlertTriangle className="w-3.5 h-3.5" /> MISSING IN 2B!
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-xs">
                          {isMatched ? (
                            <span className="text-emerald-400 font-semibold">Safe: Full Paid</span>
                          ) : (
                            <div>
                              <span className="text-rose-400 font-bold block">
                                Held: ₹{bill.heldGstAmount.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[11px] text-slate-400">Do not claim ITC yet!</span>
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          {!isMatched ? (
                            <button
                              onClick={() => handleSendWhatsAppNudge(bill)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Nudge
                            </button>
                          ) : (
                            <span className="text-xs text-slate-500 font-mono">Verified ✓</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Tuta-Phoota & Expire Maal */}
      {activeTab === 'stock-loss' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <PackageX className="w-5 h-5 text-rose-400" />
                  Tuta-Phoota & Expire Maal Register (Stock Loss Tax Saver)
                </h2>
                <p className="text-sm text-slate-400">
                  Every damaged oil bottle or expired carton is a 100% legitimate business loss. Logging it legally reduces your taxable profit!
                </p>
              </div>

              <button
                onClick={() => setIsLossModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> + Log Damaged / Expired Item
              </button>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
                  How This Protects You Legally
                </div>
                <div className="text-sm text-slate-300 mt-1">
                  Instead of hiding cash or making random balance sheet adjustments, writing off ₹{totalStockLossValue.toLocaleString('en-IN')} of proven stock damage lowers your closing stock legally.
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-slate-400">Total Legal Tax Saved:</div>
                <div className="text-2xl font-black text-emerald-400">
                  ₹{totalTaxSavedFromLoss.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {stockLosses.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.itemName}</h4>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {item.category} • {item.quantity} {item.unit} @ ₹{item.costPricePerUnit}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        item.reason === 'leakage'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : item.reason === 'expiry'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {item.reason}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 italic">
                    "{item.notes}"
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                    <span className="text-slate-400">Loss: ₹{item.totalLossAmount.toLocaleString('en-IN')}</span>
                    <span className="font-bold text-emerald-400">
                      Saved Tax: ₹{item.estimatedTaxSaved.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CA & Mehtaji WhatsApp Pack */}
      {activeTab === 'ca-pack' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-emerald-400" />
                  CA & Mehtaji 1-Click Summary Pack
                </h2>
                <p className="text-sm text-slate-400">
                  Give your CA everything in clean, audit-proof format. All damage write-offs, verified ITC claims, and petty cash expenses bundled together.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-indigo-400" /> Target Reported Net Profit Margin
                    </div>
                    <div className="text-xs text-slate-400">
                      Standard safe presumptive margin benchmark for supermarkets / malls
                    </div>
                  </div>
                  <div className="text-2xl font-black text-indigo-400">{targetMarginPct.toFixed(1)}%</div>
                </div>

                <input
                  type="range"
                  min="4.0"
                  max="12.0"
                  step="0.1"
                  value={targetMarginPct}
                  onChange={(e) => setTargetMarginPct(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>4.0% (Aggressive)</span>
                  <span>6% - 8% (Safe / Standard)</span>
                  <span>12.0% (High Tax Slab)</span>
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800 text-sm">
                <div className="p-3.5 bg-slate-800/40 flex justify-between">
                  <span className="text-slate-400">Total Billed Turnover (Sales):</span>
                  <span className="font-mono text-white font-bold">₹1,85,00,000 (₹1.85 Cr)</span>
                </div>
                <div className="p-3.5 flex justify-between">
                  <span className="text-slate-400">Verified Purchases (Eligible ITC):</span>
                  <span className="font-mono text-white">₹1,42,00,000</span>
                </div>
                <div className="p-3.5 flex justify-between bg-rose-950/20">
                  <span className="text-rose-300 font-semibold">At-Risk GST Held (Protected from Notice):</span>
                  <span className="font-mono text-rose-300 font-bold">₹17,95,000</span>
                </div>
                <div className="p-3.5 flex justify-between bg-emerald-950/20">
                  <span className="text-emerald-300 font-semibold">Legitimate Stock Loss Write-off:</span>
                  <span className="font-mono text-emerald-300 font-bold">- ₹27,990</span>
                </div>
                <div className="p-3.5 flex justify-between bg-emerald-950/20">
                  <span className="text-emerald-300 font-semibold">Direct Store Petty Cash Expenses:</span>
                  <span className="font-mono text-emerald-300 font-bold">- ₹12,200</span>
                </div>
                <div className="p-3.5 bg-indigo-950/40 flex justify-between text-base">
                  <span className="text-white font-bold">Projected Net Taxable Profit ({targetMarginPct}%):</span>
                  <span className="font-mono text-emerald-400 font-extrabold">
                    ₹{Math.round((18500000 * targetMarginPct) / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Send to CA / Mehtaji</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                One-click export sends all reconciled records, damage photos, and Tally vouchers directly.
              </p>

              <button
                onClick={() =>
                  showToast('📲 Sharing complete CA Pack (PDF + Excel + Tally XML) to Chartered Accountant via WhatsApp!')
                }
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Share on WhatsApp to CA
              </button>

              <button
                onClick={() =>
                  showToast('📥 Downloading Tally Prime XML vouchers for purchases & stock adjustments!')
                }
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4 text-indigo-400" /> Export Tally XML Format
              </button>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-2xl p-5 space-y-2 text-xs text-indigo-300">
              <div className="font-bold flex items-center gap-1.5 text-indigo-200">
                <HelpCircle className="w-4 h-4" /> Why CAs Love This
              </div>
              <p className="leading-relaxed text-indigo-300/80">
                Instead of spending weeks matching messy receipts, your CA gets clean 2B-matched registers and backed-up loss vouchers, saving them 20+ hours of audit work.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Damaged/Expired Stock Loss */}
      {isLossModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PackageX className="w-5 h-5 text-rose-400" /> Tuta-Phoota / Expire Maal Entry
              </h3>
              <button
                onClick={() => setIsLossModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLossItem} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amul Butter 500g / Fortune Oil 5L"
                  value={lossItemName}
                  onChange={(e) => setLossItemName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={lossQty}
                    onChange={(e) => setLossQty(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Cost Price / Unit ₹</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={lossCost}
                    onChange={(e) => setLossCost(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Reason</label>
                  <select
                    value={lossReason}
                    onChange={(e) => setLossReason(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="damage">Damage / Breakage</option>
                    <option value="expiry">Expired Date</option>
                    <option value="leakage">Liquid Leakage</option>
                    <option value="theft_shrinkage">Theft / Shrinkage</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Unit</label>
                  <input
                    type="text"
                    value={lossUnit}
                    onChange={(e) => setLossUnit(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Notes / Circumstance</label>
                <input
                  type="text"
                  placeholder="e.g. Broken during forklift unloading, photo taken"
                  value={lossNotes}
                  onChange={(e) => setLossNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                <span>Calculated Tax Saved:</span>
                <span className="font-bold text-sm">₹{Math.round(lossQty * lossCost * 0.30)}</span>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLossModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Save Loss Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
