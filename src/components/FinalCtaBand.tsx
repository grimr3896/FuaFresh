import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface FinalCtaBandProps {
  onBookClick: () => void;
}

export const FinalCtaBand: React.FC<FinalCtaBandProps> = ({ onBookClick }) => {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-r from-[#0B1F4B] via-[#112D6E] to-[#1D4ED8] text-white">
      {/* Animated bubbles and glow elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-12 left-10 w-8 h-8 rounded-full bg-cyan-400/20 animate-bubble" />
        <div
          className="absolute bottom-16 left-1/4 w-12 h-12 rounded-full bg-blue-300/15 animate-bubble"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute top-20 right-1/4 w-6 h-6 rounded-full bg-teal-300/20 animate-bubble"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="absolute bottom-12 right-12 w-10 h-10 rounded-full bg-indigo-300/20 animate-bubble"
          style={{ animationDelay: '4s' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold tracking-wide text-blue-200 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#7DD3FC]" />
          <span>We Come To You · Nairobi & Environs</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Your Home Deserves a Fresh Start.
        </h2>

        <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-normal">
          Book professional cleaning and laundry services without leaving your home. Relax while our verified team brings spotless perfection inside.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onBookClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-[#0B1F4B] hover:bg-blue-50 text-base font-bold px-9 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 cursor-pointer"
          >
            <span>Book a Service</span>
            <ArrowRight className="w-5 h-5 text-[#1D4ED8]" />
          </button>
        </div>

        <div className="pt-4 flex items-center justify-center gap-6 text-xs text-blue-200/90 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#14B8A6]" />
            Police-vetted staff
          </span>
          <span>·</span>
          <span>No drop-off, no pickup</span>
          <span>·</span>
          <span>Safaricom M-Pesa verified</span>
        </div>
      </div>
    </section>
  );
};
