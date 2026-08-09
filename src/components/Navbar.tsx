import React from 'react';
import { Sparkles, Shield, Car, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { ViewMode, CustomerTab, ApartmentComplex } from '../types';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  customerTab: CustomerTab;
  setCustomerTab: (tab: CustomerTab) => void;
  activeApartment: ApartmentComplex;
  apartments: ApartmentComplex[];
  onSelectApartment: (apt: ApartmentComplex) => void;
  activeBookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  customerTab,
  setCustomerTab,
  activeApartment,
  apartments,
  onSelectApartment,
  activeBookingsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCustomerTab('book')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  AquaDoor
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Doorstep Wash
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Car Detailing directly at your apartment parking slot</p>
            </div>
          </div>

          {/* Quick Apartment Selector (Customer Mode) */}
          {viewMode === 'customer' && (
            <div className="hidden md:flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 transition-all">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-slate-400">Location:</span>
              <select
                value={activeApartment.id}
                onChange={(e) => {
                  const selected = apartments.find((a) => a.id === e.target.value);
                  if (selected) onSelectApartment(selected);
                }}
                className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer pr-1"
              >
                {apartments.map((apt) => (
                  <option key={apt.id} value={apt.id} className="bg-slate-900 text-slate-100">
                    {apt.name} ({apt.area})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Right Navigation & View Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Customer Navigation Tabs */}
            {viewMode === 'customer' && (
              <nav className="flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/60">
                <button
                  onClick={() => setCustomerTab('book')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    customerTab === 'book'
                      ? 'bg-cyan-500 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Book Wash</span>
                </button>

                <button
                  onClick={() => setCustomerTab('my-bookings')}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    customerTab === 'my-bookings'
                      ? 'bg-cyan-500 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>My Washes</span>
                  {activeBookingsCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 font-bold text-[10px]">
                      {activeBookingsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setCustomerTab('services')}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    customerTab === 'services'
                      ? 'bg-cyan-500 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Services</span>
                </button>
              </nav>
            )}

            {/* Mode Switcher: Customer vs Admin */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('customer')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'customer'
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Customer booking view"
              >
                <Car className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Customer</span>
              </button>

              <button
                onClick={() => setViewMode('admin')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Operations / Admin dashboard view"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Admin / Ops</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
