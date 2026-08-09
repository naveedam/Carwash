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
  FileText,
  IndianRupee,
  Building2,
  QrCode
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
            Washing in Slot Now
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            Detailer Dispatched
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            Completed & Polished
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
            <span>My Doorstep Wash Orders (Bangalore)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track live detailing progress, assigned technicians, and service history.
          </p>
        </div>

        <button
          onClick={onNewBookingClick}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Car className="w-4 h-4" />
          <span>Book New Wash</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-400 font-semibold">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="assigned">Dispatched</option>
            <option value="in_progress">Washing Now</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search license plate, booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Car className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Doorstep Wash Orders Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You don't have any washes matching this filter. Schedule a doorstep wash at your Bangalore apartment parking bay today!
          </p>
          <button
            onClick={onNewBookingClick}
            className="mt-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
          >
            Schedule Doorstep Wash
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl hover:border-slate-700 transition-all relative overflow-hidden"
            >
              
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {b.id}
                    </span>
                    {getStatusBadge(b.status)}
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5">{b.serviceName}</h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xl font-extrabold text-cyan-400 block">₹{b.price}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    {b.paymentMethod === 'upi' ? 'UPI Pay' : b.paymentMethod === 'card' ? 'Card Pay' : 'Pay on Wash'}
                  </span>
                </div>
              </div>

              {/* Apartment & Slot */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-200 font-semibold">
                  <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{b.apartmentName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 pl-6">
                  <span>Slot: <strong className="text-slate-200">{b.blockAndSlot}</strong></span>
                  <span className="capitalize text-slate-400">Vehicle: <strong className="text-slate-200">{b.vehicleMakeModel} ({b.licensePlate})</strong></span>
                </div>
              </div>

              {/* Timing & Tech */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{b.date}</span>
                  <span>•</span>
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{b.timeSlot}</span>
                </div>

                {b.technicianName && (
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg text-slate-300">
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tech: <strong className="text-white">{b.technicianName}</strong></span>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              {b.status !== 'cancelled' && b.status !== 'completed' && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 italic">
                    {b.notes ? `Note: ${b.notes}` : 'Detailing team will arrive at your slot.'}
                  </span>

                  <button
                    onClick={() => onCancelBooking(b.id)}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
