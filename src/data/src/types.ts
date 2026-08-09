export type WashCategory = 'exterior' | 'interior' | 'full' | 'ceramic';

export type VehicleType = 'hatchback' | 'sedan' | 'suv' | 'luxury';

export type UserRole = 'customer' | 'admin' | 'technician';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  apartmentId?: string;
  apartmentName?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  category: WashCategory;
  shortDesc: string;
  description: string;
  durationMinutes: number;
  priceByVehicle: Record<VehicleType, number>; // Prices in INR ₹
  features: string[];
  popular?: boolean;
  tag?: string;
}

export interface ApartmentComplex {
  id: string;
  name: string;
  address: string;
  area: string;
  totalBlocks: number;
  assignedTechnician?: string;
  activeSlotsCount: number;
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  makeModel: string;
  color: string;
  licensePlate: string;
  parkingSlot: string;
  blockNumber: string;
}

export type BookingStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export interface TimeSlot {
  id: string;
  time: string; // e.g. "07:30 AM - 08:30 AM"
  period: 'morning' | 'afternoon' | 'evening';
  available: boolean;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  apartmentId: string;
  apartmentName: string;
  blockAndSlot: string; // e.g. "Tower 12 - Slot B2-104"
  serviceId: string;
  serviceName: string;
  vehicleType: VehicleType;
  vehicleMakeModel: string;
  licensePlate: string;
  vehicleColor: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  price: number; // in INR ₹
  paymentMethod: 'cash_on_wash' | 'card' | 'upi';
  paymentStatus: 'paid' | 'pending';
  status: BookingStatus;
  technicianName?: string;
  notes?: string;
  createdAt: string;
}

export type ViewMode = 'customer' | 'admin';
export type CustomerTab = 'book' | 'my-bookings' | 'services';
