import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BookingWizard } from './components/customer/BookingWizard';
import { ActiveBookings } from './components/customer/ActiveBookings';
import { ServicesCatalog } from './components/customer/ServicesCatalog';
import { AdminDashboard } from './components/admin/AdminDashboard';
import {
  APARTMENT_COMPLEXES,
  SERVICE_PACKAGES,
  TIME_SLOTS,
  INITIAL_BOOKINGS
} from './data/mockData';
import {
  ViewMode,
  CustomerTab,
  Booking,
  ApartmentComplex,
  ServicePackage,
  BookingStatus
} from './types';
import { CheckCircle2, Info, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation State
  const [viewMode, setViewMode] = useState<ViewMode>('customer');
  const [customerTab, setCustomerTab] = useState<CustomerTab>('book');

  // Persistence State
  const [apartments, setApartments] = useState<ApartmentComplex[]>(() => {
    const saved = localStorage.getItem('aqua_apartments');
    return saved ? JSON.parse(saved) : APARTMENT_COMPLEXES;
  });

  const [activeApartment, setActiveApartment] = useState<ApartmentComplex>(apartments[0]);

  const [services] = useState<ServicePackage[]>(SERVICE_PACKAGES);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('aqua_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('aqua_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('aqua_apartments', JSON.stringify(apartments));
  }, [apartments]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handlers
  const handleCompleteBooking = (newBookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: `WASH-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    showToast(`New wash scheduled at ${newBooking.apartmentName} (${newBooking.id})`);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );
    showToast(`Booking ${bookingId} cancelled.`);
  };

  const handleUpdateStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
    showToast(`Status updated to "${status.replace('_', ' ')}" for ${bookingId}`);
  };

  const handleUpdateTechnician = (bookingId: string, techName: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, technicianName: techName } : b))
    );
    showToast(`Assigned ${techName} to ${bookingId}`);
  };

  const handleAddApartment = (newApt: Omit<ApartmentComplex, 'id' | 'activeSlotsCount'>) => {
    const created: ApartmentComplex = {
      ...newApt,
      id: `apt-${Date.now()}`,
      activeSlotsCount: 10,
    };
    setApartments((prev) => [...prev, created]);
    showToast(`Added new apartment complex: ${created.name}`);
  };

  const activeBookingsCount = bookings.filter(
    (b) => b.status === 'pending' || b.status === 'assigned' || b.status === 'in_progress'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 antialiased">
      
      {/* Navigation Topbar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        customerTab={customerTab}
        setCustomerTab={setCustomerTab}
        activeApartment={activeApartment}
        apartments={apartments}
        onSelectApartment={setActiveApartment}
        activeBookingsCount={activeBookingsCount}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <p className="text-xs font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Main View Router */}
      <main className="pb-16">
        {viewMode === 'customer' ? (
          <>
            {customerTab === 'book' && (
              <BookingWizard
                apartments={apartments}
                services={services}
                timeSlots={TIME_SLOTS}
                selectedApartment={activeApartment}
                onSelectApartment={setActiveApartment}
                onCompleteBooking={handleCompleteBooking}
                onViewBookings={() => setCustomerTab('my-bookings')}
              />
            )}

            {customerTab === 'my-bookings' && (
              <ActiveBookings
                bookings={bookings}
                onCancelBooking={handleCancelBooking}
                onNewBookingClick={() => setCustomerTab('book')}
              />
            )}

            {customerTab === 'services' && (
              <ServicesCatalog
                services={services}
                onBookService={(srvId) => {
                  setCustomerTab('book');
                }}
              />
            )}
          </>
        ) : (
          <AdminDashboard
            bookings={bookings}
            apartments={apartments}
            services={services}
            onUpdateStatus={handleUpdateStatus}
            onUpdateTechnician={handleUpdateTechnician}
            onAddApartment={handleAddApartment}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">AquaDoor Wash MVP</span>
            <span>•</span>
            <span>Doorstep Waterless Vehicle Detailing</span>
          </div>
          <p>Designed for Apartment Complexes & Gated Communities</p>
        </div>
      </footer>

    </div>
  );
}
