import React, { useState } from 'react';
import { Page, ServiceType } from '../types';
import { SERVICES } from '../data';
import { Sparkles, Shirt, ShieldCheck, Flame, Sliders, Check, ArrowRight, Clock, Shield } from 'lucide-react';

interface ServicesViewProps {
  onSelectServiceAndBook: (serviceId: ServiceType) => void;
  onNavigate: (page: Page) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onSelectServiceAndBook,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<ServiceType>('home-cleaning');
  const activeService = SERVICES.find((s) => s.id === activeTab) || SERVICES[0];

  return (
    <div className="pt-28 pb-24 bg-gradient-to-b from-[#F0F7FF] via-[#F8FAFC] to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#1D4ED8] uppercase tracking-wider">
            <span>Performed Inside Your Home</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            Our In-Home Service Catalog
          </h1>
          <p className="text-base text-slate-600 font-normal">
            We Come To You. Choose your service category below to view equipment brought, process details, and transparent rates.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 gap-2 mb-10 no-scrollbar">
          {SERVICES.map((s) => {
            const isActive = activeTab === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#1D4ED8] text-white shadow-md shadow-blue-600/30'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Service Detail Panel */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold"
                  style={{
                    backgroundColor: `${activeService.hex}15`,
                    color: activeService.hex
                  }}
                >
                  {activeService.id === 'home-cleaning' && <Sparkles className="w-6 h-6" />}
                  {activeService.id === 'laundry' && <Shirt className="w-6 h-6" />}
                  {activeService.id === 'deep-cleaning' && <ShieldCheck className="w-6 h-6" />}
                  {activeService.id === 'ironing' && <Flame className="w-6 h-6" />}
                  {activeService.id === 'custom' && <Sliders className="w-6 h-6" />}
                </span>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {activeService.tagline}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B]">
                    {activeService.name}
                  </h2>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {activeService.description}
              </p>

              {/* What is included checklist */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider">
                  What is included in this in-home service:
                </h4>
                <div className="space-y-2.5">
                  {activeService.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${activeService.hex}15`, color: activeService.hex }}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment Brought */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 text-xs space-y-1">
                <p className="font-bold text-[#0B1F4B] flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#14B8A6]" />
                  <span>Equipment Brought to Your Home:</span>
                </p>
                <p className="text-slate-500">
                  Microfiber color-coded cloths, hospital-grade eco disinfectants, mop & bucket set, garment steaming iron, glass scraper, and shoe covers.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Estimated Pricing</span>
                  <span className="text-xl font-extrabold text-[#0B1F4B] tabular-nums">
                    {activeService.startingPrice}
                  </span>
                </div>

                <button
                  onClick={() => onSelectServiceAndBook(activeService.id)}
                  className="bg-[#1D4ED8] hover:bg-[#1e40af] text-white py-3.5 px-8 rounded-2xl text-sm font-bold shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  <span>Book {activeService.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Callout Column */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0B1F4B] to-[#1D4ED8] text-white rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-lg">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200">
                  <Clock className="w-3.5 h-3.5 text-[#14B8A6]" />
                  <span>Average Time: {activeService.durationEstimate}</span>
                </div>
                <h3 className="text-2xl font-bold">
                  Performed Inside Your Sanctuary
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  Unlike traditional services that take your garments to unknown third-party facilities, Fua Fresh does all washing, line drying, ironing, and tidying inside your living space.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>Transport Risk:</span>
                  <span className="text-[#14B8A6]">0% (We Come To You)</span>
                </div>
                <div className="flex items-center justify-between font-bold text-white">
                  <span>Lost Item Risk:</span>
                  <span className="text-[#14B8A6]">0% (Everything stays home)</span>
                </div>
                <div className="flex items-center justify-between font-bold text-white">
                  <span>Payment Security:</span>
                  <span className="text-[#7DD3FC]">Safaricom M-Pesa STK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
