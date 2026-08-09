import React, { useState } from 'react';
import {
  Sparkles,
  Droplets,
  Shield,
  Clock,
  Check,
  Award,
  ChevronRight,
  Leaf,
  ThumbsUp,
  Car,
  IndianRupee
} from 'lucide-react';
import { ServicePackage, VehicleType } from '../../types';

interface ServicesCatalogProps {
  services: ServicePackage[];
  onBookService: (serviceId: string) => void;
}

export const ServicesCatalog: React.FC<ServicesCatalogProps> = ({
  services,
  onBookService,
}) => {
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>('sedan');

  return (
    <div className="max-w-6xl mx-auto my-6 px-4 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 mb-3">
            <Leaf className="w-3.5 h-3.5 text-cyan-400" />
            <span>Eco Waterless Detailing at Bangalore Apartment Parking Slots</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            Professional Car Care While You Sleep or Work
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Our certified doorstep detailers bring specialized scratch-free foam, high-grade microfibers, and mobile steam units straight to your apartment parking bay across Bangalore.
          </p>

          {/* Body Type Selector Pill */}
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 inline-flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold px-2">Select Vehicle Type:</span>
            {[
              { type: 'hatchback' as const, label: 'Hatchback (Swift, i20)' },
              { type: 'sedan' as const, label: 'Sedan (City, Verna)' },
              { type: 'suv' as const, label: 'SUV (Harrier, Creta)' },
              { type: 'luxury' as const, label: 'Luxury (BMW, Audi)' },
            ].map((v) => (
              <button
                key={v.type}
                onClick={() => setSelectedVehicleType(v.type)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedVehicleType === v.type
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((srv) => {
          const price = srv.priceByVehicle[selectedVehicleType];
          return (
            <div
              key={srv.id}
              className={`bg-slate-900 border rounded-2xl p-6 transition-all flex flex-col justify-between shadow-xl relative ${
                srv.popular
                  ? 'border-cyan-500/60 ring-1 ring-cyan-500/20 bg-slate-900/90'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {srv.tag && (
                <span className="absolute -top-3 right-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                  {srv.tag}
                </span>
              )}

              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-lg font-bold text-white">{srv.name}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{srv.shortDesc}</p>
                  </div>
                  <div className="text-right shrink-0 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-2xl font-extrabold text-cyan-400">₹{price}</span>
                    <span className="text-[10px] text-slate-400 block capitalize">{selectedVehicleType}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed">{srv.description}</p>

                <div className="space-y-2 mb-6">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Service Highlights:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {srv.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{srv.durationMinutes} mins estimated time</span>
                </div>

                <button
                  onClick={() => onBookService(srv.id)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Book for ₹{price}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
