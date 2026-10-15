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

console.log(`\n========================================`);
console.log(`📊 Test Summary: ${passedTests}/${totalTests} Passed`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  process.exit(0);
}
