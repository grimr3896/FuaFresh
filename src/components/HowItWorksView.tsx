import React from 'react';
import { Page } from '../types';
import { CalendarCheck, Car, Sparkles, Smile, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface HowItWorksViewProps {
  onNavigate: (page: Page) => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onNavigate }) => {
  const faqs = [
    {
      q: 'Do I ever need to drop off or pick up anything?',
      a: 'Never. Our core pledge is "We Come To You." Every service—from machine laundry and line drying to full deep sanitization—is conducted exclusively inside your residence.'
    },
    {
      q: 'Do I need to supply cleaning tools or detergents?',
      a: 'Our professionals arrive with their own caddy of specialized microfiber cloths, hospital-grade eco detergents, floor cleaners, and surface sanitizers. If you have personal preference detergents or washing machines for laundry, our team gladly works with your setups.'
    },
    {
      q: 'How are Fua Fresh professionals vetted?',
      a: 'Every single professional holds an authentic Certificate of Good Conduct from the Kenyan Directorate of Criminal Investigations (DCI), undergoes residential background checks, and receives hands-on hospitality training.'
    },
    {
      q: 'How does M-Pesa payment work?',
      a: 'When you finalize your booking, an instant Safaricom STK prompt is sent directly to your phone. You simply enter your PIN. Funds are safely processed with clear digital receipts.'
    }
  ];

  return (
    <div className="pt-28 pb-24 bg-gradient-to-b from-[#F0F7FF] via-[#F8FAFC] to-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-[#14B8A6] uppercase tracking-wider">
            <span>The In-Home Experience</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            How Fua Fresh Works
          </h1>
          <p className="text-base text-slate-600 font-normal">
            A seamless, stress-free at-home service built specifically for Nairobi and Kenyan homeowners.
          </p>
        </div>

        {/* 4 Steps In-Depth */}
        <div className="space-y-8 mb-20">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center shrink-0 font-bold text-xl">
              01
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-xl font-bold text-[#0B1F4B]">
                Book Online in Seconds
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose your needed service (Home Cleaning, Laundry, Deep Cleaning, Ironing, or Custom). Specify your home size and any special requests like stove degreasing or baby-safe detergents. Pick a time window that fits your schedule.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-teal-200/80 shadow-md ring-2 ring-teal-500/10 flex flex-col md:flex-row items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#14B8A6] flex items-center justify-center shrink-0 font-bold text-xl">
              02
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#0B1F4B]">
                  We Come To You
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wide bg-teal-100 text-[#14B8A6] px-2 py-0.5 rounded-full">
                  Core Promise
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                A verified professional wearing our crisp royal-blue uniform arrives punctually at your door carrying all sanitized tools, solutions, and gear. You can track their real-time dispatch right in your Fua Fresh dashboard.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 font-bold text-xl">
              03
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-xl font-bold text-[#0B1F4B]">
                We Clean & Care On-Site
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every task is carried out inside your living area or balcony. If you booked laundry, garments are sorted, hand-washed or machine-cycled, air-hung on your lines or balcony racks, and folded neatly into your wardrobe. No mixed loads, no lost clothes.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#FF6B5E] flex items-center justify-center shrink-0 font-bold text-xl">
              04
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-xl font-bold text-[#0B1F4B]">
                Relax & Settle via M-Pesa
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Take a walkthrough of your freshly sanitized rooms or examine your crisp, folded clothes. Once completely satisfied, celebrate your renewed home sanctuary. Pay easily with instant M-Pesa.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-md space-y-8 mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#0B1F4B]">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                <h4 className="text-sm font-bold text-[#0B1F4B]">
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('booking')}
            className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-base font-bold py-4 px-9 rounded-2xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <span>Ready for Freshness? Book Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
