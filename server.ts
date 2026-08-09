import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-Memory MVP Data Store (mirrors SQL Schema)
  let apartments = [
    {
      id: "apt-1",
      name: "Sunrise Towers & Enclave",
      address: "104 Westside Parkway, Block A-D",
      area: "Downtown North",
      totalBlocks: 4,
      assignedTechnician: "Alex Rivera (Lead Tech)",
      activeSlotsCount: 12,
    },
    {
      id: "apt-2",
      name: "Oakwood Heights",
      address: "452 Elm Street, Towers 1-3",
      area: "West End",
      totalBlocks: 3,
      assignedTechnician: "David Miller",
      activeSlotsCount: 8,
    },
    {
      id: "apt-3",
      name: "The Grand Residency",
      address: "88 Skyline Boulevard",
      area: "Financial District",
      totalBlocks: 6,
      assignedTechnician: "Marcus Vance",
      activeSlotsCount: 15,
    },
  ];

  let services = [
    {
      id: "srv-1",
      name: "Express Exterior Eco-Wash",
      category: "exterior",
      shortDesc: "Quick waterless exterior foam shine, rim degreasing & tire dressing.",
      description: "High-pressure foam spray, micro-fiber scratch-free wipe, wheel rim cleaning, exterior glass crystal buffing, and tire shine.",
      durationMinutes: 30,
      priceByVehicle: { hatchback: 18, sedan: 22, suv: 28, luxury: 35 },
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
      priceByVehicle: { hatchback: 35, sedan: 42, suv: 50, luxury: 62 },
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
  ];

  let bookings = [
    {
      id: "WASH-9821",
      customerName: "Sarah Jenkins",
      customerPhone: "+1 (555) 234-5678",
      apartmentId: "apt-1",
      apartmentName: "Sunrise Towers & Enclave",
      blockAndSlot: "Tower A, B2-Parking #45",
      serviceId: "srv-2",
      serviceName: "Deep Interior & Exterior Combo",
      vehicleType: "suv",
      vehicleMakeModel: "Tesla Model Y",
      licensePlate: "EV-789-CA",
      vehicleColor: "Pearl White",
      date: new Date().toISOString().split("T")[0],
      timeSlot: "08:30 AM - 09:30 AM",
      price: 50,
      paymentMethod: "card",
      paymentStatus: "paid",
      status: "in_progress",
      technicianName: "Alex Rivera",
      notes: "Please watch out for fragile ceramic coating on front hood.",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "WASH-9822",
      customerName: "Michael Chang",
      customerPhone: "+1 (555) 876-5432",
      apartmentId: "apt-1",
      apartmentName: "Sunrise Towers & Enclave",
      blockAndSlot: "Tower C, Slot #12",
      serviceId: "srv-1",
      serviceName: "Express Exterior Eco-Wash",
      vehicleType: "sedan",
      vehicleMakeModel: "Honda Accord",
      licensePlate: "7XYZ-890",
      vehicleColor: "Midnight Blue",
      date: new Date().toISOString().split("T")[0],
      timeSlot: "09:30 AM - 10:30 AM",
      price: 22,
      paymentMethod: "cash_on_wash",
      paymentStatus: "pending",
      status: "assigned",
      technicianName: "Alex Rivera",
      notes: "Keys left with basement security guard.",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  // API ROUTES
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Doorstep Car Wash Backend" });
  });

  // Get Apartments
  app.get("/api/apartments", (_req, res) => {
    res.json({ success: true, data: apartments });
  });

  // Add Apartment
  app.post("/api/apartments", (req, res) => {
    const { name, address, area, totalBlocks, assignedTechnician } = req.body;
    if (!name || !address) {
      return res.status(400).json({ error: "Apartment name and address required" });
    }
    const newApt = {
      id: `apt-${Date.now()}`,
      name,
      address,
      area: area || "Metropolitan Area",
      totalBlocks: totalBlocks || 1,
      assignedTechnician: assignedTechnician || "Lead Tech",
      activeSlotsCount: 10,
    };
    apartments.push(newApt);
    res.status(201).json({ success: true, data: newApt });
  });

  // Get Services
  app.get("/api/services", (_req, res) => {
    res.json({ success: true, data: services });
  });

  // Get Bookings (Filterable by apartment_id or date)
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

  // Create Booking
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

  // Update Booking Status or Technician
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

  // Vite Middleware for Dev vs Production Static Serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port http://0.0.0.0:${PORT}`);
  });
}

startServer();
