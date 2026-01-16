-- Barangay Information System Database Schema
-- Residents Table

CREATE TABLE IF NOT EXISTS residents (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    barangay_id VARCHAR(50) UNIQUE,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    civil_status VARCHAR(20) CHECK (civil_status IN ('single', 'married', 'widowed', 'divorced')),
    occupation VARCHAR(100),
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_residents_email ON residents(email);
CREATE INDEX IF NOT EXISTS idx_residents_barangay_id ON residents(barangay_id);
CREATE INDEX IF NOT EXISTS idx_residents_status ON residents(status);
CREATE INDEX IF NOT EXISTS idx_residents_gender ON residents(gender);
CREATE INDEX IF NOT EXISTS idx_residents_registration_date ON residents(registration_date);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_residents_updated_at BEFORE UPDATE ON residents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - for testing)
INSERT INTO residents (
    first_name, last_name, middle_name, email, phone, address, barangay_id,
    date_of_birth, gender, civil_status, occupation, emergency_contact,
    emergency_phone, status, registration_date
) VALUES
(
    'Juan', 'Dela Cruz', 'Santos', 'juan@example.com', '+63 917 123 4567',
    '123 Main St, Barangay Central', 'BRGY-001', '1985-03-15', 'male',
    'married', 'Teacher', 'Maria Dela Cruz', '+63 918 234 5678',
    'active', '2024-01-15 10:00:00'
),
(
    'Maria', 'Santos', NULL, 'maria@example.com', '+63 918 234 5678',
    '456 Oak Ave, Barangay North', 'BRGY-002', '1990-07-22', 'female',
    'single', 'Nurse', 'Juan Santos', '+63 917 123 4567',
    'active', '2024-02-20 14:30:00'
),
(
    'Pedro', 'Garcia', 'Reyes', 'pedro@example.com', '+63 919 345 6789',
    '789 Pine Rd, Barangay South', 'BRGY-003', '1978-11-08', 'male',
    'married', 'Farmer', 'Rosa Garcia', '+63 920 456 7890',
    'inactive', '2024-03-10 09:15:00'
),
(
    'Ana', 'Reyes', NULL, 'ana@example.com', '+63 920 456 7890',
    '321 Elm St, Barangay East', 'BRGY-004', '1995-05-30', 'female',
    'single', 'Student', 'Carlos Reyes', '+63 921 567 8901',
    'active', '2024-04-05 16:45:00'
),
(
    'Carlos', 'Mendoza', NULL, 'carlos@example.com', '+63 921 567 8901',
    '654 Maple Dr, Barangay West', 'BRGY-005', '1982-09-12', 'male',
    'married', 'Driver', 'Elena Mendoza', '+63 922 678 9012',
    'active', '2024-05-12 11:20:00'
);

-- Create a sequence for barangay_id generation (optional)
CREATE OR REPLACE FUNCTION generate_barangay_id()
RETURNS TRIGGER AS $$
DECLARE
    next_id INTEGER;
BEGIN
    -- Get the next ID from sequence or calculate from existing records
    SELECT COALESCE(MAX(CAST(SUBSTRING(barangay_id FROM 6) AS INTEGER)), 0) + 1
    INTO next_id
    FROM residents
    WHERE barangay_id LIKE 'BRGY-%';

    -- Generate new barangay ID if not provided
    IF NEW.barangay_id IS NULL OR NEW.barangay_id = '' THEN
        NEW.barangay_id := 'BRGY-' || LPAD(next_id::TEXT, 3, '0');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_barangay_id_trigger
    BEFORE INSERT ON residents
    FOR EACH ROW
    EXECUTE FUNCTION generate_barangay_id();

-- Households/Families Table
CREATE TABLE IF NOT EXISTS households (
    id SERIAL PRIMARY KEY,
    household_id VARCHAR(50) UNIQUE NOT NULL,
    head_of_household_id INTEGER REFERENCES residents(id) ON DELETE SET NULL,
    address TEXT NOT NULL,
    contact_number VARCHAR(20),
    household_type VARCHAR(20) CHECK (household_type IN ('nuclear', 'extended', 'single_parent', 'blended', 'other')),
    economic_status VARCHAR(20) CHECK (economic_status IN ('low', 'middle', 'high')),
    total_members INTEGER DEFAULT 0,
    barangay_id VARCHAR(50),
    status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Household Members Junction Table
CREATE TABLE IF NOT EXISTS household_members (
    id SERIAL PRIMARY KEY,
    household_id INTEGER REFERENCES households(id) ON DELETE CASCADE,
    resident_id INTEGER REFERENCES residents(id) ON DELETE CASCADE,
    relationship VARCHAR(50), -- e.g., 'head', 'spouse', 'child', 'parent', 'sibling'
    is_dependent BOOLEAN DEFAULT false,
    joined_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(household_id, resident_id)
);

-- Announcements/News Table
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    announcement_type VARCHAR(20) CHECK (announcement_type IN ('news', 'event', 'emergency', 'general', 'meeting')),
    priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    target_audience VARCHAR(20) CHECK (target_audience IN ('all', 'residents', 'staff', 'officials')) DEFAULT 'all',
    posted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    expires_at TIMESTAMP,
    attachments JSONB, -- Store file URLs/paths
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (for staff/admin management)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'staff', 'resident')) DEFAULT 'resident',
    status VARCHAR(10) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    barangay_id VARCHAR(50),
    permissions JSONB DEFAULT '[]',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificate Requests Table
CREATE TABLE IF NOT EXISTS certificate_requests (
    id SERIAL PRIMARY KEY,
    resident_id INTEGER REFERENCES residents(id) ON DELETE CASCADE,
    certificate_type VARCHAR(50) NOT NULL, -- e.g., 'barangay_clearance', 'indigency', 'residency'
    purpose TEXT,
    requested_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
    priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    amount_paid DECIMAL(10,2),
    payment_status VARCHAR(20) CHECK (payment_status IN ('unpaid', 'paid', 'waived')) DEFAULT 'unpaid',
    notes TEXT,
    attachments JSONB,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB,
    setting_type VARCHAR(20) CHECK (setting_type IN ('string', 'number', 'boolean', 'json', 'file')),
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_households_head ON households(head_of_household_id);
CREATE INDEX IF NOT EXISTS idx_households_status ON households(status);
CREATE INDEX IF NOT EXISTS idx_household_members_household ON household_members(household_id);
CREATE INDEX IF NOT EXISTS idx_household_members_resident ON household_members(resident_id);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON announcements(announcement_type);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_certificate_requests_status ON certificate_requests(status);
CREATE INDEX IF NOT EXISTS idx_certificate_requests_type ON certificate_requests(certificate_type);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('barangay_name', '"Barangay Information System"', 'string', 'Official name of the barangay', true),
('barangay_captain', '"Juan Dela Cruz"', 'string', 'Name of the barangay captain', true),
('barangay_address', '"123 Main Street, City, Province"', 'string', 'Physical address of barangay hall', true),
('contact_number', '["+63 917 123 4567"]', 'json', 'Contact numbers for barangay office', true),
('certificate_fees', '{"barangay_clearance": 50, "certificate_indigency": 25, "certificate_residency": 30}', 'json', 'Fees for different certificate types', false),
('working_hours', '{"monday": "8:00 AM - 5:00 PM", "tuesday": "8:00 AM - 5:00 PM", "wednesday": "8:00 AM - 5:00 PM", "thursday": "8:00 AM - 5:00 PM", "friday": "8:00 AM - 5:00 PM", "saturday": "8:00 AM - 12:00 PM"}', 'json', 'Barangay office working hours', true)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert sample staff users (passwords would be hashed in production)
INSERT INTO users (first_name, last_name, email, phone, password_hash, role, status) VALUES
('Admin', 'User', 'admin@brgy.com', '+63 917 123 4567', '$2b$10$dummy.hash.for.demo', 'admin', 'active'),
('Staff', 'User', 'staff@brgy.com', '+63 918 234 5678', '$2b$10$dummy.hash.for.demo', 'staff', 'active')
ON CONFLICT (email) DO NOTHING;