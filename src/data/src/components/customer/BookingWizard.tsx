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
  IndianRupee,
  Info,
  Droplets,
  Award,
  QrCode,
  Search,
  PlusCircle,
  X,
  Send
} from 'lucide-react';
import {
  ApartmentComplex,
  ServicePackage,
  TimeSlot,
  VehicleType,
  Booking
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
  const [blockAndSlot, setBlockAndSlot] = useState<string>('Tower 12 - Basement Slot #B2-104');
  
  // Step 1 Apartment Search & Request State
  const [apartmentSearchQuery, setApartmentSearchQuery] = useState<string>('');
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [reqAptName, setReqAptName] = useState<string>('');
  const [reqAptArea, setReqAptArea] = useState<string>('');
  const [reqPhone, setReqPhone] = useState<string>('+91 ');
  const [reqSubmitted, setReqSubmitted] = useState<boolean>(false);

  const [vehicleType, setVehicleType] = useState<VehicleType>('sedan');
  const [makeModel, setMakeModel] = useState<string>('Hyundai Verna');
  const [licensePlate, setLicensePlate] = useState<string>('KA-03-MP-4521');
  const [vehicleColor, setVehicleColor] = useState<string>('Starry Night Black');

  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[1]?.id || services[0].id);
  
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>(timeSlots[1]?.time || timeSlots[0].time);

  const [customerName, setCustomerName] = useState<string>('Priya Sharma');
  const [customerPhone, setCustomerPhone] = useState<string>('+91 98123 45678');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_wash' | 'card' | 'upi'>('upi');
  const [notes, setNotes] = useState<string>('Keys left with basement security guard or call me.');

  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  // Derived current service package
  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const calculatedPrice = currentService.priceByVehicle[vehicleType];

  const currentApartment = apartments.find((a) => a.id === apartmentId) || selectedApartment;

  // Filtered apartments list
  const filteredApartments = apartments.filter((apt) => {
    const q = apartmentSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      apt.name.toLowerCase().includes(q) ||
      apt.area.toLowerCase().includes(q) ||
      apt.address.toLowerCase().includes(q) ||
      apt.assignedTechnician.toLowerCase().includes(q)
    );
  });

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBookingData = {
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
      paymentStatus: (paymentMethod === 'upi' || paymentMethod === 'card') ? 'paid' as const : 'pending' as const,
      status: 'pending' as const,
      notes,
    };

    onCompleteBooking(newBookingData);
    setCreatedBookingId(`WASH-${Math.floor(1000 + Math.random() * 9000)}`);
    setStep(5); // Confirmation Screen
  };

  return (
    <div className="max-w-4xl mx-auto my-6 px-4 space-y-6">
      
      {/* Step Indicator Top Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="font-bold text-cyan-400 uppercase tracking-wider">
            Step {step} of 5
          </span>
          <span className="font-semibold text-slate-300">
            {step === 1 && 'Select Bangalore Apartment & Slot'}
            {step === 2 && 'Car Details & Body Type'}
            {step === 3 && 'Choose Detailing Package'}
            {step === 4 && 'Date, Time & UPI Payment'}
            {step === 5 && 'Order Scheduled & Confirmed!'}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[
            { s: 1, label: 'Location' },
            { s: 2, label: 'Car Info' },
            { s: 3, label: 'Package' },
            { s: 4, label: 'Schedule' },
            { s: 5, label: 'Confirm' },
          ].map((item) => (
            <div key={item.s} className="space-y-1">
              <div
                className={`h-2 rounded-full transition-all ${
                  step >= item.s ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-slate-800'
                }`}
              />
              <span
                className={`text-[10px] font-semibold block text-center truncate ${
                  step >= item.s ? 'text-cyan-300' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
        
        {/* STEP 1: APARTMENT COMPLEX & PARKING SLOT */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <span>1. Select Serviced Bangalore Apartment Complex</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                We currently deploy dedicated waterless detailing crews directly to these partner complexes.
              </p>
            </div>

            {/* Sticky Apartment Search Bar */}
            <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md pb-2 pt-1">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search apartment name, zone (e.g. Whitefield, Bellandur), or address..."
                  value={apartmentSearchQuery}
                  onChange={(e) => setApartmentSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all shadow-inner"
                />
                {apartmentSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setApartmentSearchQuery('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Apartment List */}
            {filteredApartments.length === 0 ? (
              <div className="text-center py-8 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3 p-4">
                <Building2 className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-300">
                  No serviced complexes found matching <strong className="text-cyan-400">"{apartmentSearchQuery}"</strong>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setReqAptName(apartmentSearchQuery);
                    setShowRequestModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-cyan-400" />
                  <span>Request AquaDoor for "{apartmentSearchQuery}"</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredApartments.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => {
                      setApartmentId(apt.id);
                      onSelectApartment(apt);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      apartmentId === apt.id
                        ? 'bg-cyan-500/10 border-cyan-500 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-white">{apt.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          <span>{apt.area} • {apt.totalBlocks} Towers</span>
                        </p>
                      </div>
                      {apartmentId === apt.id && (
                        <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />
                      )}
                    </div>
                    <div className="mt-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span>Assigned Lead: <strong className="text-slate-200">{apt.assignedTechnician}</strong></span>
                      <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">Serviced Daily</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Fallback Card: Request My Apartment */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Don't see your complex?</h4>
                  <p className="text-[11px] text-slate-400">Request AquaDoor doorstep detailing for your society association.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRequestModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-cyan-500/30 hover:border-cyan-500/60 transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Request My Apartment</span>
              </button>
            </div>

            {/* Parking Slot Detail Input */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                Enter Your Exact Parking Slot & Tower / Block Number:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tower 12 - Basement Slot #B2-104"
                value={blockAndSlot}
                onChange={(e) => setBlockAndSlot(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-400 italic">
                Our detailer uses this location to locate your vehicle in the basement/covered parking slot.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Vehicle Info</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: VEHICLE TYPE & DETAILS */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-cyan-400" />
                <span>2. Vehicle Body Type & Car Details</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Pricing scales with vehicle size to ensure full coverage and dedicated attention.
              </p>
            </div>

            {/* Body Type Selection Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { type: 'hatchback' as const, title: 'Hatchback', desc: 'Swift, i20, Altroz' },
                { type: 'sedan' as const, title: 'Sedan', desc: 'City, Verna, Virtus' },
                { type: 'suv' as const, title: 'SUV / Crossover', desc: 'Harrier, Creta, Nexon' },
                { type: 'luxury' as const, title: 'Luxury Class', desc: 'BMW, Audi, Mercedes' },
              ].map((v) => (
                <div
                  key={v.type}
                  onClick={() => setVehicleType(v.type)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all text-center ${
                    vehicleType === v.type
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <h3 className="font-bold text-xs text-white mb-0.5">{v.title}</h3>
                  <p className="text-[10px] text-slate-400">{v.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Vehicle Make & Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Harrier Dark Edition"
                  value={makeModel}
                  onChange={(e) => setMakeModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">License Plate Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KA-03-MP-4521"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white uppercase focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Vehicle Color</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oberon Black"
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Select Wash Package</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: WASH PACKAGE SELECTION (INR PRICING) */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>3. Choose Doorstep Detailing Package</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Prices for selected body type: <strong className="text-cyan-300 capitalize">{vehicleType}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv) => {
                const price = srv.priceByVehicle[vehicleType];
                const isSelected = selectedServiceId === srv.id;

                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-base text-white">{srv.name}</h3>
                        <span className="text-xl font-extrabold text-cyan-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 shrink-0">
                          ₹{price}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mb-3">{srv.shortDesc}</p>

                      <div className="space-y-1">
                        {srv.features.slice(0, 3).map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{srv.durationMinutes} mins slot duration</span>
                      {isSelected ? (
                        <span className="text-cyan-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Selected
                        </span>
                      ) : (
                        <span className="text-slate-500">Click to Select</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Schedule Date & Time</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DATE, TIME & UPI PAYMENT */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>4. Date, Time Slot & UPI Payment</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select your preferred wash window for {currentApartment.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Select Wash Date</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Customer Phone (+91 Bangalore)</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">Select Time Window:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                      selectedSlot === slot.time
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : slot.available
                        ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        : 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Options (UPI / Card / Cash) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-300 block">Payment Method:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-400 mb-1" />
                  <span className="text-xs font-bold block">UPI / GPay</span>
                  <span className="text-[10px] opacity-70 block">Instant QR Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_wash')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'cash_on_wash'
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <IndianRupee className="w-4 h-4 text-cyan-400 mb-1" />
                  <span className="text-xs font-bold block">Pay on Wash</span>
                  <span className="text-[10px] opacity-70 block">Pay after completion</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 text-blue-400 mb-1" />
                  <span className="text-xs font-bold block">Card / NetBanking</span>
                  <span className="text-[10px] opacity-70 block">Online Gateway</span>
                </button>
              </div>
            </div>

            {/* Total Summary Bar */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 p-4 rounded-xl border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Total Wash Fee</span>
                <span className="text-2xl font-extrabold text-cyan-400">₹{calculatedPrice}</span>
              </div>
              <p className="text-xs text-slate-300 text-right">
                100% Scratch-Free Waterless Detailing • {currentService.name}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Confirm & Schedule Wash (₹{calculatedPrice})</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: CONFIRMATION SUCCESS SCREEN */}
        {step === 5 && (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                Order Reference: {createdBookingId}
              </span>
              <h2 className="text-2xl font-bold text-white mt-3">Doorstep Wash Scheduled!</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                Our lead technician at <strong className="text-white">{currentApartment.name}</strong> will arrive at your slot on <strong className="text-cyan-300">{bookingDate} ({selectedSlot})</strong>.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-w-sm mx-auto text-left text-xs space-y-1.5 text-slate-300">
              <p>📍 Location: <strong className="text-white">{currentApartment.name} ({blockAndSlot})</strong></p>
              <p>🚘 Vehicle: <strong className="text-white">{makeModel} ({licensePlate})</strong></p>
              <p>✨ Service: <strong className="text-cyan-400">{currentService.name}</strong></p>
              <p>💰 Price: <strong className="text-emerald-400">₹{calculatedPrice}</strong> ({paymentMethod.toUpperCase()})</p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={onViewBookings}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                View My Washes
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Request My Apartment Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100 relative">
            <button
              type="button"
              onClick={() => {
                setShowRequestModal(false);
                setReqSubmitted(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {!reqSubmitted ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">Request AquaDoor for Your Society</h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  We expand based on resident requests! Submit your complex details and our operations team will contact your association.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setReqSubmitted(true);
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Apartment / Society Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mantri Tranquil or Prestige Lakeside"
                      value={reqAptName}
                      onChange={(e) => setReqAptName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Area / Locality in Bangalore</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kanakapura Road, Sarjapur, Hebbal"
                      value={reqAptArea}
                      onChange={(e) => setReqAptArea(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Your Contact Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98123 45678"
                      value={reqPhone}
                      onChange={(e) => setReqPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRequestModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Request</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Society Expansion Request Sent!</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                  Thank you! Our Bangalore operations lead will review <strong className="text-cyan-300">{reqAptName || 'your apartment'}</strong> and get in touch with your RWA/Management.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestModal(false);
                    setReqSubmitted(false);
                    setReqAptName('');
                    setReqAptArea('');
                  }}
                  className="mt-2 px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
