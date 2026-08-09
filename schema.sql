-- ====================================================================
-- DOORSTEP CAR WASH (AQUADOR) - LEAN MVP DATABASE SCHEMA
-- Compatible with PostgreSQL & Supabase
-- ====================================================================

-- 1. USERS TABLE (Supports Customers, Technicians, & Admins)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'technician', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. APARTMENTS / LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS apartments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    area VARCHAR(100) NOT NULL,
    total_blocks INT DEFAULT 1,
    assigned_technician_name VARCHAR(150),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('exterior', 'interior', 'full', 'ceramic')),
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 30,
    -- Pricing breakdown by vehicle type in JSONB
    price_by_vehicle JSONB NOT NULL DEFAULT '{"hatchback": 18, "sedan": 22, "suv": 28, "luxury": 35}',
    features JSONB NOT NULL DEFAULT '[]',
    is_popular BOOLEAN DEFAULT FALSE,
    tag VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BOOKINGS TABLE (Core Booking Flow)
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(20) PRIMARY KEY, -- e.g. 'WASH-9821'
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    apartment_id UUID REFERENCES apartments(id) ON DELETE RESTRICT,
    apartment_name VARCHAR(200) NOT NULL,
    block_and_slot VARCHAR(150) NOT NULL, -- e.g. "Tower B - Slot B2-45"
    service_id UUID REFERENCES services(id) ON DELETE RESTRICT,
    service_name VARCHAR(150) NOT NULL,
    vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('hatchback', 'sedan', 'suv', 'luxury')),
    vehicle_make_model VARCHAR(100) NOT NULL,
    license_plate VARCHAR(20) NOT NULL,
    vehicle_color VARCHAR(50),
    booking_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL, -- e.g. "08:30 AM - 09:30 AM"
    price NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL DEFAULT 'cash_on_wash' CHECK (payment_method IN ('cash_on_wash', 'card', 'upi')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
    technician_name VARCHAR(150),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR FAST LOOKUPS BY APARTMENT & DATE
CREATE INDEX IF NOT EXISTS idx_bookings_apartment_date ON bookings(apartment_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- ====================================================================
-- SEED DATA FOR LEAN PROTOTYPING
-- ====================================================================

INSERT INTO apartments (id, name, address, area, total_blocks, assigned_technician_name)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Sunrise Towers & Enclave', '104 Westside Parkway', 'Downtown North', 4, 'Alex Rivera'),
    ('22222222-2222-2222-2222-222222222222', 'Oakwood Heights', '452 Elm Street', 'West End', 3, 'David Miller'),
    ('33333333-3333-3333-3333-333333333333', 'The Grand Residency', '88 Skyline Boulevard', 'Financial District', 6, 'Marcus Vance')
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, category, short_description, full_description, duration_minutes, price_by_vehicle, features, is_popular, tag)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Express Exterior Eco-Wash', 'exterior', 'Waterless foam exterior polish, rim degreasing & tire dressing.', 'High-pressure waterless spray, scratch-free microfiber wipe, wheel rim cleaning, exterior glass crystal buffing, and tire shine.', 30, '{"hatchback": 18, "sedan": 22, "suv": 28, "luxury": 35}', '["Scratch-free Waterless Wash", "Wheel & Tire Shine Dressing", "Exterior Glass Cleaning", "Door Jam Wipe Down"]', false, 'Quick & Eco'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Deep Interior & Exterior Combo', 'full', 'Full exterior waterless wash + heavy interior vacuum & dashboard sanitize.', 'Full exterior waterless detail + complete cabin vacuuming, floor mat cleaning, dashboard & console anti-bacterial wipe down, and fragrance booster.', 60, '{"hatchback": 35, "sedan": 42, "suv": 50, "luxury": 62}', '["All Express Exterior Features", "High-Power Trunk & Cabin Vacuum", "Dashboard & Console UV Protectant", "Seat Polish & Spot Stain Treatment", "Fresh Linen Fragrance"]', true, 'Best Value')
ON CONFLICT (id) DO NOTHING;
