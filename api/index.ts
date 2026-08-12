import express from "express";
// @ts-ignore
import pg from "pg";
// @ts-ignore
import bcrypt from "bcryptjs";

// Extract Pool safely across ESM/CJS bundling modes in Vercel Node runtime
const Pool = pg?.Pool || (pg as any)?.default?.Pool;

async function comparePassword(password: string, hash: string): Promise<boolean> {
  const fn = bcrypt?.compare || (bcrypt as any)?.default?.compare;
  if (typeof fn === "function") {
    return fn(password, hash);
  }
  return false;
}

async function hashPassword(password: string): Promise<string> {
  const fn = bcrypt?.hash || (bcrypt as any)?.default?.hash;
  if (typeof fn === "function") {
    return fn(password, 10);
  }
  return password;
}

const app = express();
app.use(express.json());

// Normalize Vercel serverless rewritten URLs so routes matching /api/* work seamlessly
app.use((req, _res, next) => {
  const forwardedUrl = (req.headers["x-forwarded-url"] as string) || (req.headers["x-matched-path"] as string);
  if (forwardedUrl && forwardedUrl.startsWith("/api")) {
    req.url = forwardedUrl;
  } else if (req.url && !req.url.startsWith("/api")) {
    req.url = "/api" + req.url;
  }
  next();
});

// PostgreSQL Connection Pool (Uses DATABASE_URL if present)
let pool: any = null;
const rawDbUrl = process.env.DATABASE_URL?.trim().replace(/^["']|["']$/g, '');

const isPlaceholderUrl = (url?: string) => {
  if (!url) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes("example.com") ||
    lower.includes("ep-example") ||
    lower.includes("user:password") ||
    lower.includes("your_database_url") ||
    lower.includes("host:5432") ||
    lower.includes("your_password") ||
    lower.includes("<password>") ||
    lower.includes("ep-example-123456") ||
    lower.includes("postgres.database.azure.com")
  );
};

if (rawDbUrl && Pool && !isPlaceholderUrl(rawDbUrl)) {
  try {
    const isLocal = rawDbUrl.includes("localhost") || rawDbUrl.includes("127.0.0.1");
    pool = new Pool({
      connectionString: rawDbUrl,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 3000,
    });
    pool.on("error", (err: any) => {
      console.warn("[PostgreSQL] Pool error, switching to in-memory store:", err?.message || err);
      pool = null;
    });
  } catch (err) {
    console.error("Failed to initialize Pool:", err);
    pool = null;
  }
} else if (rawDbUrl && isPlaceholderUrl(rawDbUrl)) {
  console.log("[Database] DATABASE_URL is set to a placeholder host. Using in-memory store.");
}

// In-Memory MVP Data Store (Fallback)
let users = [
  {
    id: "u-admin",
    email: "naveedahmedm@gmail.com",
    fullName: "Naveed Ahmed (Operations Manager)",
    phone: "+91 98765 43210",
    role: "admin",
  },
  {
    id: "u-cust1",
    email: "priya.sharma@example.in",
    fullName: "Priya Sharma",
    phone: "+91 98123 45678",
    role: "customer",
    apartmentId: "apt-1",
  },
  {
    id: "u-cust2",
    email: "rahul.verma@example.in",
    fullName: "Rahul Verma",
    phone: "+91 97654 32109",
    role: "customer",
    apartmentId: "apt-2",
  },
];

let apartments = [
  {
    id: "apt-1",
    name: "Prestige Shantiniketan",
    address: "ITPL Main Road, Whitefield",
    area: "Whitefield Zone",
    totalBlocks: 24,
    assignedTechnician: "Ramesh Kumar (Lead Tech)",
    activeSlotsCount: 18,
  },
  {
    id: "apt-2",
    name: "Sobha Neopolis",
    address: "Panathur Main Road, Kadubeesanahalli",
    area: "ORR / Marathahalli",
    totalBlocks: 19,
    assignedTechnician: "Suresh Nair",
    activeSlotsCount: 14,
  },
  {
    id: "apt-3",
    name: "Brigade Gateway",
    address: "26/1 Dr Rajkumar Rd, Rajajinagar",
    area: "Malleshwaram / West",
    totalBlocks: 7,
    assignedTechnician: "Manjunath Gowda",
    activeSlotsCount: 12,
  },
  {
    id: "apt-4",
    name: "Salarpuria Sattva Greenage",
    address: "Hosur Main Road, Bommanahalli",
    area: "Electronic City / South",
    totalBlocks: 10,
    assignedTechnician: "Vikram Singh",
    activeSlotsCount: 15,
  },
  {
    id: "apt-5",
    name: "Adarsh Palm Retreat",
    address: "Outer Ring Road, Bellandur",
    area: "Bellandur / Sarjapur",
    totalBlocks: 12,
    assignedTechnician: "Suresh Nair",
    activeSlotsCount: 16,
  },
];

let services = [
  {
    id: "srv-1",
    name: "Express Exterior Eco-Wash",
    category: "exterior",
    shortDesc: "Quick waterless exterior foam shine, rim degreasing & tire dressing at parking slot.",
    description: "High-pressure foam spray, micro-fiber scratch-free wipe, wheel rim cleaning, exterior glass crystal buffing, and tire shine.",
    durationMinutes: 30,
    priceByVehicle: { hatchback: 299, sedan: 399, suv: 499, luxury: 699 },
    features: [
      "Scratch-free Waterless Wash",
      "Wheel & Tire Shine Dressing",
      "Exterior Glass Cleaning",
      "Door Jam Wipe Down",
    ],
    popular: false,
    tag: "Quick & Eco",
  },
  {
    id: "srv-2",
    name: "Deep Interior & Exterior Combo",
    category: "full",
    shortDesc: "Complete exterior foam wash plus heavy interior vacuum & dashboard sanitize.",
    description: "Our most popular service! Full exterior waterless detail + complete cabin vacuuming, floor mat cleaning, dashboard & console anti-bacterial wipe down, and fragrance booster.",
    durationMinutes: 60,
    priceByVehicle: { hatchback: 699, sedan: 899, suv: 1099, luxury: 1499 },
    features: [
      "All Express Exterior Features",
      "High-Power Trunk & Cabin Vacuum",
      "Dashboard & Console UV Protectant",
      "Seat Polish & Spot Stain Treatment",
      "Fresh Linen Fragrance",
    ],
    popular: true,
    tag: "Best Value",
  },
  {
    id: "srv-3",
    name: "Ceramic Shield & Wax Polish",
    category: "ceramic",
    shortDesc: "Hydrophobic ceramic wax coating with gloss boost & leather conditioning.",
    description: "Premium liquid ceramic wax coat applied by hand for long-lasting weather protection, mirror shine, UV shield, and deep leather interior conditioning.",
    durationMinutes: 90,
    priceByVehicle: { hatchback: 1499, sedan: 1999, suv: 2499, luxury: 3299 },
    features: [
      "Full Exterior Wash + Clay Bar Wipe",
      "90-Day Hydrophobic Ceramic Wax Coating",
      "Engine Bay Wipe & Dressing",
      "Leather Seat Deep Conditioning",
      "Headlight Restoration & Polish",
    ],
    popular: false,
    tag: "Premium Gloss",
  },
  {
    id: "srv-4",
    name: "Interior Sanitization & AC Steam",
    category: "interior",
    shortDesc: "Deep steam disinfection, odor removal & AC vent germ elimination.",
    description: "Targeted interior cleaning using high-temperature steam spray to eliminate 99.9% of bacteria, allergens, and stubborn odors from vents and upholstery.",
    durationMinutes: 45,
    priceByVehicle: { hatchback: 499, sedan: 699, suv: 899, luxury: 1199 },
    features: [
      "High-Temp Steam Vents Cleanse",
      "Upholstery Shampoo & Extraction",
      "Ozone Anti-Bacterial Treatment",
      "Pet Hair & Odor Removal",
    ],
    popular: false,
    tag: "Hygiene Shield",
  },
];

let bookings = [
  {
    id: "WASH-9821",
    customerName: "Priya Sharma",
    customerPhone: "+91 98123 45678",
    apartmentId: "apt-1",
    apartmentName: "Prestige Shantiniketan",
    blockAndSlot: "Tower 12, B2-Parking #104",
    serviceId: "srv-2",
    serviceName: "Deep Interior & Exterior Combo",
    vehicleType: "suv",
    vehicleMakeModel: "Tata Harrier Dark Edition",
    licensePlate: "KA-03-MP-4521",
    vehicleColor: "Oberon Black",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "08:30 AM - 09:30 AM",
    price: 1099,
    paymentMethod: "upi",
    paymentStatus: "paid",
    status: "in_progress",
    technicianName: "Ramesh Kumar",
    notes: "Please watch out for fragile ceramic coating on front hood.",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "WASH-9822",
    customerName: "Rahul Verma",
    customerPhone: "+91 97654 32109",
    apartmentId: "apt-2",
    apartmentName: "Sobha Neopolis",
    blockAndSlot: "Tower 4, Slot #B1-42",
    serviceId: "srv-1",
    serviceName: "Express Exterior Eco-Wash",
    vehicleType: "sedan",
    vehicleMakeModel: "Hyundai Verna",
    licensePlate: "KA-51-MD-9081",
    vehicleColor: "Titan Grey",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "09:30 AM - 10:30 AM",
    price: 399,
    paymentMethod: "cash_on_wash",
    paymentStatus: "pending",
    status: "assigned",
    technicianName: "Suresh Nair",
    notes: "Keys left with basement security supervisor.",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

// Database Row Mappers
const mapApartment = (row: any) => ({
  id: row.id,
  name: row.name,
  address: row.address,
  area: row.area,
  totalBlocks: Number(row.total_blocks),
  assignedTechnician: row.assigned_technician,
  activeSlotsCount: Number(row.active_slots_count),
});

const mapService = (row: any) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  shortDesc: row.short_desc,
  description: row.description,
  durationMinutes: Number(row.duration_minutes),
  priceByVehicle: typeof row.price_by_vehicle === "string" ? JSON.parse(row.price_by_vehicle) : row.price_by_vehicle,
  features: typeof row.features === "string" ? JSON.parse(row.features) : row.features,
  popular: Boolean(row.popular),
  tag: row.tag,
});

const mapBooking = (row: any) => ({
  id: row.id,
  customerName: row.customer_name,
  customerPhone: row.customer_phone,
  apartmentId: row.apartment_id,
  apartmentName: row.apartment_name,
  blockAndSlot: row.block_and_slot,
  serviceId: row.service_id,
  serviceName: row.service_name,
  vehicleType: row.vehicle_type,
  vehicleMakeModel: row.vehicle_make_model,
  licensePlate: row.license_plate,
  vehicleColor: row.vehicle_color,
  date: row.date,
  timeSlot: row.time_slot,
  price: Number(row.price),
  paymentMethod: row.payment_method,
  paymentStatus: row.payment_status,
  status: row.status,
  technicianName: row.technician_name,
  notes: row.notes,
  createdAt: row.created_at,
});

const mapUser = (row: any) => ({
  id: row.id,
  email: row.email,
  fullName: row.full_name,
  phone: row.phone,
  role: row.role,
  apartmentId: row.apartment_id,
});

// Auto DB Schema Initialization helper (Optimized & Memoized for Serverless)
let isSchemaInitialized = false;
let schemaInitPromise: Promise<void> | null = null;

async function ensureDbSchema() {
  if (!pool || isSchemaInitialized) return;
  if (schemaInitPromise) return schemaInitPromise;

  schemaInitPromise = (async () => {
    try {
      // Execute table creations individually so errors in one query don't halt the rest
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(100) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          role VARCHAR(50) DEFAULT 'customer',
          apartment_id VARCHAR(100),
          password_hash TEXT
        );
      `).catch(err => console.error("users table init error:", err.message));

      await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
      `).catch(err => console.error("users alter column error:", err.message));

      await pool.query(`
        CREATE TABLE IF NOT EXISTS apartments (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          address TEXT NOT NULL,
          area VARCHAR(255),
          total_blocks INT DEFAULT 1,
          assigned_technician VARCHAR(255),
          active_slots_count INT DEFAULT 12
        );
      `).catch(err => console.error("apartments table init error:", err.message));

      await pool.query(`
        CREATE TABLE IF NOT EXISTS services (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(50) NOT NULL,
          short_desc TEXT,
          description TEXT,
          duration_minutes INT,
          price_by_vehicle JSONB,
          features JSONB,
          popular BOOLEAN DEFAULT false,
          tag VARCHAR(100)
        );
      `).catch(err => console.error("services table init error:", err.message));

      await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
          id VARCHAR(100) PRIMARY KEY,
          customer_name VARCHAR(255) NOT NULL,
          customer_phone VARCHAR(50),
          apartment_id VARCHAR(100),
          apartment_name VARCHAR(255),
          block_and_slot VARCHAR(255),
          service_id VARCHAR(100),
          service_name VARCHAR(255),
          vehicle_type VARCHAR(50),
          vehicle_make_model VARCHAR(255),
          license_plate VARCHAR(50),
          vehicle_color VARCHAR(50),
          date VARCHAR(20),
          time_slot VARCHAR(100),
          price NUMERIC,
          payment_method VARCHAR(50),
          payment_status VARCHAR(50),
          status VARCHAR(50) DEFAULT 'pending',
          technician_name VARCHAR(255),
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `).catch(err => console.error("bookings table init error:", err.message));

      const checkResult = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM apartments) AS apt_count,
          (SELECT COUNT(*) FROM services) AS srv_count,
          (SELECT COUNT(*) FROM users) AS usr_count
      `).catch(() => null);

      if (checkResult) {
        const aptCount = parseInt(checkResult.rows[0]?.apt_count || "0", 10);
        const srvCount = parseInt(checkResult.rows[0]?.srv_count || "0", 10);
        const usrCount = parseInt(checkResult.rows[0]?.usr_count || "0", 10);

        if (aptCount === 0) {
          for (const apt of apartments) {
            await pool.query(
              `INSERT INTO apartments (id, name, address, area, total_blocks, assigned_technician, active_slots_count)
               VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
              [apt.id, apt.name, apt.address, apt.area, apt.totalBlocks, apt.assignedTechnician, apt.activeSlotsCount]
            ).catch(() => {});
          }
        }

        if (srvCount === 0) {
          for (const srv of services) {
            await pool.query(
              `INSERT INTO services (id, name, category, short_desc, description, duration_minutes, price_by_vehicle, features, popular, tag)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT DO NOTHING`,
              [
                srv.id, srv.name, srv.category, srv.shortDesc, srv.description,
                srv.durationMinutes, JSON.stringify(srv.priceByVehicle),
                JSON.stringify(srv.features), srv.popular, srv.tag
              ]
            ).catch(() => {});
          }
        }

        if (usrCount === 0) {
          for (const u of users) {
            await pool.query(
              `INSERT INTO users (id, email, full_name, phone, role, apartment_id)
               VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
              [u.id, u.email, u.fullName, u.phone, u.role, u.apartmentId || null]
            ).catch(() => {});
          }
        }
      }

      isSchemaInitialized = true;
    } catch (err: any) {
      console.warn("[PostgreSQL] Schema init error, switching to in-memory store:", err?.message || err);
      pool = null;
    } finally {
      schemaInitPromise = null;
    }
  })();

  return schemaInitPromise;
}

// API Routes
app.get(["/api/health", "/health"], async (_req, res) => {
  let dbStatus = "In-Memory Store";
  if (pool) {
    try {
      await pool.query("SELECT 1");
      dbStatus = "PostgreSQL Connected";
    } catch {
      dbStatus = "PostgreSQL Connection Error";
    }
  }
  res.json({
    status: "ok",
    service: "AquaDoor Car Wash Vercel API",
    database: dbStatus,
  });
});

app.get(["/api/health/db-status", "/health/db-status"], async (_req, res) => {
  const isDbUrlDetected = Boolean(process.env.DATABASE_URL);

  if (pool) {
    try {
      await ensureDbSchema();
      const result = await pool.query(`
        SELECT 
          current_database() AS db_name, 
          pg_is_in_recovery() AS in_recovery,
          (SELECT COUNT(*) FROM users) AS total_users,
          (SELECT COUNT(*) FROM bookings) AS total_bookings,
          (SELECT COUNT(*) FROM apartments) AS total_apartments
      `);

      const row = result.rows[0];
      return res.json({
        status: "ok",
        connected: true,
        database_url_detected: isDbUrlDetected,
        storage_mode: "PostgreSQL (Cloud Persistent)",
        database_name: row.db_name,
        is_in_recovery: row.in_recovery,
        total_registered_users: parseInt(row.total_users || "0", 10),
        total_bookings: parseInt(row.total_bookings || "0", 10),
        total_apartments: parseInt(row.total_apartments || "0", 10),
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("Database health check error:", err);
      return res.status(200).json({
        status: "error",
        connected: false,
        database_url_detected: isDbUrlDetected,
        storage_mode: "PostgreSQL (Connection Error)",
        error: err?.message || "Failed to query database",
        timestamp: new Date().toISOString(),
      });
    }
  }

  return res.json({
    status: "ok",
    connected: false,
    database_url_detected: isDbUrlDetected,
    storage_mode: "In-Memory (Fallback)",
    total_registered_users: users.length,
    total_bookings: bookings.length,
    total_apartments: apartments.length,
    message: "DATABASE_URL environment variable is not configured. Running with in-memory transient store.",
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/auth/signin", async (req, res) => {
  const { email, password, role } = req.body;
  const cleanEmail = (email || "").trim().toLowerCase();

  if (pool) {
    try {
      await ensureDbSchema();
      const result = await pool.query("SELECT * FROM users WHERE LOWER(email) = $1", [cleanEmail]);
      if (result.rows.length > 0) {
        const dbUser = result.rows[0];
        if (dbUser.password_hash && password) {
          const isValidPassword = await comparePassword(password, dbUser.password_hash);
          if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
          }
        }
        return res.json({ success: true, user: mapUser(dbUser) });
      } else {
        const newId = `u-${Date.now()}`;
        const newName = email?.split("@")[0] || "Authenticated User";
        const passwordHash = password ? await hashPassword(password) : null;
        const insertResult = await pool.query(
          `INSERT INTO users (id, email, full_name, phone, role, password_hash)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [newId, cleanEmail || "user@example.in", newName, "+91 98000 00000", role || "customer", passwordHash]
        );
        return res.json({ success: true, user: mapUser(insertResult.rows[0]) });
      }
    } catch (err) {
      console.error("Database signin error:", err);
    }
  }

  let found = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!found) {
    found = {
      id: `u-${Date.now()}`,
      email: cleanEmail || "user@example.in",
      fullName: email?.split("@")[0] || "Authenticated User",
      phone: "+91 98000 00000",
      role: role || "customer",
    };
    users.push(found);
  }
  res.json({ success: true, user: mapUser(found) });
});

app.post("/api/auth/signup", async (req, res) => {
  const { fullName, email, phone, role, apartmentId, password } = req.body;
  if (!email || !fullName) {
    return res.status(400).json({ error: "Email and full name required" });
  }
  const cleanEmail = email.trim().toLowerCase();

  let passwordHash: string | null = null;
  if (password) {
    passwordHash = await hashPassword(password);
  }

  if (pool) {
    try {
      await ensureDbSchema();
      const newId = `u-${Date.now()}`;
      const insertResult = await pool.query(
        `INSERT INTO users (id, email, full_name, phone, role, apartment_id, password_hash)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (email) DO UPDATE SET 
           full_name = EXCLUDED.full_name, 
           phone = EXCLUDED.phone,
           password_hash = COALESCE(EXCLUDED.password_hash, users.password_hash)
         RETURNING *`,
        [newId, cleanEmail, fullName, phone || "+91 90000 00000", role || "customer", apartmentId || null, passwordHash]
      );
      return res.status(201).json({ success: true, user: mapUser(insertResult.rows[0]) });
    } catch (err) {
      console.error("Database signup error:", err);
    }
  }

  const newUser = {
    id: `u-${Date.now()}`,
    email: cleanEmail,
    fullName,
    phone: phone || "+91 90000 00000",
    role: role || "customer",
    apartmentId,
  };
  users.push(newUser);
  res.status(201).json({ success: true, user: mapUser(newUser) });
});

app.get("/api/apartments", async (_req, res) => {
  if (pool) {
    try {
      await ensureDbSchema();
      if (pool) {
        const result = await pool.query("SELECT * FROM apartments ORDER BY name ASC");
        return res.json({ success: true, data: result.rows.map(mapApartment) });
      }
    } catch (err: any) {
      console.warn("[PostgreSQL] Get apartments error, falling back to in-memory:", err?.message || err);
      pool = null;
    }
  }
  res.json({ success: true, data: apartments });
});

app.post("/api/apartments", async (req, res) => {
  const { name, address, area, totalBlocks, assignedTechnician } = req.body;
  if (!name || !address) {
    return res.status(400).json({ error: "Apartment name and address required" });
  }

  if (pool) {
    try {
      await ensureDbSchema();
      if (pool) {
        const newId = `apt-${Date.now()}`;
        const result = await pool.query(
          `INSERT INTO apartments (id, name, address, area, total_blocks, assigned_technician, active_slots_count)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [
            newId, name, address,
            area || "Bangalore Zone",
            totalBlocks || 1,
            assignedTechnician || "Zone Lead Tech",
            12
          ]
        );
        return res.status(201).json({ success: true, data: mapApartment(result.rows[0]) });
      }
    } catch (err: any) {
      console.warn("[PostgreSQL] Add apartment error, falling back to in-memory:", err?.message || err);
      pool = null;
    }
  }

  const newApt = {
    id: `apt-${Date.now()}`,
    name,
    address,
    area: area || "Bangalore Zone",
    totalBlocks: totalBlocks || 1,
    assignedTechnician: assignedTechnician || "Zone Lead Tech",
    activeSlotsCount: 12,
  };
  apartments.push(newApt);
  res.status(201).json({ success: true, data: newApt });
});

app.get("/api/services", async (_req, res) => {
  if (pool) {
    try {
      await ensureDbSchema();
      if (pool) {
        const result = await pool.query("SELECT * FROM services ORDER BY name ASC");
        return res.json({ success: true, data: result.rows.map(mapService) });
      }
    } catch (err: any) {
      console.warn("[PostgreSQL] Get services error, falling back to in-memory:", err?.message || err);
      pool = null;
    }
  }
  res.json({ success: true, data: services });
});

app.get("/api/bookings", async (req, res) => {
  const { apartment_id, date } = req.query;

  if (pool) {
    try {
      await ensureDbSchema();
      if (pool) {
        let query = "SELECT * FROM bookings";
        const params: any[] = [];
        const conditions: string[] = [];

        if (apartment_id) {
          params.push(apartment_id);
          conditions.push(`apartment_id = $${params.length}`);
        }
        if (date) {
          params.push(date);
          conditions.push(`date = $${params.length}`);
        }

        if (conditions.length > 0) {
          query += " WHERE " + conditions.join(" AND ");
        }
        query += " ORDER BY created_at DESC";

        const result = await pool.query(query, params);
        const mapped = result.rows.map(mapBooking);
        return res.json({ success: true, count: mapped.length, data: mapped });
      }
    } catch (err: any) {
      console.warn("[PostgreSQL] Get bookings error, falling back to in-memory:", err?.message || err);
      pool = null;
    }
  }

  let filtered = [...bookings];
  if (apartment_id) {
    filtered = filtered.filter((b) => b.apartmentId === apartment_id);
  }
  if (date) {
    filtered = filtered.filter((b) => b.date === date);
  }
  res.json({ success: true, count: filtered.length, data: filtered });
});

app.post("/api/bookings", async (req, res) => {
  const bData = req.body;
  if (!bData.customerName || !bData.apartmentId || !bData.serviceId) {
    return res.status(400).json({ error: "Missing required booking details" });
  }

  const bookingId = `WASH-${Math.floor(1000 + Math.random() * 9000)}`;
  const createdAt = new Date().toISOString();
  const status = bData.status || "pending";

  if (pool) {
    try {
      await ensureDbSchema();
      if (pool) {
        const result = await pool.query(
          `INSERT INTO bookings (
            id, customer_name, customer_phone, apartment_id, apartment_name,
            block_and_slot, service_id, service_name, vehicle_type, vehicle_make_model,
            license_plate, vehicle_color, date, time_slot, price,
            payment_method, payment_status, status, technician_name, notes, created_at
          ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15,
            $16, $17, $18, $19, $20, $21
          ) RETURNING *`,
          [
            bookingId, bData.customerName, bData.customerPhone || null,
            bData.apartmentId, bData.apartmentName || null,
            bData.blockAndSlot || null, bData.serviceId, bData.serviceName || null,
            bData.vehicleType || null, bData.vehicleMakeModel || null,
            bData.licensePlate || null, bData.vehicleColor || null,
            bData.date || null, bData.timeSlot || null, bData.price || 0,
            bData.paymentMethod || 'upi', bData.paymentStatus || 'pending',
            status, bData.technicianName || 'Unassigned', bData.notes || null,
            createdAt
          ]
        );
        return res.status(201).json({ success: true, data: mapBooking(result.rows[0]) });
      }
    } catch (err: any) {
      console.warn("[PostgreSQL] Create booking error, falling back to in-memory:", err?.message || err);
      pool = null;
    }
  }

  const newBooking = {
    ...bData,
    id: bookingId,
    createdAt,
    status,
  };
  bookings.unshift(newBooking);
  res.status(201).json({ success: true, data: newBooking });
});

app.patch("/api/bookings/:id", async (req, res) => {
  const { id } = req.params;
  const { status, technicianName } = req.body;

  if (pool) {
    try {
      await ensureDbSchema();
      if (pool) {
        const result = await pool.query(
          `UPDATE bookings
           SET status = COALESCE($1, status),
               technician_name = COALESCE($2, technician_name)
           WHERE id = $3
           RETURNING *`,
          [status || null, technicianName || null, id]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "Booking not found" });
        }
        return res.json({ success: true, data: mapBooking(result.rows[0]) });
      }
    } catch (err: any) {
      console.warn("[PostgreSQL] Update booking error, falling back to in-memory:", err?.message || err);
      pool = null;
    }
  }

  const booking = bookings.find((b) => b.id === id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  if (status) booking.status = status;
  if (technicianName) booking.technicianName = technicianName;
  res.json({ success: true, data: booking });
});

// Root API Welcome route
app.get(["/", "/api", "/api/"], (_req, res) => {
  res.json({
    message: "AquaDoor Car Wash Vercel Serverless API Running",
    status: "ok",
    endpoints: [
      "/api/health",
      "/api/health/db-status",
      "/api/apartments",
      "/api/services",
      "/api/bookings",
      "/api/auth/signin",
      "/api/auth/signup",
    ],
  });
});

// Fallback for unhandled API routes
app.use((_req, res) => {
  res.status(404).json({ error: "API Route Not Found" });
});

// Global Express Error Handler for Serverless
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Vercel API Serverless Unhandled Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err?.message || "An unexpected error occurred",
  });
});

export default app;
