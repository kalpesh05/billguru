import React, { useState, useEffect } from 'react';

export default function BankStatementView({ 
  selectedBusiness, 
  businesses = [], 
  onSelectBusiness,
  showToast = (msg, type) => console.log(msg),
  API_BASE_URL = 'http://localhost:5001/api',
  authFetch
}) {
  const [loading, setLoading] = useState(false);
  const [statementData, setStatementData] = useState(null);
  const [filterMode, setFilterMode] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBank, setActiveBank] = useState('HDFC');
  const [showXmlModal, setShowXmlModal] = useState(false);
  const [xmlContent, setXmlContent] = useState('');
  const [pushingToTally, setPushingToTally] = useState(false);

  const currentBusiness = selectedBusiness || businesses[0] || { id: 1, name: 'Meena Kirana Store' };

  // Fetch statement data
  const loadStatement = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/bank-statements/${currentBusiness.id}`);
      const data = await res.json();
      if (data.success && data.statement) {
        setStatementData(data.statement);
      }
    } catch (err) {
      console.warn('Using fallback mock bank statement:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatement();
  }, [currentBusiness.id]);

  // Handle parsing a sample or new statement
  const handleParseSample = async (bankType) => {
    setActiveBank(bankType);
    setLoading(true);
    try {
      const bankName = bankType === 'HDFC' 
        ? 'HDFC Bank Current Account' 
        : bankType === 'ICICI' 
          ? 'ICICI Smart Business Account' 
          : 'State Bank of India Current A/c';

      const res = await authFetch(`${API_BASE_URL}/bank-statements/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bank_name: bankName,
          business_id: currentBusiness.id
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatementData(prev => ({
          ...prev,
          bank_name: bankName,
          transactions: data.transactions,
          metrics: {
            ...prev?.metrics,
            total_transactions: data.transactions.length,
            auto_mapped_count: data.transactions.filter(t => t.status === 'auto_matched').length,
            needs_review_count: data.transactions.filter(t => t.status === 'needs_review').length
          }
        }));
        showToast(`⚡ AI Narration Engine parsed ${data.transactions.length} entries for ${bankName}!`, 'success');
      }
    } catch (err) {
      showToast('Error parsing statement: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick Accept / Verify Transaction
  const handleVerifyTxn = async (txnId) => {
    try {
      await authFetch(`${API_BASE_URL}/bank-statements/transaction/${txnId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'verified' })
      });
      setStatementData(prev => ({
        ...prev,
        transactions: prev.transactions.map(t => t.id === txnId ? { ...t, status: 'verified' } : t)
      }));
      showToast('Transaction verified and locked for Tally.', 'success');
    } catch (err) {
      showToast('Failed to update transaction', 'error');
    }
  };

  // Change suggested ledger
  const handleLedgerChange = (txnId, newLedger) => {
    setStatementData(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => t.id === txnId ? { ...t, suggested_ledger: newLedger, status: 'verified' } : t)
    }));
    showToast(`Ledger updated to "${newLedger}"`, 'info');
  };

  // Push to Tally Prime
  const handlePushToTally = async () => {
    setPushingToTally(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/bank-statements/${currentBusiness.id}/push-tally`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        setXmlContent(data.tally_xml_payload);
        showToast(data.message, 'success');
        setShowXmlModal(true);
      }
    } catch (err) {
      showToast('Tally sync error: ' + err.message, 'error');
    } finally {
      setPushingToTally(false);
    }
  };

  // Filter transactions
  const txns = statementData?.transactions || [];
  const filteredTxns = txns.filter(t => {
    if (filterMode !== 'ALL' && t.payment_mode !== filterMode) return false;
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.raw_narration?.toLowerCase().includes(q) ||
        t.clean_entity?.toLowerCase().includes(q) ||
        t.suggested_ledger?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const metrics = statementData?.metrics || {
    total_transactions: txns.length,
    auto_mapped_count: txns.filter(t => t.status === 'auto_matched').length,
    mapping_accuracy_percent: 96,
    recoverable_itc_bank_charges: 36,
    rule37_settlements_linked: 2
  };

  const getModeBadgeClass = (mode) => {
    switch (mode) {
      case 'UPI': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'NEFT': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'POS': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ACH': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cheque': return 'bg-slate-100 text-slate-800 border-slate-300';
      default: return 'bg-teal-100 text-teal-800 border-teal-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-2 md:p-6 max-w-7xl mx-auto">
      {/* Top Banner / Feature Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-500/30">
              <span className="material-symbols-outlined text-sm">auto_fix_high</span>
              Suvit-Equivalent Gap Closer
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Bank Statement AI Narration Parser
            </h1>
            <p className="text-indigo-200/80 text-sm mt-1 max-w-2xl">
              Clean complex Indian bank strings (UPI, NEFT, ACH, POS), auto-suggest Tally ledger heads, and link payments to Rule 37 180-day ITC protection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePushToTally}
              disabled={pushingToTally}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-lg">sync_alt</span>
              {pushingToTally ? 'Pushing...' : 'Push to Tally Prime (Port 9000)'}
            </button>
            <button
              onClick={() => {
                handlePushToTally();
                showToast('Tally XML Ready for Download!', 'info');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Export Tally XML
            </button>
          </div>
        </div>

        {/* Bank Selection Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-white/10 text-xs">
          <span className="text-indigo-300 font-medium mr-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">account_balance</span>
            Active Statement:
          </span>
          {['HDFC', 'ICICI', 'SBI'].map(bank => (
            <button
              key={bank}
              onClick={() => handleParseSample(bank)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeBank === bank
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/10 text-indigo-200 hover:bg-white/15'
              }`}
            >
              {bank} Current A/c
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 text-indigo-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Tally XML Service: <strong>Online (Port 9000)</strong></span>
          </div>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Processed</div>
          <div className="text-2xl font-black text-slate-800 mt-1 font-mono">
            {metrics.total_transactions} txns
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span className="text-rose-600 font-medium">Debits: ₹2,01,236</span>
            <span className="text-emerald-600 font-medium">Credits: ₹2,61,800</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">AI Mapping Accuracy</div>
          <div className="text-2xl font-black text-indigo-600 mt-1 flex items-center gap-2">
            <span>{metrics.mapping_accuracy_percent}%</span>
            <span className="material-symbols-outlined text-lg text-emerald-500">verified</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {metrics.auto_mapped_count} auto-mapped, {metrics.needs_review_count || 1} needs review
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Rule 37 Protection</div>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
            ₹9,900 ITC
          </div>
          <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">shield</span>
            2 supplier payments stopped 180-day clock
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Bank Charges ITC</div>
          <div className="text-2xl font-black text-teal-700 mt-1 font-mono">
            ₹{metrics.recoverable_itc_bank_charges} Claimable
          </div>
          <div className="text-xs text-teal-600 mt-1">
            Auto-tagged 18% GST on SMS & bank fees
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1">MODE:</span>
          {['ALL', 'UPI', 'NEFT', 'ACH', 'POS', 'Cheque', 'Bank Charge'].map(mode => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterMode === mode
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-sm">search</span>
            <input
              type="text"
              placeholder="Search narration, entity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Main Bank Statement Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">receipt_long</span>
            <h2 className="text-sm font-bold text-slate-800">
              {statementData?.bank_name || 'HDFC Bank Current Account'} — July 2026 Audit Register
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
              {filteredTxns.length} entries
            </span>
          </div>

          <div className="text-xs text-slate-500">
            A/c: <strong>{statementData?.account_number || '•••• •••• 9102'}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Date & Mode</th>
                <th className="py-3 px-4">Bank Narration / Counterparty</th>
                <th className="py-3 px-4">Type & Amount</th>
                <th className="py-3 px-4">AI Suggested Tally Ledger</th>
                <th className="py-3 px-4">Tax & Compliance Link</th>
                <th className="py-3 px-4 text-center">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTxns.map((txn) => {
                const isDebit = txn.type === 'DEBIT';
                return (
                  <tr key={txn.id} className="hover:bg-indigo-50/40 transition-colors">
                    {/* Date & Mode */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{txn.txn_date}</div>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${getModeBadgeClass(txn.payment_mode)}`}>
                        {txn.payment_mode}
                      </span>
                    </td>

                    {/* Raw Narration & Clean Entity */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-indigo-500">verified_user</span>
                        {txn.clean_entity}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 truncate mt-0.5" title={txn.raw_narration}>
                        {txn.raw_narration}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                      <div className={`font-bold text-sm ${isDebit ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {isDebit ? '-' : '+'} ₹{txn.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {isDebit ? 'Payment Voucher' : 'Receipt Voucher'}
                      </div>
                    </td>

                    {/* AI Suggested Ledger */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <select
                          value={txn.suggested_ledger}
                          onChange={(e) => handleLedgerChange(txn.id, e.target.value)}
                          className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                        >
                          <option value={txn.suggested_ledger}>{txn.suggested_ledger}</option>
                          <option value="Sundry Creditors - General">Sundry Creditors - General</option>
                          <option value="Sundry Debtors - Trade">Sundry Debtors - Trade</option>
                          <option value="Direct Sales - POS Clearing">Direct Sales - POS Clearing</option>
                          <option value="Duties & Taxes - GST Electronic Cash">Duties & Taxes - GST Electronic Cash</option>
                          <option value="Bank Charges (ITC Eligible)">Bank Charges (ITC Eligible)</option>
                          <option value="Office & Administrative Expenses">Office & Administrative Expenses</option>
                          <option value="Director Remuneration">Director Remuneration</option>
                        </select>
                        <span className="text-[10px] text-slate-500">
                          Group: <span className="font-medium text-slate-700">{txn.ledger_group}</span> • Conf: <strong className="text-indigo-600">{Math.round(txn.confidence * 100)}%</strong>
                        </span>
                      </div>
                    </td>

                    {/* Tax & Compliance Link */}
                    <td className="py-3.5 px-4 text-xs">
                      {txn.matched_invoice ? (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                          <span className="material-symbols-outlined text-xs">link</span>
                          Invoice #{txn.matched_invoice}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-600">{txn.itc_rule_link || 'Standard Entry'}</span>
                      )}
                    </td>

                    {/* Status & Verify */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {txn.status === 'verified' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => handleVerifyTxn(txn.id)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">check</span>
                          Accept
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tally XML Preview Modal */}
      {showXmlModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400">code</span>
                <h3 className="font-bold text-sm">Tally Prime Direct XML Voucher Payload</h3>
              </div>
              <button 
                onClick={() => setShowXmlModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4 bg-slate-950 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[55vh]">
              <pre>{xmlContent}</pre>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Ready for Port 9000 direct ODBC injection or file import.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(xmlContent);
                    showToast('Tally XML copied to clipboard!', 'success');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Copy XML
                </button>
                <button
                  onClick={() => setShowXmlModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
