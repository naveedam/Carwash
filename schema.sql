-- ====================================================================
-- DOORSTEP CAR WASH (AQUADOR) - BANGALORE MVP DATABASE SCHEMA
-- Compatible with PostgreSQL, Cloud SQL, Docker Postgres & Supabase
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

-- 2. APARTMENTS / LOCATIONS TABLE (Bangalore Gated Communities)
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

-- 3. SERVICES TABLE (Prices in INR ₹)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('exterior', 'interior', 'full', 'ceramic')),
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 30,
    -- Pricing breakdown by vehicle type in JSONB (in INR ₹)
    price_by_vehicle JSONB NOT NULL DEFAULT '{"hatchback": 299, "sedan": 399, "suv": 499, "luxury": 699}',
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
    vehicle_makeModel VARCHAR(100) NOT NULL,
    license_plate VARCHAR(20) NOT NULL,
    vehicle_color VARCHAR(50),
    booking_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL, -- e.g. "08:30 AM - 09:30 AM"
    price NUMERIC(10, 2) NOT NULL, -- in INR ₹
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
-- SEED DATA FOR BANGALORE APARTMENT COMPLEXES & INR PRICING
-- ====================================================================

INSERT INTO apartments (id, name, address, area, total_blocks, assigned_technician_name)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Prestige Shantiniketan', 'ITPL Main Rd, Whitefield', 'Whitefield Zone', 24, 'Ramesh Kumar (Lead Tech)'),
    ('22222222-2222-2222-2222-222222222222', 'Sobha Neopolis', 'Panathur Main Rd, Kadubeesanahalli', 'ORR / Marathahalli', 19, 'Suresh Nair'),
    ('33333333-3333-3333-3333-333333333333', 'Brigade Gateway', '26/1 Dr Rajkumar Rd, Rajajinagar', 'Malleshwaram / West', 7, 'Manjunath Gowda'),
    ('44444444-4444-4444-4444-444444444444', 'Salarpuria Sattva Greenage', 'Hosur Main Rd, Bommanahalli', 'Electronic City / South', 10, 'Vikram Singh'),
    ('55555555-5555-5555-5555-555555555555', 'Adarsh Palm Retreat', 'Outer Ring Rd, Bellandur', 'Bellandur / Sarjapur', 12, 'Suresh Nair')
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, category, short_description, full_description, duration_minutes, price_by_vehicle, features, is_popular, tag)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Express Exterior Eco-Wash', 'exterior', 'Waterless foam exterior polish, rim degreasing & tire dressing at parking slot.', 'High-pressure waterless spray, scratch-free microfiber wipe, wheel rim cleaning, exterior glass crystal buffing, and tire shine.', 30, '{"hatchback": 299, "sedan": 399, "suv": 499, "luxury": 699}', '["Scratch-free Waterless Wash", "Wheel & Tire Shine Dressing", "Exterior Glass Cleaning", "Door Jam Wipe Down"]', false, 'Quick & Eco'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Deep Interior & Exterior Combo', 'full', 'Full exterior waterless wash + heavy interior vacuum & dashboard sanitize.', 'Full exterior waterless detail + complete cabin vacuuming, floor mat cleaning, dashboard & console anti-bacterial wipe down, and fragrance booster.', 60, '{"hatchback": 699, "sedan": 899, "suv": 1099, "luxury": 1499}', '["All Express Exterior Features", "High-Power Trunk & Cabin Vacuum", "Dashboard & Console UV Protectant", "Seat Polish & Spot Stain Treatment", "Fresh Linen Fragrance"]', true, 'Best Value'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Ceramic Shield & Wax Polish', 'ceramic', 'Hydrophobic ceramic wax coating with gloss boost & leather conditioning.', 'Premium liquid ceramic wax coat applied by hand for long-lasting weather protection, mirror shine, UV shield, and deep leather interior conditioning.', 90, '{"hatchback": 1499, "sedan": 1999, "suv": 2499, "luxury": 3299}', '["Full Exterior Wash + Clay Bar Wipe", "90-Day Hydrophobic Ceramic Wax Coating", "Engine Bay Wipe & Dressing", "Leather Seat Deep Conditioning", "Headlight Restoration & Polish"]', false, 'Premium Gloss'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Interior Sanitization & AC Steam', 'interior', 'Deep steam disinfection, odor removal & AC vent germ elimination.', 'Targeted interior cleaning using high-temperature steam spray to eliminate 99.9% of bacteria, allergens, and stubborn odors from vents and upholstery.', 45, '{"hatchback": 499, "sedan": 699, "suv": 899, "luxury": 1199}', '["High-Temp Steam Vents Cleanse", "Upholstery Shampoo & Extraction", "Ozone Anti-Bacterial Treatment", "Pet Hair & Odor Removal"]', false, 'Hygiene Shield')
ON CONFLICT (id) DO NOTHING;
