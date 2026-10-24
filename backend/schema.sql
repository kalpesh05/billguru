-- BillGuru AI — Database Schema (MySQL)

CREATE TABLE IF NOT EXISTS accountants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  firm_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  plan_tier ENUM('trial','starter','pro') DEFAULT 'trial',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS businesses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  gstin VARCHAR(15) UNIQUE NOT NULL,
  ca_id INT NULL,
  whatsapp_number VARCHAR(15) UNIQUE NOT NULL,
  onboarding_status ENUM('invited','opted_in','active') DEFAULT 'invited',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ca_id) REFERENCES accountants(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  business_id INT NOT NULL,
  source_type ENUM('whatsapp','web_upload') DEFAULT 'whatsapp',
  file_url VARCHAR(500),
  vendor_name VARCHAR(255),
  vendor_gstin VARCHAR(15),
  invoice_number VARCHAR(100),
  invoice_date DATE,
  taxable_amount DECIMAL(12,2),
  cgst_rate DECIMAL(5,2), cgst_amount DECIMAL(12,2),
  sgst_rate DECIMAL(5,2), sgst_amount DECIMAL(12,2),
  igst_rate DECIMAL(5,2), igst_amount DECIMAL(12,2),
  total_amount DECIMAL(12,2),
  hsn_sac_code VARCHAR(10),
  extraction_confidence DECIMAL(3,2),
  extraction_status ENUM('pending','extracted','needs_review','confirmed') DEFAULT 'pending',
  is_itc_eligible BOOLEAN DEFAULT TRUE,
  ineligibility_reason VARCHAR(100) NULL,
  raw_llm_response JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  INDEX idx_business_date (business_id, invoice_date),
  INDEX idx_status (extraction_status)
);

CREATE TABLE IF NOT EXISTS gstin_validations (
  gstin VARCHAR(15) PRIMARY KEY,
  is_valid BOOLEAN NOT NULL,
  status VARCHAR(50) NOT NULL,
  legal_name VARCHAR(255),
  last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_last_checked (last_checked)
);

CREATE TABLE IF NOT EXISTS reconciliation_flags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_id INT NOT NULL,
  flag_type ENUM('gstin_invalid','slab_mismatch','duplicate_invoice','missing_itc','gstr_mismatch') NOT NULL,
  severity ENUM('low','medium','high') NOT NULL,
  message TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  INDEX idx_invoice (invoice_id),
  INDEX idx_unresolved (resolved, severity)
);

CREATE TABLE IF NOT EXISTS gstr_filings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  business_id INT NOT NULL,
  return_type ENUM('GSTR1','GSTR3B') NOT NULL,
  period VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  filed_data JSON NOT NULL,
  filed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  UNIQUE KEY uq_business_period (business_id, return_type, period)
);

CREATE TABLE IF NOT EXISTS hsn_sac_rates (
  hsn_sac_code VARCHAR(10) PRIMARY KEY,
  description VARCHAR(255),
  expected_gst_rate DECIMAL(5,2) NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- SALARIED INDIVIDUAL & ITR DEDUCTIONS TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS salaried_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  pan VARCHAR(10) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  whatsapp_number VARCHAR(15) UNIQUE NOT NULL,
  employer_name VARCHAR(255),
  annual_ctc DECIMAL(12,2),
  ca_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ca_id) REFERENCES accountants(id) ON DELETE SET NULL,
  INDEX idx_salaried_pan (pan),
  INDEX idx_salaried_phone (whatsapp_number)
);

CREATE TABLE IF NOT EXISTS tax_deductions_locker (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  category ENUM(
    '80C_elss',
    '80C_lic',
    '80C_ppf',
    '80D_health_insurance',
    '80G_donation',
    'hra_rent_receipt',
    'education_loan',
    'home_loan_interest',
    'other'
  ) NOT NULL,
  financial_year VARCHAR(9) NOT NULL, -- e.g. '2026-2027'
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  institution_or_landlord_pan VARCHAR(10),
  receipt_date DATE,
  document_url VARCHAR(500),
  confidence_score DECIMAL(3,2) DEFAULT 0.95,
  verified_status ENUM('pending', 'verified', 'rejected') DEFAULT 'verified',
  raw_extracted_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES salaried_users(id) ON DELETE CASCADE,
  INDEX idx_user_fy (user_id, financial_year),
  INDEX idx_category (category)
);

CREATE TABLE IF NOT EXISTS form16_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  financial_year VARCHAR(9) NOT NULL,
  employer_name VARCHAR(255) NOT NULL,
  employer_tan VARCHAR(10) NOT NULL,
  gross_salary DECIMAL(12,2) NOT NULL,
  standard_deduction DECIMAL(12,2) DEFAULT 75000.00,
  exemptions_total DECIMAL(12,2) DEFAULT 0.00,
  taxable_salary DECIMAL(12,2) NOT NULL,
  tds_deducted DECIMAL(12,2) NOT NULL,
  raw_extracted_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES salaried_users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_fy_form16 (user_id, financial_year)
);

CREATE TABLE IF NOT EXISTS itr_filings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  assessment_year VARCHAR(9) NOT NULL, -- e.g. '2027-2028'
  regime_selected ENUM('old', 'new') NOT NULL,
  total_income DECIMAL(12,2) NOT NULL,
  total_deductions DECIMAL(12,2) NOT NULL,
  net_taxable_income DECIMAL(12,2) NOT NULL,
  tax_payable DECIMAL(12,2) NOT NULL,
  tds_credited DECIMAL(12,2) NOT NULL,
  balance_payable DECIMAL(12,2) DEFAULT 0.00,
  refund_due DECIMAL(12,2) DEFAULT 0.00,
  filing_status ENUM('draft', 'ready_for_upload', 'filed') DEFAULT 'draft',
  itr_json_payload JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES salaried_users(id) ON DELETE CASCADE,
  INDEX idx_user_ay (user_id, assessment_year)
);

CREATE TABLE IF NOT EXISTS gstr2b_uploads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  business_id INT NOT NULL,
  filing_period VARCHAR(10) NOT NULL, -- e.g. '072026'
  total_records INT DEFAULT 0,
  total_itc_available DECIMAL(15,2) DEFAULT 0.00,
  raw_json_data LONGTEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  INDEX idx_biz_fp (business_id, filing_period)
);

CREATE TABLE IF NOT EXISTS gstr2b_invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  upload_id INT NOT NULL,
  supplier_gstin VARCHAR(15) NOT NULL,
  supplier_name VARCHAR(255) NULL,
  invoice_number VARCHAR(100) NOT NULL,
  invoice_date DATE NOT NULL,
  invoice_value DECIMAL(15,2) NOT NULL,
  taxable_value DECIMAL(15,2) NOT NULL,
  cgst_amount DECIMAL(15,2) DEFAULT 0.00,
  sgst_amount DECIMAL(15,2) DEFAULT 0.00,
  igst_amount DECIMAL(15,2) DEFAULT 0.00,
  itc_availability VARCHAR(10) DEFAULT 'Y',
  match_status ENUM('matched', 'in_books_missing_in_2b', 'in_2b_missing_in_books', 'mismatch_value') DEFAULT 'in_2b_missing_in_books',
  matched_invoice_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (upload_id) REFERENCES gstr2b_uploads(id) ON DELETE CASCADE,
  INDEX idx_supplier_inv (supplier_gstin, invoice_number)
);

CREATE TABLE IF NOT EXISTS ca_firm_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  accountant_id INT NOT NULL UNIQUE,
  firm_name VARCHAR(255) DEFAULT 'Shah & Associates, Chartered Accountants',
  icai_frn VARCHAR(50) DEFAULT '109283W',
  partner_name VARCHAR(255) DEFAULT 'CA Rajesh Shah, FCA',
  partner_membership_no VARCHAR(50) DEFAULT '048921',
  contact_phone VARCHAR(20) DEFAULT '+91 98200 12345',
  contact_email VARCHAR(255) DEFAULT 'tax@shahassociates.in',
  custom_whatsapp_signature TEXT NULL,
  tally_purchase_ledger VARCHAR(100) DEFAULT 'Purchase Account',
  tally_cgst_ledger VARCHAR(100) DEFAULT 'Input CGST @ 9%',
  tally_sgst_ledger VARCHAR(100) DEFAULT 'Input SGST @ 9%',
  tally_igst_ledger VARCHAR(100) DEFAULT 'Input IGST @ 18%',
  tally_roundoff_ledger VARCHAR(100) DEFAULT 'Round Off Account',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (accountant_id) REFERENCES accountants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NULL,
  user_name VARCHAR(100) NOT NULL,
  user_role ENUM('partner_ca', 'article_assistant') NOT NULL DEFAULT 'partner_ca',
  action_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(50) NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_created (created_at),
  INDEX idx_audit_action (action_type)
);

