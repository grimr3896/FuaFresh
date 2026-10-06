import React from 'react';
import { Page } from '../types';
import { Star, ShieldCheck, Home, Smartphone, Check, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import heroImg from '../assets/images/fua_hero_arrival_1791328974880.jpg';

interface HeroSectionProps {
  onNavigate: (page: Page) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative min-h-[92vh] lg:min-h-screen pt-28 sm:pt-32 pb-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#F0F7FF] via-[#F8FAFC] to-white flex items-center">
      {/* Soft blurred background ambient blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Blue blob top-left */}
        <div className="absolute -top-24 -left-24 w-96 h-96 sm:w-[520px] sm:h-[520px] rounded-full bg-[#7DD3FC]/25 blur-3xl animate-float-slow" />
        {/* Aqua blob top-right */}
        <div
          className="absolute top-12 -right-20 w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full bg-[#14B8A6]/18 blur-3xl animate-float-gentle"
          style={{ animationDelay: '-2s' }}
        />
        {/* Soft Lavender blob center-bottom */}
        <div
          className="absolute -bottom-20 left-1/3 w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full bg-[#A78BFA]/18 blur-3xl animate-float-slow"
          style={{ animationDelay: '-4s' }}
        />
        {/* Royal Blue subtle blob center */}
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-[#3B82F6]/10 blur-3xl" />

        {/* Floating subtle ambient bubbles */}
        <div className="absolute top-36 left-12 w-4 h-4 rounded-full bg-[#3B82F6]/30 animate-bubble" />
        <div
          className="absolute top-52 right-1/4 w-6 h-6 rounded-full bg-[#14B8A6]/25 animate-bubble"
          style={{ animationDelay: '2.5s' }}
        />
        <div
          className="absolute bottom-40 left-1/4 w-5 h-5 rounded-full bg-[#A78BFA]/30 animate-bubble"
          style={{ animationDelay: '1.2s' }}
        />
        <div
          className="absolute top-80 right-12 w-3 h-3 rounded-full bg-[#7DD3FC]/40 animate-bubble"
          style={{ animationDelay: '3.8s' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Small pill label (400ms entrance) */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-blue-200/80 shadow-xs backdrop-blur-sm transition-fua duration-500 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDuration: '400ms' }}
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14B8A6]"></span>
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#0B1F4B]">
                At-Home Cleaning & Laundry, Kenya
              </span>
            </div>

            {/* Huge bold headline (600ms entrance) */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold tracking-tight text-[#0B1F4B] leading-[1.08] transition-fua animate-in fade-in slide-in-from-bottom-3"
              style={{ animationDuration: '600ms', textWrap: 'balance' }}
            >
              Freshness{' '}
              <span className="bg-gradient-to-r from-[#1D4ED8] via-[#3B82F6] to-[#14B8A6] bg-clip-text text-transparent">
                Comes to You.
              </span>
            </h1>

            {/* Subtext (700ms entrance) */}
            <p
              className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed transition-fua animate-in fade-in slide-in-from-bottom-3"
              style={{ animationDuration: '700ms' }}
            >
              Professional cleaning and laundry performed right inside your home. Book a trusted Fua Fresh professional and relax while we take care of the rest.
            </p>

            {/* Action Buttons (800ms entrance) */}
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1 transition-fua animate-in fade-in slide-in-from-bottom-3"
              style={{ animationDuration: '800ms' }}
            >
              <button
                onClick={() => onNavigate('booking')}
                className="group inline-flex items-center justify-center gap-2.5 bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-base font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transition-all duration-200 cursor-pointer text-center"
              >
                <span>Book a Service</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <button
                onClick={() => onNavigate('services')}
                className="inline-flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-[#0B1F4B] hover:text-[#1D4ED8] border border-slate-300 hover:border-blue-400 text-base font-semibold px-7 py-4 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transition-all duration-200 cursor-pointer text-center backdrop-blur-xs"
              >
                Explore Services
              </button>
            </div>

            {/* Trust Proof: Overlapping Avatars + 5 amber stars + text */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex -space-x-3 overflow-hidden p-0.5">
                <img
                  className="inline-block h-11 w-11 rounded-full ring-2 ring-white object-cover shadow-xs"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Happy homeowner in Kilimani"
                  referrerPolicy="no-referrer"
                />
                <img
                  className="inline-block h-11 w-11 rounded-full ring-2 ring-white object-cover shadow-xs"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Homeowner in Westlands"
                  referrerPolicy="no-referrer"
                />
                <img
                  className="inline-block h-11 w-11 rounded-full ring-2 ring-white object-cover shadow-xs"
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                  alt="Resident in Karen"
                  referrerPolicy="no-referrer"
                />
                <img
                  className="inline-block h-11 w-11 rounded-full ring-2 ring-white object-cover shadow-xs"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Resident in Kileleshwa"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]"
                    />
                  ))}
                  <span className="text-xs font-bold text-[#0B1F4B] ml-1.5">
                    5.0 / 5
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-slate-500 font-medium">
                  Trusted by happy homes
                </span>
              </div>
            </div>

            {/* Bold Promise Line */}
            <div className="pt-2 border-t border-blue-100/80">
              <p className="text-xs sm:text-sm font-extrabold tracking-wider text-[#0B1F4B] uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
                <span>NO DROP-OFF. NO PICKUP. WE COME TO YOU.</span>
              </p>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (SHOWPIECE VISUAL) ================= */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Soft gradient ring behind the visual (blue to aqua to lavender) */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 sm:-inset-6 rounded-[36px] lg:rounded-[44px] bg-gradient-to-tr from-[#1D4ED8]/25 via-[#14B8A6]/25 to-[#A78BFA]/30 blur-xl opacity-80"
            />

            {/* Main Visual Container */}
            <div
              className="relative w-full max-w-[460px] sm:max-w-[500px] lg:max-w-none rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-white/80 shadow-2xl shadow-blue-900/15 bg-white transition-fua animate-in zoom-in-95 duration-700"
              style={{ animationDuration: '900ms' }}
            >
              {/* Photo Frame */}
              <div className="relative aspect-[4/3] sm:aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img
                  src={heroImg}
                  alt="Smiling Fua Fresh professional arriving at a bright modern Kenyan home with cleaning equipment and laundry basket"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                {/* Subtle bottom gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F4B]/60 via-transparent to-black/10 pointer-events-none" />

                {/* Overlaid Kenyan location pill */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-xs text-xs font-semibold text-[#0B1F4B]">
                  <MapPin className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  <span>Kilimani, Nairobi</span>
                </div>

                {/* Professional caption */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-medium text-blue-200">
                    On-Site Service · In-Home Care
                  </p>
                  <p className="text-sm font-semibold text-white drop-shadow-xs">
                    Faith arriving with specialized eco-cleaning gear
                  </p>
                </div>
              </div>
            </div>

            {/* ================= FLOATING GLASS-STYLE CARDS ================= */}
            {/* Card 1: Vetted Professionals (Blue) */}
            <div
              className="absolute -top-4 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border border-blue-100 flex items-center gap-2.5 z-20 animate-float-gentle"
              style={{ animationDuration: '7s' }}
            >
              <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center font-bold">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0B1F4B]">
                  Vetted Professionals
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Background checked
                </p>
              </div>
            </div>

            {/* Card 2: At-Home Service (Aqua) */}
            <div
              className="absolute top-1/3 -right-3 sm:-right-8 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border border-teal-100 flex items-center gap-2.5 z-20 animate-float-slow"
              style={{ animationDuration: '8s', animationDelay: '-1.5s' }}
            >
              <div className="w-7 h-7 rounded-xl bg-teal-50 text-[#14B8A6] flex items-center justify-center font-bold">
                <Home className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0B1F4B]">
                  At-Home Service
                </p>
                <p className="text-[10px] text-[#14B8A6] font-semibold">
                  Zero travel for you
                </p>
              </div>
            </div>

            {/* Card 3: Easy M-Pesa Payment (Coral Accent) */}
            <div
              className="absolute -bottom-4 -left-2 sm:-left-6 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border border-rose-100 flex items-center gap-2.5 z-20 animate-float-gentle"
              style={{ animationDuration: '6.5s', animationDelay: '-3s' }}
            >
              <div className="w-7 h-7 rounded-xl bg-rose-50 text-[#FF6B5E] flex items-center justify-center font-bold">
                <Smartphone className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0B1F4B]">
                  Easy M-Pesa Payment
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Instant STK prompt
                </p>
              </div>
            </div>

            {/* Card 4: Live Card ("Your professional is on the way" with pulsing green dot) */}
            <div
              className="absolute -bottom-8 right-2 sm:right-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-30 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-[260px]"
              style={{ animationDelay: '1000ms' }}
            >
              <div className="relative flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 relative" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#0B1F4B] truncate">
                  Your professional is on the way
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  ETA: 14 mins · Westlands
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider at bottom flowing smoothly into the next section */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10 pointer-events-none">
        <svg
          className="relative block w-full h-8 sm:h-12 lg:h-16 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,0 C150,95 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
};
