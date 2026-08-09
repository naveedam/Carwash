import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Car,
  MapPin,
  CheckCircle,
  AlertCircle,
  Sparkles,
  PhoneCall,
  UserCheck,
  Search,
  Filter,
  XCircle,
  FileText
} from 'lucide-react';
import { Booking, BookingStatus } from '../../types';

interface ActiveBookingsProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onNewBookingClick: () => void;
}

export const ActiveBookings: React.FC<ActiveBookingsProps> = ({
  bookings,
  onCancelBooking,
  onNewBookingClick,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.apartmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicleMakeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Washing Right Now
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            Tech Assigned
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Scheduled
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-6 px-4 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-400" />
            <span>My Doorstep Wash Bookings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track live detailing progress, assigned technicians, and service history.
          </p>
        </div>

        <button
          onClick={onNewBookingClick}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Book New Wash</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search license plate, apartment..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'in_progress', 'assigned', 'pending', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all ${
                filterStatus === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {st === 'all' ? 'All Bookings' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <Car className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-300">No bookings match your filter</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Schedule a wash to experience waterless detailing at your doorstep.
          </p>
          <button
            onClick={onNewBookingClick}
            className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-400 transition-all"
          >
            Schedule Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className={`bg-slate-900 border rounded-2xl p-5 sm:p-6 transition-all shadow-lg ${
                b.status === 'in_progress'
                  ? 'border-amber-500/50 ring-1 ring-amber-500/20 bg-slate-900/90'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/40">
                      {b.id}
                    </span>
                    <h3 className="font-bold text-base text-white">{b.serviceName}</h3>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{b.apartmentName}</span> • <strong className="text-slate-200">{b.blockAndSlot}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(b.status)}
                  <span className="text-lg font-extrabold text-white">${b.price}</span>
                </div>
              </div>

              {/* Progress Bar for Active / In-Progress */}
              {b.status === 'in_progress' && (
                <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 mb-4">
                  <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Technician Active at Vehicle
                    </span>
                    <span className="text-slate-400">Estimated completion in ~15 mins</span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                    <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-2 rounded-full w-3/4 animate-pulse" />
                  </div>

                  <div className="grid grid-cols-4 text-[10px] text-slate-400 text-center font-medium">
                    <span className="text-emerald-400">✓ Arrived</span>
                    <span className="text-emerald-400">✓ Foam Spray</span>
                    <span className="text-amber-300 font-bold">● Microfiber Polish</span>
                    <span className="text-slate-600">Inspection</span>
                  </div>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60">
                <div>
                  <span className="text-slate-500 block text-[11px]">Scheduled Date & Time:</span>
                  <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {b.date} @ {b.timeSlot}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Vehicle:</span>
                  <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                    <Car className="w-3.5 h-3.5 text-cyan-400" />
                    {b.vehicleMakeModel} ({b.vehicleColor}) • <strong className="font-mono">{b.licensePlate}</strong>
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Assigned Specialist:</span>
                  <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    {b.technicianName || 'Doorstep Lead Specialist'}
                  </span>
                </div>
              </div>

              {b.notes && (
                <p className="text-[11px] text-slate-400 mt-3 italic bg-slate-950/40 px-3 py-1.5 rounded border border-slate-800/50">
                  Note: "{b.notes}"
                </p>
              )}

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Support: +1 (800) 555-WASH</span>
                </div>

                <div className="flex items-center gap-2">
                  {b.status === 'pending' && (
                    <button
                      onClick={() => onCancelBooking(b.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-800/40 transition-all font-medium"
                    >
                      Cancel Wash
                    </button>
                  )}
                  {b.status === 'completed' && (
                    <button
                      onClick={() => alert(`Downloading Receipt for Booking ${b.id}`)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all font-medium"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Receipt</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
