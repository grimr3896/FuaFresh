import React, { useState } from 'react';
import { BookingData, Page, TrackerStage } from '../types';
import { PROFESSIONALS } from '../data';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Home,
  AlertCircle
} from 'lucide-react';

interface CustomerDashboardProps {
  currentBooking: BookingData | null;
  onNavigate: (page: Page) => void;
}

const TRACKER_STAGES: { id: TrackerStage; label: string; desc: string }[] = [
  { id: 'confirmed', label: 'Booking Confirmed', desc: 'Order logged & verified' },
  { id: 'assigned', label: 'Professional Assigned', desc: 'Police-vetted specialist matched' },
  { id: 'on_the_way', label: 'On The Way', desc: 'Traveling directly to your residence' },
  { id: 'arrived', label: 'Arrived at Doorstep', desc: 'Checked in at security & unit' },
  { id: 'cleaning', label: 'Cleaning In-Progress', desc: 'Work underway inside your home' },
  { id: 'completed', label: 'Completed & Inspected', desc: 'Spotless results confirmed' },
];

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentBooking,
  onNavigate
}) => {
  const [activeStage, setActiveStage] = useState<TrackerStage>('on_the_way');
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(false);

  // Default active professional
  const assignedPro = PROFESSIONALS[0]; // Mercy Wambui

  // Get index of active stage
  const currentStageIndex = TRACKER_STAGES.findIndex((s) => s.id === activeStage);

  const simulateLoading = () => {
    setIsLoadingSkeleton(true);
    setTimeout(() => {
      setIsLoadingSkeleton(false);
    }, 1200);
  };

  const bookingToDisplay = currentBooking || {
    serviceId: 'home-cleaning' as const,
    homeSize: '2 BR Apartment',
    homeSizePrice: 2200,
    selectedExtras: ['Degrease Kitchen Stovetop & Hood', 'Interior Window Pane Polish'],
    extrasTotal: 900,
    ecoProducts: true,
    notes: 'Please wash delicate bed sheets with cool water; iron cotton shirts first.',
    date: 'Today, 10:00 AM',
    timeSlot: '09:00 AM - 12:00 PM',
    address: 'Ring Road, Kilimani, Apt 4B, Oasis Court',
    estate: 'Kilimani, Nairobi',
    houseNumber: 'Apt 4B',
    accessInstructions: 'Gate code 1492, elevator to 4th floor.',
    customerName: 'Wanjiku Kamau',
    phoneNumber: '0712 345 678',
    paymentMethod: 'mpesa' as const,
    mpesaPhone: '0712 345 678',
    totalPrice: 3350,
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-[#F0F7FF] via-[#F8FAFC] to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Simulation Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#1D4ED8] uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>We Come To You · Live Service Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B]">
              Customer Service Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Real-time dispatch and at-home service status for your residence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={simulateLoading}
              className="text-xs font-semibold py-2 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSkeleton ? 'animate-spin' : ''}`} />
              <span>Test Shimmer Loaders</span>
            </button>
            <button
              onClick={() => onNavigate('booking')}
              className="text-xs font-bold py-2 px-4 rounded-xl bg-[#1D4ED8] hover:bg-[#1e40af] text-white shadow-xs cursor-pointer"
            >
              Book Another Service
            </button>
          </div>
        </div>

        {/* Skeleton View when toggled */}
        {isLoadingSkeleton ? (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="w-48 h-6 rounded-lg animate-shimmer" />
              <div className="w-full h-12 rounded-xl animate-shimmer" />
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="h-20 rounded-xl animate-shimmer" />
                <div className="h-20 rounded-xl animate-shimmer" />
                <div className="h-20 rounded-xl animate-shimmer" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 rounded-3xl animate-shimmer" />
              <div className="h-64 rounded-3xl animate-shimmer" />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* LIVE PULSING CARD: "Your professional is on the way" */}
            <div className="relative overflow-hidden bg-gradient-to-r from-white via-blue-50/30 to-teal-50/40 rounded-3xl p-6 sm:p-8 border border-blue-200 shadow-md">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                      Live In-Route Dispatch
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4B]">
                    {activeStage === 'on_the_way'
                      ? 'Your Fua Fresh professional is on the way!'
                      : activeStage === 'arrived'
                      ? 'Your professional has arrived at your gate!'
                      : activeStage === 'cleaning'
                      ? 'Your in-home cleaning is currently in progress.'
                      : activeStage === 'completed'
                      ? 'Your home is spotless & service is completed!'
                      : 'Your professional is assigned and preparing.'}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                    Destination: <strong className="text-[#0B1F4B]">{bookingToDisplay.address}</strong>.
                    Estimated arrival window: <strong className="text-[#1D4ED8]">18 mins (placeholder ETA)</strong>.
                  </p>
                </div>

                {/* Cleaner Info and Contact Buttons */}
                <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={assignedPro.avatar}
                    alt={assignedPro.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-[#1D4ED8]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1F4B] flex items-center gap-1.5">
                      <span>{assignedPro.name}</span>
                      <ShieldCheck className="w-4 h-4 text-[#14B8A6]" />
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Senior Household Specialist
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <a
                        href="tel:+254700000000"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1D4ED8] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                      <a
                        href="https://wa.me/254700000000"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ANIMATED 6-STAGE TRACKER (Shifting blue to aqua) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0B1F4B]">
                    Live Progress Tracker
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track the exact milestone as our professional enters and services your home.
                  </p>
                </div>
                {/* Interactive Simulation Stepper */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
                  <span className="text-[11px] text-slate-500 font-medium px-2">Simulate:</span>
                  {TRACKER_STAGES.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveStage(s.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                        activeStage === s.id
                          ? 'bg-[#1D4ED8] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Line and Nodes */}
              <div className="relative pt-4 pb-2">
                {/* Background Line */}
                <div className="hidden md:block absolute top-10 left-6 right-6 h-1 bg-slate-100 -translate-y-1/2 z-0" />
                {/* Active Colored Line (Blue to Aqua) */}
                <div
                  className="hidden md:block absolute top-10 left-6 h-1 bg-gradient-to-r from-[#1D4ED8] via-[#3B82F6] to-[#14B8A6] -translate-y-1/2 z-0 transition-all duration-500 rounded-full"
                  style={{
                    width: `${(currentStageIndex / (TRACKER_STAGES.length - 1)) * 92}%`
                  }}
                />

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative z-10">
                  {TRACKER_STAGES.map((st, idx) => {
                    const isDone = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div
                        key={st.id}
                        onClick={() => setActiveStage(st.id)}
                        className="flex flex-col items-center text-center cursor-pointer group"
                      >
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs mb-2 transition-all duration-300 ${
                            isDone
                              ? 'bg-teal-500 text-white shadow-sm ring-4 ring-teal-100'
                              : isCurrent
                              ? 'bg-[#1D4ED8] text-white shadow-md ring-4 ring-blue-100 scale-105'
                              : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                          ) : (
                            idx + 1
                          )}
                        </div>

                        <span
                          className={`text-xs font-bold leading-tight ${
                            isCurrent
                              ? 'text-[#1D4ED8]'
                              : isDone
                              ? 'text-[#14B8A6]'
                              : 'text-slate-400'
                          }`}
                        >
                          {st.label}
                        </span>

                        <span className="text-[10px] text-slate-400 mt-1 hidden sm:block">
                          {st.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* UPCOMING BOOKING CARD & RESIDENCE DETAILS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: Details */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#0B1F4B]">
                        In-Home Household Service
                      </h4>
                      <p className="text-xs text-slate-500">
                        Reference: #FUA-KE-8492
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Paid via M-Pesa
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
                    <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                      Scheduled Time
                    </span>
                    <p className="text-sm font-bold text-[#0B1F4B] flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#1D4ED8]" />
                      {bookingToDisplay.date}
                    </p>
                    <p className="text-slate-500">{bookingToDisplay.timeSlot}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
                    <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                      Destination Residence
                    </span>
                    <p className="text-sm font-bold text-[#0B1F4B] flex items-center gap-1.5 truncate">
                      <MapPin className="w-4 h-4 text-[#14B8A6]" />
                      {bookingToDisplay.estate}
                    </p>
                    <p className="text-slate-500 truncate">{bookingToDisplay.address}</p>
                  </div>
                </div>

                {/* Add-ons & Notes */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-[#0B1F4B] block">
                    Special Focus Areas & Notes:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {bookingToDisplay.selectedExtras.map((item, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-[#1D4ED8] border border-blue-100"
                      >
                        ✓ {item}
                      </span>
                    ))}
                    {bookingToDisplay.ecoProducts && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-50 text-[#14B8A6] border border-teal-100">
                        ✓ Eco-detergent bundle
                      </span>
                    )}
                  </div>
                  {bookingToDisplay.notes && (
                    <p className="text-xs text-slate-500 italic mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                      "{bookingToDisplay.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Card 2: Security & Reassurance Sidebar */}
              <div className="bg-gradient-to-br from-[#0B1F4B] to-[#1D4ED8] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-[#7DD3FC]" />
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    Fua Fresh In-Home Guarantee
                  </h4>
                  <ul className="space-y-2.5 text-xs text-blue-100">
                    <li className="flex items-start gap-2">
                      <span className="text-[#14B8A6] font-bold">✓</span>
                      <span>Never drop off or haul garments anywhere.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#14B8A6] font-bold">✓</span>
                      <span>Digital badge & police certificate check at arrival.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#14B8A6] font-bold">✓</span>
                      <span>Full satisfaction re-clean guarantee included.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-white/10 text-xs">
                  <p className="text-blue-200 mb-2">Need to adjust your time?</p>
                  <button
                    onClick={() => alert("Support representative will contact you via WhatsApp for immediate schedule adjustments.")}
                    className="w-full bg-white/15 hover:bg-white/25 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Contact Concierge Desk
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
