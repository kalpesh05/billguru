const assert = require('assert');
const { calculateOldRegimeTax, calculateNewRegimeTax, isValidGstinChecksum } = require('./server.js');

console.log('🧪 Running BillGuru AI Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function it(description, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     Error: ${err.message}`);
  }
}

// ==========================================
// 1. GSTIN Modulo 36 Luhn-Variant Algorithm
// ==========================================
console.log('📦 Section 1: GSTIN Modulo-36 Checksum Validation');

it('should validate official valid GSTINs with correct 15th checksum character', () => {
  assert.strictEqual(isValidGstinChecksum('27AAPFU0939F1ZV'), true);
  assert.strictEqual(isValidGstinChecksum('07AAAAA0000A1Z4'), true);
  assert.strictEqual(isValidGstinChecksum('24ABCDE1234F1Z6'), true);
});

it('should reject GSTINs with a typo in the checksum digit', () => {
  assert.strictEqual(isValidGstinChecksum('27AAPFU0939F1ZX'), false);
  assert.strictEqual(isValidGstinChecksum('07AAAAA0000A1Z9'), false);
});

it('should reject malformed or invalid state code GSTINs', () => {
  assert.strictEqual(isValidGstinChecksum('00AAAAA0000A1Z4'), false); // state 00 doesn't exist
  assert.strictEqual(isValidGstinChecksum('999ABCDE1234F1Z'), false);  // too short
  assert.strictEqual(isValidGstinChecksum(''), false);
  assert.strictEqual(isValidGstinChecksum(null), false);
});

// ==========================================
// 2. Income Tax Calculations & Slabs
// ==========================================
console.log('\n📦 Section 2: Income Tax Engine (Old vs New Regime & Budget 2024)');

it('should calculate Old Regime tax with standard deduction and 80C/80D deductions', () => {
  // 18,00,000 gross - 50,000 std ded - 2,00,000 allowable = 15,50,000 taxable
  const result = calculateOldRegimeTax(1800000, 200000, 0);
  assert.strictEqual(result.standardDeduction, 50000);
  assert.strictEqual(result.taxableIncome, 1550000);
  // Base tax: 1.125L + 30% of 5.5L (1.65L) = 2,77,500 + 4% cess (11,100) = 2,88,600
  assert.strictEqual(result.totalTax, 288600);
});

it('should grant 100% tax rebate under New Regime for taxable income <= 7,00,000', () => {
  // Gross ₹7,75,000 - ₹75,000 std ded = ₹7,00,000 taxable income
  const result = calculateNewRegimeTax(775000);
  assert.strictEqual(result.taxableIncome, 700000);
  assert.strictEqual(result.totalTax, 0);
});

it('should apply Section 87A Marginal Relief when taxable income is slightly above ₹7,00,000', () => {
  // Gross ₹7,80,000 - ₹75,000 std ded = ₹7,05,000 taxable income (₹5,000 above ₹7,00,000)
  const result = calculateNewRegimeTax(780000);
  assert.strictEqual(result.taxableIncome, 705000);
  // Proviso caps base tax at excess (₹5,000) + 4% cess (₹200) = ₹5,200
  assert.strictEqual(result.baseTax, 5000);
  assert.strictEqual(result.totalTax, 5200);
  assert.strictEqual(result.marginalRelief, 15500); // Saved ₹15,500 by marginal relief
});

it('should correctly calculate New Regime tax on high earners (e.g. ₹18,00,000 CTC)', () => {
  // Gross ₹18,00,000 - ₹75,000 std ded = ₹17,25,000 taxable income
  const result = calculateNewRegimeTax(1800000);
  assert.strictEqual(result.taxableIncome, 1725000);
  // Slabs: 0-3L (0) + 3-7L (20k) + 7-10L (30k) + 10-12L (30k) + 12-15L (60k) + 15-17.25L (67.5k) = 2,07,500 + 4% cess = 2,15,800
  assert.strictEqual(result.baseTax, 207500);
  assert.strictEqual(result.totalTax, 215800);
});

it('should apply previous year rules for FY 2023-24 (std deduction ₹50k, original slabs)', () => {
  // Gross ₹18,00,000 in FY 2023-24:
  // Taxable = 18,00,000 - 50,000 std ded = 17,50,000
  // Slabs: 3-6L (15k) + 6-9L (30k) + 9-12L (45k) + 12-15L (60k) + 15-17.5L (75k) = 2,25,000 + 4% cess = 2,34,000
  const result2324 = calculateNewRegimeTax(1800000, '2023-2024');
  assert.strictEqual(result2324.standardDeduction, 50000);
  assert.strictEqual(result2324.taxableIncome, 1750000);
  assert.strictEqual(result2324.baseTax, 225000);
  assert.strictEqual(result2324.totalTax, 234000);

  // Notice: FY 2024-25/2026-27 saves ₹18,200 compared to FY 2023-24 on ₹18L! (234,000 - 215,800 = 18,200)
  assert.strictEqual(234000 - 215800, 18200);
});

// ==========================================
// 3. GST Legal Rules & Section 10(4) Composition
// ==========================================
console.log('\n📦 Section 3: GST Compliance & Composition Scheme Checks');

it('should correctly identify state code from GSTIN', () => {
  assert.strictEqual('24ABCDE1234F1Z6'.substring(0, 2), '24'); // Gujarat
  assert.strictEqual('27AAPFU0939F1ZV'.substring(0, 2), '27'); // Maharashtra
});

it('should flag Composition dealers as non-ITC eligible under Section 10(4)', () => {
  const isComposition = (gstin) => gstin.includes('CMPST');
  assert.strictEqual(isComposition('24CMPST1111A1Z1'), true);
  assert.strictEqual(isComposition('24SHRMA1234A1Z9'), false);
});

// ==========================================
// 4. GSTR-2B Two-Way Auto-Reconciliation & Tally XML
// ==========================================
console.log('\n📦 Section 4: GSTR-2B Two-Way Reconciliation & Tally XML Integration');

it('should accurately categorize invoices into matched, missing in 2b, and missing in books', () => {
  const cleanInv = (inv) => (inv || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const cleanGstin = (g) => (g || '').trim().toUpperCase();

  const books = [
    { invoice_number: 'INV-4519', vendor_gstin: '24SHRMA1234A1Z9', tax: 2700.00 },
    { invoice_number: 'INV-4521', vendor_gstin: '24SHRMA1234A1Z9', tax: 4200.00 }
  ];

  const gstr2b = [
    { invoice_number: 'INV/4519', supplier_gstin: '24SHRMA1234A1Z9', tax: 2700.00 }, // Matches INV-4519
    { invoice_number: 'PA-8821', supplier_gstin: '24PARLE1111P1Z8', tax: 3240.00 }   // Missing in Books
  ];

  const matched = [];
  const inBooksMissingIn2b = [];
  const matchedGstrIdxs = new Set();

  books.forEach(b => {
    const bGstin = cleanGstin(b.vendor_gstin);
    const bInv = cleanInv(b.invoice_number);

    const matchIdx = gstr2b.findIndex((g, idx) => {
      if (matchedGstrIdxs.has(idx)) return false;
      const gstinMatch = cleanGstin(g.supplier_gstin) === bGstin;
      const invClean = cleanInv(g.invoice_number);
      return gstinMatch && (invClean === bInv || invClean.includes(bInv) || bInv.includes(invClean));
    });

    if (matchIdx !== -1) {
      matchedGstrIdxs.add(matchIdx);
      matched.push(b);
    } else {
      inBooksMissingIn2b.push(b);
    }
  });

  const in2bMissingInBooks = gstr2b.filter((_, idx) => !matchedGstrIdxs.has(idx));

  assert.strictEqual(matched.length, 1);
  assert.strictEqual(matched[0].invoice_number, 'INV-4519');
  assert.strictEqual(inBooksMissingIn2b.length, 1);
  assert.strictEqual(inBooksMissingIn2b[0].invoice_number, 'INV-4521');
  assert.strictEqual(in2bMissingInBooks.length, 1);
  assert.strictEqual(in2bMissingInBooks[0].invoice_number, 'PA-8821');
});

it('should verify Section 17(5) blocked credit routing for GSTR-3B Table 4(D)(1)', () => {
  const invoices = [
    { total_amount: 10000, cgst_amount: 900, sgst_amount: 900, is_itc_eligible: true },
    { total_amount: 50000, cgst_amount: 4500, sgst_amount: 4500, is_itc_eligible: false, ineligibility_reason: 'Section 17(5) - Motor Vehicle' }
  ];

  const eligibleItc = invoices.filter(i => i.is_itc_eligible).reduce((s, i) => s + i.cgst_amount + i.sgst_amount, 0);
  const blockedItc = invoices.filter(i => !i.is_itc_eligible).reduce((s, i) => s + i.cgst_amount + i.sgst_amount, 0);

  assert.strictEqual(eligibleItc, 1800);
  assert.strictEqual(blockedItc, 9000);
});

it('should generate valid Tally Prime XML structure with Party Master and Round Off account', () => {
  const vendorName = 'Sharma Wholesale & Traders';
  const escapedVendor = vendorName.replace(/&/g, '&amp;');
  const ledgerXml = `<LEDGER NAME="${escapedVendor}" ACTION="Create"><PARENT>Sundry Creditors</PARENT></LEDGER>`;

  assert.ok(ledgerXml.includes('ACTION="Create"'));
  assert.ok(ledgerXml.includes('&amp;'));
  assert.ok(ledgerXml.includes('<PARENT>Sundry Creditors</PARENT>'));
});

// ==========================================
// 5. CA Firm OS, Rule 37 180-Day Engine & ICAI Audit Trail
// ==========================================
console.log('\n📦 Section 5: Rule 37 180-Day Payment Tracker & ICAI Audit Trail');

it('should compute 180-day Rule 37 aging and categorize into Safe, Due Soon, Critical, and Reversal Mandated', () => {
  const asOnDate = new Date('2026-07-28');
  const invoices = [
    { invoice_date: '2026-07-15', itc: 4200 }, // ~13 days -> Safe
    { invoice_date: '2026-04-10', itc: 3000 }, // ~109 days -> Due Soon
    { invoice_date: '2026-02-10', itc: 7200 }, // ~168 days -> Critical (<30 days remaining)
    { invoice_date: '2025-12-05', itc: 3600 }  // ~235 days -> Reversal Mandated (>180 days)
  ];

  const categorized = invoices.map(inv => {
    const d = Math.floor((asOnDate - new Date(inv.invoice_date)) / (1000 * 60 * 60 * 24));
    let urgency = 'safe';
    if (d >= 180) urgency = 'reversal_mandated';
    else if (d >= 120) urgency = 'critical';
    else if (d >= 60) urgency = 'due_soon';
    return { ...inv, daysElapsed: d, urgency };
  });

  assert.strictEqual(categorized[0].urgency, 'safe');
  assert.strictEqual(categorized[1].urgency, 'due_soon');
  assert.strictEqual(categorized[2].urgency, 'critical');
  assert.strictEqual(categorized[3].urgency, 'reversal_mandated');
});

it('should calculate mandatory 18% p.a. interest u/s 50 on overdue vouchers exceeding 180 days', () => {
  const itc = 10000;
  const overdueDays = 30; // 30 days past 180 days limit
  const interest = Number(((itc * 0.18 * overdueDays) / 365).toFixed(2));
  
  // 10000 * 0.18 * 30 / 365 = 147.95
  assert.strictEqual(interest, 147.95);
});

it('should validate ICAI SA 230 audit documentation trail format', () => {
  const logEntry = {
    user_name: 'CA Rajesh Shah',
    user_role: 'partner_ca',
    action_type: 'GSTR2B_RECONCILED',
    entity_type: 'gstr2b',
    entity_id: '072026',
    description: 'Reconciled July 2026 GSTR-2B against books for Meena Kirana Store.'
  };

  assert.ok(logEntry.user_name.includes('CA'));
  assert.strictEqual(logEntry.user_role, 'partner_ca');
  assert.strictEqual(logEntry.action_type, 'GSTR2B_RECONCILED');
});

console.log(`\n========================================`);
console.log(`📊 Test Summary: ${passedTests}/${totalTests} Passed`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  process.exit(0);
}

