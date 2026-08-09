import React, { useState } from 'react';
import {
  Building2,
  Car,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  MapPin,
  Check,
  DollarSign,
  Info,
  Droplets,
  Award
} from 'lucide-react';
import {
  ApartmentComplex,
  ServicePackage,
  TimeSlot,
  VehicleType,
  Booking,
  Vehicle
} from '../../types';

interface BookingWizardProps {
  apartments: ApartmentComplex[];
  services: ServicePackage[];
  timeSlots: TimeSlot[];
  selectedApartment: ApartmentComplex;
  onSelectApartment: (apt: ApartmentComplex) => void;
  onCompleteBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  onViewBookings: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  apartments,
  services,
  timeSlots,
  selectedApartment,
  onSelectApartment,
  onCompleteBooking,
  onViewBookings,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [apartmentId, setApartmentId] = useState<string>(selectedApartment.id);
  const [blockAndSlot, setBlockAndSlot] = useState<string>('Tower A - Basement Slot #24');
  
  const [vehicleType, setVehicleType] = useState<VehicleType>('sedan');
  const [makeModel, setMakeModel] = useState<string>('Honda Civic');
  const [licensePlate, setLicensePlate] = useState<string>('ABC-8921');
  const [vehicleColor, setVehicleColor] = useState<string>('Silver');

  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[1]?.id || services[0].id);
  
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>(timeSlots[1]?.time || timeSlots[0].time);

  const [customerName, setCustomerName] = useState<string>('Alex Johnson');
  const [customerPhone, setCustomerPhone] = useState<string>('+1 (555) 987-6543');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_wash' | 'card' | 'upi'>('card');
  const [notes, setNotes] = useState<string>('Keys left with building front gate guard or call me.');

  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  // Derived current service package
  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const calculatedPrice = currentService.priceByVehicle[vehicleType];

  const currentApartment = apartments.find((a) => a.id === apartmentId) || selectedApartment;

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking = {
      customerName,
      customerPhone,
      apartmentId,
      apartmentName: currentApartment.name,
      blockAndSlot,
      serviceId: currentService.id,
      serviceName: currentService.name,
      vehicleType,
      vehicleMakeModel: makeModel,
      licensePlate: licensePlate.toUpperCase(),
      vehicleColor,
      date: bookingDate,
      timeSlot: selectedSlot,
      price: calculatedPrice,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash_on_wash' ? ('pending' as const) : ('paid' as const),
      status: 'pending' as const,
      notes,
    };

    onCompleteBooking(newBooking);
    const mockId = `WASH-${Math.floor(1000 + Math.random() * 9000)}`;
    setCreatedBookingId(mockId);
  };

  // Helper date buttons
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = tomorrowObj.toISOString().split('T')[0];

  const dayAfterObj = new Date();
  dayAfterObj.setDate(dayAfterObj.getDate() + 2);
  const dayAfterStr = dayAfterObj.toISOString().split('T')[0];

  if (createdBookingId) {
    return (
      <div className="max-w-2xl mx-auto my-8 bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30 ring-8 ring-cyan-500/10">
          <CheckCircle className="w-10 h-10 animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Wash Scheduled Successfully!</h2>
        <p className="text-slate-400 text-sm mb-6">
          Booking Reference: <span className="font-mono text-cyan-400 font-bold">{createdBookingId}</span>
        </p>

        <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 text-left text-xs text-slate-300 space-y-2.5 mb-6">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-500">Service:</span>
            <span className="font-semibold text-white">{currentService.name}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-500">Apartment & Slot:</span>
            <span className="font-semibold text-white">{currentApartment.name} ({blockAndSlot})</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-500">Scheduled Time:</span>
            <span className="font-semibold text-cyan-300">{bookingDate} @ {selectedSlot}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-500">Vehicle:</span>
            <span className="font-semibold text-white">{makeModel} ({licensePlate})</span>
          </div>
          <div className="flex justify-between pt-1 font-medium text-sm">
            <span className="text-slate-400">Total Amount:</span>
            <span className="text-cyan-400 font-bold">${calculatedPrice} ({paymentMethod === 'cash_on_wash' ? 'Pay on Service' : 'Paid Online'})</span>
          </div>
        </div>

        <div className="p-4 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-cyan-200 text-xs text-left mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-0.5">What happens next?</p>
            <p className="text-slate-300 leading-relaxed">
              Our technician <span className="text-cyan-300 font-medium">{currentApartment.assignedTechnician || 'Doorstep Specialist'}</span> will arrive at your parking slot with specialized eco-waterless detailing gear. No need to drive anywhere!
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setCreatedBookingId(null);
              setStep(1);
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-all border border-slate-700"
          >
            Book Another Wash
          </button>
          <button
            onClick={onViewBookings}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Track Wash Progress
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-6 px-4">
      
      {/* Wizard Header Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-cyan-400">
              Step {step} of 5
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {step === 1 && 'Select Your Apartment & Parking Slot'}
              {step === 2 && 'Vehicle Information'}
              {step === 3 && 'Choose Wash Package'}
              {step === 4 && 'Schedule Date & Time Slot'}
              {step === 5 && 'Review & Confirm Booking'}
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>100% Waterless & Scratch-Free</span>
          </div>
        </div>

        {/* Step Indicator Pills */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {[
            { num: 1, label: 'Location', icon: Building2 },
            { num: 2, label: 'Car Info', icon: Car },
            { num: 3, label: 'Package', icon: Sparkles },
            { num: 4, label: 'Schedule', icon: Calendar },
            { num: 5, label: 'Confirm', icon: CheckCircle },
          ].map((s) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <button
                key={s.num}
                onClick={() => {
                  if (s.num < step) setStep(s.num);
                }}
                disabled={s.num > step}
                className={`flex items-center justify-center sm:justify-start gap-2 p-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : isDone
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 hover:bg-cyan-900/40'
                    : 'bg-slate-950 text-slate-500 border border-slate-800/80 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                    isActive
                      ? 'bg-slate-950 text-cyan-300'
                      : isDone
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3" /> : s.num}
                </div>
                <span className="hidden sm:inline truncate">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Step Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        
        {/* STEP 1: Apartment Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                1. Select Serviced Apartment Complex
              </label>
              <p className="text-xs text-slate-400 mb-4">
                We currently deploy dedicated detailing teams directly to these partner complexes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {apartments.map((apt) => {
                  const isSelected = apartmentId === apt.id;
                  return (
                    <div
                      key={apt.id}
                      onClick={() => {
                        setApartmentId(apt.id);
                        onSelectApartment(apt);
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg ring-1 ring-cyan-500/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-lg shrink-0 ${isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-white">{apt.name}</h3>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-cyan-400" />
                              {apt.area} • {apt.totalBlocks} Towers/Blocks
                            </p>
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Assigned Lead: <strong className="text-slate-200">{apt.assignedTechnician || 'Doorstep Tech'}</strong></span>
                        <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                          Serviced Daily
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                2. Enter Your Specific Tower, Block & Parking Spot
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={blockAndSlot}
                  onChange={(e) => setBlockAndSlot(e.target.value)}
                  placeholder="e.g., Tower B - Basement Level 2, Slot #B2-45"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Our technician will locate your parked car at this exact spot without bothering you.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: Car Information */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                1. Select Vehicle Body Type
              </label>
              <p className="text-xs text-slate-400 mb-4">
                Service pricing varies slightly according to vehicle surface area.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { type: 'hatchback' as const, label: 'Hatchback', desc: 'Mini / Compact', icon: Car },
                  { type: 'sedan' as const, label: 'Sedan / Coupe', desc: 'Standard 4-Door', icon: Car },
                  { type: 'suv' as const, label: 'SUV / Crossover', desc: 'Mid & Full Size', icon: Car },
                  { type: 'luxury' as const, label: 'Luxury / Pickup', desc: 'Truck / Premium', icon: Award },
                ].map((item) => {
                  const isSelected = vehicleType === item.type;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.type}
                      onClick={() => setVehicleType(item.type)}
                      className={`p-4 rounded-xl border cursor-pointer text-center transition-all ${
                        isSelected
                          ? 'bg-cyan-950/50 border-cyan-500 text-white shadow-lg ring-1 ring-cyan-500/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-2 ${isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-sm text-white">{item.label}</p>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Make & Model
                </label>
                <input
                  type="text"
                  value={makeModel}
                  onChange={(e) => setMakeModel(e.target.value)}
                  placeholder="e.g. Honda Civic or Tesla Y"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  License Plate #
                </label>
                <input
                  type="text"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                  placeholder="e.g. ABC-1234"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono tracking-wider uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Vehicle Exterior Color
                </label>
                <input
                  type="text"
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  placeholder="e.g. Pearl White, Black"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Wash Package Selection */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Doorstep Wash Package
              </label>
              <span className="text-xs text-cyan-400">
                Prices customized for <strong className="capitalize">{vehicleType}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((srv) => {
                const isSelected = selectedServiceId === srv.id;
                const price = srv.priceByVehicle[vehicleType];
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-xl ring-1 ring-cyan-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    {srv.popular && (
                      <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                        {srv.tag || 'Most Popular'}
                      </span>
                    )}

                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-base text-white">{srv.name}</h3>
                        <div className="text-right shrink-0">
                          <span className="text-xl font-extrabold text-cyan-400">${price}</span>
                          <span className="text-[10px] text-slate-400 block">estimated</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mb-3">{srv.shortDesc}</p>

                      <div className="space-y-1.5 mb-4">
                        {srv.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                            <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        ~{srv.durationMinutes} mins
                      </span>
                      <span className={`font-semibold ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`}>
                        {isSelected ? '✓ Selected' : 'Select Package'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Date & Time Slot Selection */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                1. Select Wash Date
              </label>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Today', date: todayStr, sub: 'Immediate Slot' },
                  { label: 'Tomorrow', date: tomorrowStr, sub: 'Recommended' },
                  { label: 'Day After', date: dayAfterStr, sub: 'Flexible' },
                ].map((d) => {
                  const isSelected = bookingDate === d.date;
                  return (
                    <button
                      type="button"
                      key={d.date}
                      onClick={() => setBookingDate(d.date)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-500 text-white font-semibold ring-1 ring-cyan-500/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <p className="text-xs font-bold text-white">{d.label}</p>
                      <p className="text-[11px] text-cyan-400 my-0.5">{d.date}</p>
                      <p className="text-[10px] text-slate-500">{d.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                2. Select Preferred Time Slot at {currentApartment.name}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map((slot) => {
                  const isSelected = selectedSlot === slot.time;
                  return (
                    <button
                      type="button"
                      key={slot.id}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                        !slot.available
                          ? 'bg-slate-950/40 border-slate-800/60 opacity-40 cursor-not-allowed text-slate-600'
                          : isSelected
                          ? 'bg-cyan-950/60 border-cyan-500 text-white ring-1 ring-cyan-500/30'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-semibold block">{slot.time}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{slot.period}</span>
                      </div>
                      {isSelected ? (
                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                      ) : !slot.available ? (
                        <span className="text-[9px] uppercase font-bold text-red-400">Full</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Checkout */}
        {step === 5 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Booking Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500 block">Service Package:</span>
                  <span className="font-semibold text-white">{currentService.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location / Apartment:</span>
                  <span className="font-semibold text-white">{currentApartment.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Exact Parking Slot:</span>
                  <span className="font-semibold text-cyan-300">{blockAndSlot}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Scheduled Date & Time:</span>
                  <span className="font-semibold text-cyan-300">{bookingDate} @ {selectedSlot}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Vehicle Details:</span>
                  <span className="font-semibold text-white">{makeModel} ({vehicleColor}) • <span className="font-mono">{licensePlate}</span></span>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Amount:</span>
                  <span className="text-lg font-extrabold text-cyan-400">${calculatedPrice}</span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'card' as const, label: 'Credit/Debit Card', desc: 'Pay online securely' },
                  { id: 'cash_on_wash' as const, label: 'Pay on Wash', desc: 'Pay tech after inspection' },
                  { id: 'upi' as const, label: 'Instant UPI / Wallet', desc: 'Instant 1-click pay' },
                ].map((pm) => (
                  <button
                    type="button"
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === pm.id
                        ? 'bg-cyan-950/60 border-cyan-500 text-white ring-1 ring-cyan-500/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{pm.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{pm.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Special Instructions for Wash Technician (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Car is unlocked or key is with security guard..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Confirm & Lock Doorstep Wash (${calculatedPrice})</span>
            </button>
          </form>
        )}

        {/* Wizard Footer Controls */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              step === 1
                ? 'opacity-30 cursor-not-allowed text-slate-600'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {step < 5 && (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <span>Continue to Step {step + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
