import React from 'react';
import { PRICING_TIERS } from '../data';
import { Check, ArrowRight } from 'lucide-react';
import { Page } from '../types';

interface PricingSectionProps {
  onBookClick: () => void;
  onNavigate: (page: Page) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onBookClick }) => {
  return (
    <section className="py-24 bg-[#F8FAFC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#1D4ED8] uppercase tracking-wider">
            <span>Clear & Honest Rates</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            Transparent In-Home Pricing
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            No surprise add-ons. Final price is computed transparently when you select your room count and laundry preferences.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {PRICING_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className={`relative bg-white rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
                tier.popular
                  ? 'border-[#1D4ED8] shadow-xl ring-2 ring-[#1D4ED8]/10'
                  : 'border-slate-200/80 shadow-sm hover:shadow-lg'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1D4ED8] to-[#14B8A6] text-white text-xs font-extrabold py-1 px-4 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular Choice
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-[#0B1F4B] mb-2">
                  {tier.name}
                </h3>
                <p className="text-xs text-slate-500 mb-6 font-normal min-h-[36px]">
                  {tier.description}
                </p>

                {/* Price block */}
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B] tabular-nums">
                    {tier.priceText}
                  </span>
                  <p className="text-xs text-slate-400 mt-1 italic font-medium">
                    {tier.note}
                  </p>
                </div>

                {/* Feature checklist */}
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

              {/* Button */}
              <button
                onClick={onBookClick}
                className={`w-full py-3.5 px-6 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  tier.popular
                    ? 'bg-[#1D4ED8] hover:bg-[#1e40af] text-white shadow-md shadow-blue-600/30 active:scale-[0.98]'
                    : 'bg-slate-50 hover:bg-slate-100 text-[#0B1F4B] border border-slate-200 active:scale-[0.98]'
                }`}
              >
                <span>Select & Customize</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Note on M-Pesa escrow / post-inspection */}
        <div className="text-center text-xs text-slate-500 max-w-md mx-auto">
          Pay via Safaricom M-Pesa STK push. In-home satisfaction confirmed before payment settlement.
        </div>
      </div>
    </section>
  );
};
