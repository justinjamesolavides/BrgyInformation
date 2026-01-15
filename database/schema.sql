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