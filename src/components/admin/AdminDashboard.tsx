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
  DollarSign,
  Plus,
  ChevronDown,
  Layers,
  MapPin,
  Play,
  CheckCircle2,
  XCircle,
  Users
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
  const [newAptArea, setNewAptArea] = useState<string>('');
  const [newAptBlocks, setNewAptBlocks] = useState<number>(4);
  const [newAptTech, setNewAptTech] = useState<string>('Alex Rivera');

  // Stats Calculations
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
  }).filter((group) => group.bookings.length > 0 || selectedApartmentFilter === group.apartment.id);

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
      area: newAptArea || 'Metropolitan Area',
      totalBlocks: newAptBlocks,
      assignedTechnician: newAptTech,
    });

    setNewAptName('');
    setNewAptAddress('');
    setNewAptArea('');
    setShowAddAptModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 space-y-6">
      
      {/* Top Operations Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px] uppercase tracking-wider">
              Operations Center
            </span>
            <span className="text-xs text-slate-400">Live Field Tech Dispatch</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Apartment Wash Dispatch & Logistics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddAptModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Apartment Complex</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Today's Schedule</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{todayBookings.length}</p>
          <span className="text-[10px] text-slate-500">Scheduled for today</span>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-xl bg-gradient-to-br from-slate-900 to-amber-950/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>In-Progress Washes</span>
            <Play className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400">{inProgressCount}</p>
          <span className="text-[10px] text-amber-400/80">Active in basement slots</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Completed Washes</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">{completedCount}</p>
          <span className="text-[10px] text-slate-500">Quality verified</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-cyan-400">${totalRevenue}</p>
          <span className="text-[10px] text-slate-500">{bookings.length} total bookings</span>
        </div>
      </div>

      {/* Grouping & Controls Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Group By Toggle (Required by prompt: Grouped by Apartment Complex or Date) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Group View:</span>
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setGroupBy('apartment')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  groupBy === 'apartment'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>By Apartment Complex</span>
              </button>

              <button
                onClick={() => setGroupBy('date')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  groupBy === 'date'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>By Date</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search plate, customer, model..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={selectedApartmentFilter}
              onChange={(e) => setSelectedApartmentFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Apartment Complexes</option>
              {apartments.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* GROUPED LIST VIEW 1: BY APARTMENT COMPLEX */}
      {groupBy === 'apartment' && (
        <div className="space-y-6">
          {groupedByApartment.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
              No washes scheduled for the selected apartment filter.
            </div>
          ) : (
            groupedByApartment.map(({ apartment, bookings: aptBookings }) => (
              <div key={apartment.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                
                {/* Apartment Complex Group Header */}
                <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        {apartment.name}
                        <span className="text-xs font-mono font-normal text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {aptBookings.length} Washes
                        </span>
                      </h2>
                      <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{apartment.address}</span> • 
                        <span className="text-cyan-300 font-medium flex items-center gap-1">
                          <Users className="w-3 h-3 text-cyan-400" />
                          Lead Tech: {apartment.assignedTechnician || 'Doorstep Tech'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Total Complex Revenue:</span>
                    <span className="text-cyan-400 font-extrabold text-sm">
                      ${aptBookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.price : 0), 0)}
                    </span>
                  </div>
                </div>

                {/* Washes Table for this Apartment */}
                {aptBookings.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 italic">
                    No washes currently queued for {apartment.name}.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="px-6 py-3">Booking & Slot</th>
                          <th className="px-6 py-3">Customer & Vehicle</th>
                          <th className="px-6 py-3">Service & Price</th>
                          <th className="px-6 py-3">Assigned Tech</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 text-right">Ops Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {aptBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-800/40 transition-all">
                            <td className="px-6 py-4">
                              <span className="font-mono font-bold text-cyan-400 block">{b.id}</span>
                              <span className="text-white font-medium block">{b.blockAndSlot}</span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {b.date} ({b.timeSlot})
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <span className="font-semibold text-white block">{b.customerName}</span>
                              <span className="text-slate-400 block">{b.customerPhone}</span>
                              <span className="text-slate-300 font-medium block mt-0.5">
                                {b.vehicleMakeModel} ({b.vehicleColor}) • <strong className="font-mono text-cyan-300">{b.licensePlate}</strong>
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <span className="font-semibold text-white block">{b.serviceName}</span>
                              <span className="text-cyan-400 font-extrabold text-sm block">${b.price}</span>
                              <span className="text-[10px] text-slate-400 uppercase">
                                {b.paymentMethod === 'cash_on_wash' ? 'Pay on Service' : 'Paid Online'}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <select
                                value={b.technicianName || apartment.assignedTechnician || 'Alex Rivera'}
                                onChange={(e) => onUpdateTechnician(b.id, e.target.value)}
                                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
                              >
                                <option value="Alex Rivera">Alex Rivera</option>
                                <option value="David Miller">David Miller</option>
                                <option value="Marcus Vance">Marcus Vance</option>
                                <option value="Elena Rostova">Elena Rostova</option>
                              </select>
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold capitalize ${
                                  b.status === 'in_progress'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                                    : b.status === 'completed'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : b.status === 'assigned'
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {b.status.replace('_', ' ')}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {b.status !== 'in_progress' && b.status !== 'completed' && (
                                  <button
                                    onClick={() => onUpdateStatus(b.id, 'in_progress')}
                                    className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                                    title="Start wash session"
                                  >
                                    <Play className="w-3 h-3 fill-current" />
                                    <span>Start</span>
                                  </button>
                                )}

                                {b.status === 'in_progress' && (
                                  <button
                                    onClick={() => onUpdateStatus(b.id, 'completed')}
                                    className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                                    title="Mark wash finished"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Finish</span>
                                  </button>
                                )}

                                {b.status !== 'completed' && b.status !== 'cancelled' && (
                                  <button
                                    onClick={() => onUpdateStatus(b.id, 'cancelled')}
                                    className="px-2 py-1 rounded bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-300 text-[11px] transition-all"
                                    title="Cancel booking"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* GROUPED LIST VIEW 2: BY DATE */}
      {groupBy === 'date' && (
        <div className="space-y-6">
          {groupedByDate.map(({ date, bookings: dateBookings }) => (
            <div key={date} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>Washes for Date: {date}</span>
                  <span className="text-xs text-slate-400 font-normal">({dateBookings.length} bookings)</span>
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3">Apartment & Slot</th>
                      <th className="px-6 py-3">Customer & Vehicle</th>
                      <th className="px-6 py-3">Service</th>
                      <th className="px-6 py-3">Time Slot</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {dateBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/40">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-white block">{b.apartmentName}</span>
                          <span className="text-cyan-300 text-[11px] block">{b.blockAndSlot}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-medium block">{b.customerName}</span>
                          <span className="text-slate-400 text-[11px]">{b.vehicleMakeModel} ({b.licensePlate})</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white block">{b.serviceName}</span>
                          <span className="text-cyan-400 font-bold">${b.price}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-300 font-medium">{b.timeSlot}</td>
                        <td className="px-6 py-4 font-bold text-amber-300 capitalize">{b.status.replace('_', ' ')}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => onUpdateStatus(b.id, b.status === 'in_progress' ? 'completed' : 'in_progress')}
                            className="px-3 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-bold transition-all text-xs"
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Apartment Complex Modal */}
      {showAddAptModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h2 className="text-lg font-bold text-white mb-4">Add Partner Apartment Complex</h2>

            <form onSubmit={handleAddAptSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Apartment Complex Name</label>
                <input
                  type="text"
                  value={newAptName}
                  onChange={(e) => setNewAptName(e.target.value)}
                  placeholder="e.g. Royal Palms Enclave"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Address</label>
                <input
                  type="text"
                  value={newAptAddress}
                  onChange={(e) => setNewAptAddress(e.target.value)}
                  placeholder="e.g. 500 Park Avenue"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Area/Neighborhood</label>
                  <input
                    type="text"
                    value={newAptArea}
                    onChange={(e) => setNewAptArea(e.target.value)}
                    placeholder="e.g. North Suburbs"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Total Towers/Blocks</label>
                  <input
                    type="number"
                    value={newAptBlocks}
                    onChange={(e) => setNewAptBlocks(Number(e.target.value))}
                    min={1}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Assigned Lead Technician</label>
                <input
                  type="text"
                  value={newAptTech}
                  onChange={(e) => setNewAptTech(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddAptModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
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
