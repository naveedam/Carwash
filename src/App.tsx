import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BookingWizard } from './components/customer/BookingWizard';
import { ActiveBookings } from './components/customer/ActiveBookings';
import { ServicesCatalog } from './components/customer/ServicesCatalog';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import {
  APARTMENT_COMPLEXES,
  SERVICE_PACKAGES,
  TIME_SLOTS,
  INITIAL_BOOKINGS,
  DEMO_USERS
} from './data/mockData';
import {
  ViewMode,
  CustomerTab,
  Booking,
  ApartmentComplex,
  ServicePackage,
  BookingStatus,
  User
} from './types';
import { CheckCircle2, Shield } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [viewMode, setViewMode] = useState<ViewMode>('customer');
  const [customerTab, setCustomerTab] = useState<CustomerTab>('book');

  // Auth & User State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aqua_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id === 'u-1' || parsed.id === 'u-cust1' || parsed.email === 'priya.sharma@example.in' || parsed.fullName === 'Priya Sharma') {
          localStorage.removeItem('aqua_user');
          return null;
        }
        return parsed;
      } catch {
        localStorage.removeItem('aqua_user');
        return null;
      }
    }
    return null; // Public visitors start in signed-out state by default
  });
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Data Persistence State
  const [apartments, setApartments] = useState<ApartmentComplex[]>(() => {
    const saved = localStorage.getItem('aqua_apartments');
    return saved ? JSON.parse(saved) : APARTMENT_COMPLEXES;
  });

  const [activeApartment, setActiveApartment] = useState<ApartmentComplex>(apartments[0]);

  const [services, setServices] = useState<ServicePackage[]>(SERVICE_PACKAGES);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('aqua_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch initial data from Express REST API
  useEffect(() => {
    fetch('/api/apartments')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.length > 0) {
          setApartments(data.data);
          setActiveApartment(data.data[0]);
        }
      })
      .catch(() => console.log('Using local apartments fallback'));

    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.length > 0) {
          setServices(data.data);
        }
      })
      .catch(() => console.log('Using local services fallback'));

    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.length > 0) {
          setBookings(data.data);
        }
      })
      .catch(() => console.log('Using local bookings fallback'));
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('aqua_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('aqua_apartments', JSON.stringify(apartments));
  }, [apartments]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aqua_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('aqua_user');
    }
  }, [currentUser]);

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
    showToast(`New doorstep wash scheduled at ${newBooking.apartmentName} (${newBooking.id})`);

    // Sync to Express Backend API
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBookingData),
    }).catch((err) => console.error('API Sync Error:', err));
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );
    showToast(`Booking ${bookingId} cancelled.`);

    fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    }).catch((err) => console.error('API Patch Error:', err));
  };

  const handleUpdateStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
    showToast(`Status updated to "${status.replace('_', ' ')}" for ${bookingId}`);

    fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch((err) => console.error('API Patch Error:', err));
  };

  const handleUpdateTechnician = (bookingId: string, techName: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, technicianName: techName } : b))
    );
    showToast(`Assigned ${techName} to ${bookingId}`);

    fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ technicianName: techName }),
    }).catch((err) => console.error('API Patch Error:', err));
  };

  const handleAddApartment = (newApt: Omit<ApartmentComplex, 'id' | 'activeSlotsCount'>) => {
    const created: ApartmentComplex = {
      ...newApt,
      id: `apt-${Date.now()}`,
      activeSlotsCount: 12,
    };
    setApartments((prev) => [...prev, created]);
    showToast(`Onboarded new Bangalore complex: ${created.name}`);

    fetch('/api/apartments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApt),
    }).catch((err) => console.error('API Post Error:', err));
  };

  const activeBookingsCount = bookings.filter(
    (b) => b.status === 'pending' || b.status === 'assigned' || b.status === 'in_progress'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 antialiased">
      
      {/* Top Navbar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        customerTab={customerTab}
        setCustomerTab={setCustomerTab}
        activeApartment={activeApartment}
        apartments={apartments}
        onSelectApartment={setActiveApartment}
        activeBookingsCount={activeBookingsCount}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Signed out successfully.');
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <p className="text-xs font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome ${user.fullName} (${user.role.toUpperCase()})`);
          if (user.role === 'admin') setViewMode('admin');
        }}
        apartments={apartments}
      />

      {/* Main Content Router */}
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
            <span className="font-bold text-slate-300">AquaDoor Bangalore</span>
            <span>•</span>
            <span>Doorstep Waterless Vehicle Detailing</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} AquaDoor Technologies. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
