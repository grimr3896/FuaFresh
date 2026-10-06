import React, { useState } from 'react';
import { Page, ServiceType } from '../types';
import { PRICING_TIERS, SERVICES } from '../data';
import { Check, ArrowRight, Calculator, Smartphone } from 'lucide-react';

interface PricingViewProps {
  onNavigate: (page: Page) => void;
  onSelectServiceAndBook: (serviceId: ServiceType) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  onNavigate,
  onSelectServiceAndBook
}) => {
  const [selectedService, setSelectedService] = useState<ServiceType>('home-cleaning');
  const [bedrooms, setBedrooms] = useState(2);
  const [includeLaundry, setIncludeLaundry] = useState(true);
  const [includeOvenDegrease, setIncludeOvenDegrease] = useState(false);
  const [includeBalcony, setIncludeBalcony] = useState(true);

  // Calculate live estimate
  const baseRates: Record<ServiceType, number> = {
    'home-cleaning': 2000,
    'laundry': 1800,
    'deep-cleaning': 4200,
    'ironing': 1500,
    'custom': 3000
  };

  const roomMultiplier = bedrooms === 1 ? 0.85 : bedrooms === 2 ? 1.0 : bedrooms === 3 ? 1.3 : 1.6;
  let estimatedTotal = Math.round(baseRates[selectedService] * roomMultiplier);
  if (includeLaundry && selectedService !== 'laundry') estimatedTotal += 1200;
  if (includeOvenDegrease) estimatedTotal += 600;
  if (includeBalcony) estimatedTotal += 500;

  return (
    <div className="pt-28 pb-24 bg-gradient-to-b from-[#F0F7FF] via-[#F8FAFC] to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#1D4ED8] uppercase tracking-wider">
            <span>No Hidden Costs</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            Transparent Pricing Calculator
          </h1>
          <p className="text-base text-slate-600 font-normal">
            Configure your exact residence parameters to preview transparent rates before booking.
          </p>
        </div>

        {/* Live Interactive Pricing Estimator */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-blue-200/80 shadow-xl max-w-4xl mx-auto mb-20">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0B1F4B]">
                Interactive Rate Estimator
              </h2>
              <p className="text-xs text-slate-500">
                Adjust home dimensions and preferences to see live estimate
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Controls */}
            <div className="space-y-6">
              {/* Service Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                  Select Primary Service
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value as ServiceType)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-[#0B1F4B] focus:outline-none focus:border-[#1D4ED8]"
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.startingPrice})
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms range */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#0B1F4B]">
                  <span>Number of Bedrooms:</span>
                  <span className="text-[#1D4ED8]">{bedrooms === 4 ? '4+ BR Villa' : `${bedrooms} BR`}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full accent-[#1D4ED8] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1 BR</span>
                  <span>2 BR</span>
                  <span>3 BR</span>
                  <span>4+ BR</span>
                </div>
              </div>

              {/* Checkbox add-ons */}
              <div className="space-y-2.5 pt-2">
                <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                  Optional Add-ons
                </label>
                {selectedService !== 'laundry' && (
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeLaundry}
                      onChange={(e) => setIncludeLaundry(e.target.checked)}
                      className="accent-[#1D4ED8] rounded w-4 h-4"
                    />
                    <span>Add In-Home Laundry & Line Dry (+KES 1,200)</span>
                  </label>
                )}
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeOvenDegrease}
                    onChange={(e) => setIncludeOvenDegrease(e.target.checked)}
                    className="accent-[#1D4ED8] rounded w-4 h-4"
                  />
                  <span>Degrease Oven & Range Hood (+KES 600)</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBalcony}
                    onChange={(e) => setIncludeBalcony(e.target.checked)}
                    className="accent-[#1D4ED8] rounded w-4 h-4"
                  />
                  <span>Balcony Floor Scrub (+KES 500)</span>
                </label>
              </div>
            </div>

            {/* Live Pricing Preview Panel */}
            <div className="bg-gradient-to-br from-[#0B1F4B] to-[#1D4ED8] text-white rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-xs font-bold text-blue-200 uppercase tracking-wider block">
                  Estimated In-Home Total
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-white mt-1 tabular-nums">
                  KES {estimatedTotal.toLocaleString()}
                </div>
                <p className="text-xs text-blue-200 mt-2">
                  Final price guaranteed upon inspection before payment.
                </p>
              </div>

              <div className="space-y-2 text-xs border-t border-white/20 pt-4 text-blue-100">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#14B8A6]" />
                  <span>Verified professional arrives at your door</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#14B8A6]" />
                  <span>Hospital-grade eco detergents included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#7DD3FC]" />
                  <span>Instant Safaricom M-Pesa STK push</span>
                </div>
              </div>

              <button
                onClick={() => onSelectServiceAndBook(selectedService)}
                className="w-full py-4 px-6 rounded-2xl bg-white text-[#0B1F4B] hover:bg-blue-50 text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-[0.98]"
              >
                <span>Book This Customized Estimate</span>
                <ArrowRight className="w-4 h-4 text-[#1D4ED8]" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Standard Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {PRICING_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
                tier.popular
                  ? 'border-[#1D4ED8] shadow-xl ring-2 ring-[#1D4ED8]/10'
                  : 'border-slate-200/80 shadow-sm'
              }`}
            >
              <div>
                <h3 className="text-xl font-bold text-[#0B1F4B] mb-2">
                  {tier.name}
                </h3>
                <p className="text-xs text-slate-500 mb-6 font-normal min-h-[36px]">
                  {tier.description}
                </p>

                <div className="mb-4 pb-4 border-b border-slate-100">
                  <span className="text-2xl font-extrabold text-[#0B1F4B] tabular-nums">
                    {tier.priceText}
                  </span>
                  <p className="text-xs text-slate-400 mt-1 italic font-medium">
                    {tier.note}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((item, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <div className="w-4 h-4 rounded-full bg-blue-50 text-[#1D4ED8] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onNavigate('booking')}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/30"
              >
                <span>Select Package</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
