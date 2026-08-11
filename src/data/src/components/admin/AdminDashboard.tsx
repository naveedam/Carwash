import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Clock,
  Car,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  UserCheck,
  TrendingUp,
  Plus,
  ChevronDown,
  Layers,
  MapPin,
  Play,
  CheckCircle2,
  XCircle,
  Users,
  Database,
  RefreshCw,
  IndianRupee,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Booking, BookingStatus, ApartmentComplex, ServicePackage } from '../../types';

interface AdminDashboardProps {
  bookings: Booking[];
  apartments: ApartmentComplex[];
  services: ServicePackage[];
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  onUpdateTechnician: (bookingId: string, techName: string) => void;
  onAddApartment: (apt: Omit<ApartmentComplex, 'id' | 'activeSlotsCount'>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  apartments,
  services,
  onUpdateStatus,
  onUpdateTechnician,
  onAddApartment,
}) => {
  const [groupBy, setGroupBy] = useState<'apartment' | 'date'>('apartment');
  const [selectedApartmentFilter, setSelectedApartmentFilter] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [showAddAptModal, setShowAddAptModal] = useState<boolean>(false);
  const [newAptName, setNewAptName] = useState<string>('');
  const [newAptAddress, setNewAptAddress] = useState<string>('');
  const [newAptArea, setNewAptArea] = useState<string>('Whitefield Zone');
  const [newAptBlocks, setNewAptBlocks] = useState<number>(8);
  const [newAptTech, setNewAptTech] = useState<string>('Ramesh Kumar (Lead Tech)');

  // Stats Calculations in INR ₹
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter((b) => b.date === todayStr);
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.price : 0), 0);
  const inProgressCount = bookings.filter((b) => b.status === 'in_progress').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const pendingCount = bookings.filter((b) => b.status === 'pending' || b.status === 'assigned').length;

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesApt = selectedApartmentFilter === 'all' || b.apartmentId === selectedApartmentFilter;
    const matchesDate = selectedDateFilter === 'all' || b.date === selectedDateFilter;
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.apartmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicleMakeModel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesApt && matchesDate && matchesSearch;
  });

  // Grouping logic by Apartment Complex
  const groupedByApartment = apartments.map((apt) => {
    const aptBookings = filteredBookings.filter((b) => b.apartmentId === apt.id);
    return {
      apartment: apt,
      bookings: aptBookings,
    };
  }).filter((group) => group.bookings.length > 0 || selectedApartmentFilter === group.apartment.id || selectedApartmentFilter === 'all');

  // Grouping logic by Date
  const uniqueDates = Array.from(new Set(filteredBookings.map((b) => b.date))).sort();
  const groupedByDate = uniqueDates.map((dateStr) => ({
    date: dateStr,
    bookings: filteredBookings.filter((b) => b.date === dateStr),
  }));

  const handleAddAptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAptName || !newAptAddress) return;

    onAddApartment({
      name: newAptName,
      address: newAptAddress,
      area: newAptArea || 'Bangalore Zone',
      totalBlocks: newAptBlocks,
      assignedTechnician: newAptTech,
    });

    setNewAptName('');
    setNewAptAddress('');
    setShowAddAptModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 space-y-6">
      
      {/* Top Operations Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Bangalore Operations & Logistics Control</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Doorstep Detailing Management Panel
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Dispatch detailing crews, monitor active wash slots, and onboard Bangalore apartment complexes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddAptModal(true)}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Onboard Bangalore Complex</span>
            </button>
          </div>
        </div>

        {/* Operational Metrics Cards (in INR ₹) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Revenue</span>
              <IndianRupee className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-extrabold text-emerald-400">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">{bookings.length} total wash orders</p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Washing Right Now</span>
              <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
            </div>
            <div className="text-xl font-extrabold text-amber-400">{inProgressCount}</div>
            <p className="text-[10px] text-amber-500/80 mt-0.5">Active tech in slot</p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Pending Dispatch</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-extrabold text-cyan-400">{pendingCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Assigned or queued</p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Completed Washes</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-extrabold text-emerald-400">{completedCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Inspected & ready</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Grouping Toggle */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-semibold px-2">View By:</span>
          <button
            onClick={() => setGroupBy('apartment')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              groupBy === 'apartment'
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Apartment Complex</span>
          </button>

          <button
            onClick={() => setGroupBy('date')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              groupBy === 'date'
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Date Schedule</span>
          </button>
        </div>

        {/* Search & Apartment Select */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-2xl justify-end">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search customer, car make, or plate number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={selectedApartmentFilter}
            onChange={(e) => setSelectedApartmentFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Bangalore Complexes</option>
            {apartments.map((apt) => (
              <option key={apt.id} value={apt.id}>
                {apt.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Main Bookings List grouped by Apartment Complex or Date */}
      {groupBy === 'apartment' ? (
        <div className="space-y-6">
          {groupedByApartment.map((group) => (
            <div key={group.apartment.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              
              {/* Complex Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{group.apartment.name}</span>
                      <span className="text-xs font-normal text-slate-400">({group.apartment.area})</span>
                    </h2>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span>{group.apartment.address} • {group.apartment.totalBlocks} Towers/Blocks</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                    <span className="text-slate-400">Lead Tech: </span>
                    <strong className="text-cyan-300">{group.apartment.assignedTechnician || 'Unassigned'}</strong>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {group.bookings.length} Bookings
                  </span>
                </div>
              </div>

              {/* Bookings inside Complex */}
              {group.bookings.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No active wash bookings scheduled for this apartment complex currently.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.bookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 relative hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-xs text-cyan-400 font-bold block">{b.id}</span>
                          <h3 className="text-sm font-bold text-white">{b.customerName}</h3>
                          <p className="text-[11px] text-slate-400">{b.customerPhone}</p>
                        </div>
                        <span className="text-sm font-extrabold text-cyan-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                          ₹{b.price}
                        </span>
                      </div>

                      <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 text-xs space-y-1">
                        <div className="text-slate-200 font-semibold flex items-center justify-between">
                          <span>{b.vehicleMakeModel}</span>
                          <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">{b.licensePlate}</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{b.blockAndSlot}</p>
                        <p className="text-cyan-400 text-[11px] font-medium">{b.serviceName}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {b.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {b.timeSlot}
                        </span>
                      </div>

                      {/* Status & Tech Actions */}
                      <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-500">Update Status:</span>
                          <select
                            value={b.status}
                            onChange={(e) => onUpdateStatus(b.id, e.target.value as BookingStatus)}
                            className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 px-2 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="assigned">Assigned</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-500">Assign Tech:</span>
                          <input
                            type="text"
                            placeholder="Technician name..."
                            value={b.technicianName || ''}
                            onChange={(e) => onUpdateTechnician(b.id, e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 px-2 py-1 w-32 focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByDate.map((group) => (
            <div key={group.date} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span>{group.date}</span>
                </h2>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300">
                  {group.bookings.length} Washes Scheduled
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.bookings.map((b) => (
                  <div key={b.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-cyan-400 font-bold">{b.id}</span>
                      <span className="text-xs font-bold text-cyan-300">₹{b.price}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{b.customerName}</h3>
                    <p className="text-xs text-slate-400">{b.apartmentName} • {b.blockAndSlot}</p>
                    <p className="text-xs text-cyan-400 font-medium">{b.serviceName}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Apartment Complex Modal */}
      {showAddAptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
            <h2 className="text-xl font-bold text-white mb-2">Onboard New Bangalore Complex</h2>
            <p className="text-xs text-slate-400 mb-4">
              Add partner gated community or residential complex to service area.
            </p>

            <form onSubmit={handleAddAptSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Complex / Society Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Total Environment Windmills of Your Mind"
                  value={newAptName}
                  onChange={(e) => setNewAptName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Full Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Epip Zone, Whitefield"
                  value={newAptAddress}
                  onChange={(e) => setNewAptAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Zone / Area</label>
                  <select
                    value={newAptArea}
                    onChange={(e) => setNewAptArea(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Whitefield Zone">Whitefield Zone</option>
                    <option value="ORR / Bellandur Zone">ORR / Bellandur Zone</option>
                    <option value="Electronic City Zone">Electronic City Zone</option>
                    <option value="Malleshwaram / West Zone">Malleshwaram / West Zone</option>
                    <option value="Hebbal / Yelahanka North Zone">Hebbal / Yelahanka North Zone</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Total Towers / Blocks</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newAptBlocks}
                    onChange={(e) => setNewAptBlocks(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Assigned Lead Technician</label>
                <input
                  type="text"
                  value={newAptTech}
                  onChange={(e) => setNewAptTech(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAptModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  Save Complex
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
