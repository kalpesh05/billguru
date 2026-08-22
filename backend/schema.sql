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
