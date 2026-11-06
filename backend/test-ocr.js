process.env.NODE_ENV = 'test';
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { extractInvoiceWithGroq, isValidGstinChecksum } = require('./server.js');

async function testOcr() {
  console.log('\n======================================================');
  console.log('🧾  BillGuru AI — WhatsApp Vision OCR Live Tester');
  console.log('======================================================\n');

  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes('YOUR_GROQ_API_KEY')) {
    console.error('❌ Error: GROQ_API_KEY is not configured in backend/.env');
    process.exit(1);
  }

  const inputArg = process.argv[2];
  let buffer = null;
  let mimeType = 'image/jpeg';
  let sourceDescription = '';

  if (!inputArg) {
    console.log('📌 Usage:');
    console.log('   node test-ocr.js <path-to-image-or-url>');
    console.log('   Example: node test-ocr.js ~/Downloads/sample_bill.jpg');
    console.log('   Example: node test-ocr.js https://example.com/invoice.png\n');
    console.log('⚠️ No image argument provided. Please pass an invoice image file path to test live extraction.\n');
    process.exit(0);
  }

  if (inputArg.startsWith('http://') || inputArg.startsWith('https://')) {
    console.log(`🌐 Fetching remote image from: ${inputArg}...`);
    try {
      const res = await fetch(inputArg);
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const arrayBuf = await res.arrayBuffer();
      buffer = Buffer.from(arrayBuf);
      mimeType = res.headers.get('content-type') || 'image/jpeg';
      sourceDescription = inputArg;
    } catch (err) {
      console.error(`❌ Failed to download image: ${err.message}`);
      process.exit(1);
    }
  } else {
    const resolvedPath = path.resolve(process.cwd(), inputArg);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`❌ File not found: ${resolvedPath}`);
      process.exit(1);
    }
    console.log(`📂 Loading local file: ${resolvedPath}...`);
    buffer = fs.readFileSync(resolvedPath);
    const ext = path.extname(resolvedPath).toLowerCase();
    mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : ext === '.pdf' ? 'application/pdf' : 'image/jpeg';
    sourceDescription = resolvedPath;
  }

  console.log(`📦 Image loaded (${(buffer.length / 1024).toFixed(1)} KB, MIME: ${mimeType})`);
  console.log('🤖 Sending to Groq Vision AI (qwen/qwen3.8-27b)...');

  const startTime = Date.now();
  const data = await extractInvoiceWithGroq(buffer, mimeType);
  const duration = Date.now() - startTime;

  if (!data) {
    console.log('\n❌ AI extraction failed or model returned invalid JSON.');
    return;
  }

  console.log(`\n⚡ Extraction completed in ${duration}ms!`);
  console.log('\n------------------- EXTRACTED FIELDS -------------------');
  console.log(`🏢 Vendor Name      : ${data.vendor_name || 'N/A'}`);
  console.log(`🔑 Vendor GSTIN     : ${data.vendor_gstin || 'N/A'}`);
  
  if (data.vendor_gstin) {
    const isValid = isValidGstinChecksum(data.vendor_gstin);
    console.log(`🛡️  GSTIN Checksum   : ${isValid ? '✅ VALID (Modulo-36 passed)' : '⚠️ INVALID (Checksum failed)'}`);
  }
  
  if (data.recipient_gstin) {
    console.log(`👤 Buyer GSTIN      : ${data.recipient_gstin}`);
  }

  console.log(`📄 Invoice Number   : ${data.invoice_number || 'N/A'}`);
  console.log(`📅 Invoice Date     : ${data.invoice_date || 'N/A'}`);
  console.log(`🏷️  HSN/SAC Code     : ${data.hsn_sac_code || 'N/A'}`);
  console.log(`💵 Taxable Amount   : ₹${Number(data.taxable_amount || 0).toLocaleString('en-IN')}`);
  console.log(`🏛️  CGST Amount      : ₹${Number(data.cgst_amount || 0).toLocaleString('en-IN')}`);
  console.log(`🏛️  SGST Amount      : ₹${Number(data.sgst_amount || 0).toLocaleString('en-IN')}`);
  if (data.igst_amount) {
    console.log(`🏛️  IGST Amount      : ₹${Number(data.igst_amount || 0).toLocaleString('en-IN')}`);
  }
  console.log(`💰 Total Amount     : ₹${Number(data.total_amount || 0).toLocaleString('en-IN')}`);

  if (Array.isArray(data.tax_slabs) && data.tax_slabs.length > 0) {
    console.log('\n📊 Tax Slabs Breakdown:');
    data.tax_slabs.forEach((slab, idx) => {
      console.log(`   [${idx + 1}] Rate: ${slab.rate}% | Taxable: ₹${slab.taxable_amount} | CGST: ₹${slab.cgst_amount} | SGST: ₹${slab.sgst_amount} | Items: ${slab.items || 'N/A'}`);
    });
  }

  // Math sanity verification
  const taxable = Number(data.taxable_amount) || 0;
  const tax = (Number(data.cgst_amount) || 0) + (Number(data.sgst_amount) || 0) + (Number(data.igst_amount) || 0);
  const total = Number(data.total_amount) || 0;
  const roundOff = Number(data.round_off) || 0;
  const mathDiff = Math.abs((taxable + tax + roundOff) - total);

  console.log('\n----------------- INTEGRITY AUDIT -----------------');
  if (mathDiff < 1.0) {
    console.log('✅ Math Check: PASSED (Taxable + Tax == Total Amount)');
  } else {
    console.log(`⚠️  Math Check: DISCREPANCY (Calculated ₹${taxable + tax} vs Total ₹${total}, Diff: ₹${mathDiff.toFixed(2)})`);
  }
  console.log('======================================================\n');
  process.exit(0);
}

testOcr();
