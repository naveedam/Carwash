import React from 'react';
import {
  Sparkles,
  Shield,
  Car,
  Calendar,
  MapPin,
  LogIn,
  LogOut,
} from 'lucide-react';
import { ViewMode, CustomerTab, ApartmentComplex, User } from '../types';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  customerTab: CustomerTab;
  setCustomerTab: (tab: CustomerTab) => void;
  activeApartment: ApartmentComplex;
  apartments: ApartmentComplex[];
  onSelectApartment: (apt: ApartmentComplex) => void;
  activeBookingsCount: number;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
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
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setCustomerTab('book')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  AquaDoor
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Bangalore Doorstep
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Waterless car detailing at your apartment slot • INR (₹)</p>
            </div>
          </div>

          {/* Quick Bangalore Apartment Selector (Customer Mode) */}
          {viewMode === 'customer' && (
            <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 transition-all">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-slate-400">Complex:</span>
              <select
                value={activeApartment.id}
                onChange={(e) => {
                  const selected = apartments.find((a) => a.id === e.target.value);
                  if (selected) onSelectApartment(selected);
                }}
                className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer pr-1 max-w-[200px] truncate"
              >
                {apartments.map((apt) => (
                  <option key={apt.id} value={apt.id} className="bg-slate-900 text-slate-100">
                    {apt.name} ({apt.area})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Right Navigation & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Customer Navigation Tabs */}
            {viewMode === 'customer' && (
              <nav className="flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/60">
                <button
                  onClick={() => setCustomerTab('book')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    customerTab === 'book'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Book Wash</span>
                </button>

                <button
                  onClick={() => setCustomerTab('my-bookings')}
                  className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    customerTab === 'my-bookings'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">My Washes</span>
                  {activeBookingsCount > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 font-bold text-[10px]">
                      {activeBookingsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setCustomerTab('services')}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    customerTab === 'services'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Services</span>
                </button>
              </nav>
            )}

            {/* Mode Switcher: Only visible when logged in as Admin */}
            {currentUser?.role === 'admin' && (
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setViewMode('customer')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'customer'
                      ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Customer view"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Customer</span>
                </button>

                <button
                  onClick={() => setViewMode('admin')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'admin'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Admin Panel"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </button>
              </div>
            )}

            {/* User Account / Auth Button */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1">
                <div className={`w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 text-white ${
                  currentUser.role === 'admin' ? 'bg-gradient-to-tr from-amber-500 to-orange-600' : 'bg-gradient-to-tr from-cyan-500 to-blue-500'
                }`}>
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <span className="text-xs font-bold text-white block truncate max-w-[120px] leading-tight">
                    {currentUser.fullName}
                  </span>
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded inline-block leading-none mt-0.5 ${
                    currentUser.role === 'admin' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-slate-400 hover:text-red-400 p-1 transition-all ml-1 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
