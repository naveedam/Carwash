import express from "express";

const app = express();
app.use(express.json());

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

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "AquaDoor Car Wash Vercel API", database: "PostgreSQL Schema Ready" });
});

app.post("/api/auth/signin", (req, res) => {
  const { email, role } = req.body;
  let found = users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
  if (!found) {
    found = {
      id: `u-${Date.now()}`,
      email: email || "user@example.in",
      fullName: email?.split("@")[0] || "Authenticated User",
      phone: "+91 98000 00000",
      role: role || "customer",
    };
    users.push(found);
  }
  res.json({ success: true, user: found });
});

app.post("/api/auth/signup", (req, res) => {
  const { fullName, email, phone, role, apartmentId } = req.body;
  if (!email || !fullName) {
    return res.status(400).json({ error: "Email and full name required" });
  }
  const newUser = {
    id: `u-${Date.now()}`,
    email,
    fullName,
    phone: phone || "+91 90000 00000",
    role: role || "customer",
    apartmentId,
  };
  users.push(newUser);
  res.status(201).json({ success: true, user: newUser });
});

app.get("/api/apartments", (_req, res) => {
  res.json({ success: true, data: apartments });
});

app.post("/api/apartments", (req, res) => {
  const { name, address, area, totalBlocks, assignedTechnician } = req.body;
  if (!name || !address) {
    return res.status(400).json({ error: "Apartment name and address required" });
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

app.get("/api/services", (_req, res) => {
  res.json({ success: true, data: services });
});

app.get("/api/bookings", (req, res) => {
  const { apartment_id, date } = req.query;
  let filtered = [...bookings];
  if (apartment_id) {
    filtered = filtered.filter((b) => b.apartmentId === apartment_id);
  }
  if (date) {
    filtered = filtered.filter((b) => b.date === date);
  }
  res.json({ success: true, count: filtered.length, data: filtered });
});

app.post("/api/bookings", (req, res) => {
  const bData = req.body;
  if (!bData.customerName || !bData.apartmentId || !bData.serviceId) {
    return res.status(400).json({ error: "Missing required booking details" });
  }
  const newBooking = {
    ...bData,
    id: `WASH-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: bData.status || "pending",
  };
  bookings.unshift(newBooking);
  res.status(201).json({ success: true, data: newBooking });
});

app.patch("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const { status, technicianName } = req.body;
  const booking = bookings.find((b) => b.id === id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  if (status) booking.status = status;
  if (technicianName) booking.technicianName = technicianName;
  res.json({ success: true, data: booking });
});

export default app;
