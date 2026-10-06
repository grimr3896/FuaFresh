import React from 'react';
import { Page, ServiceType } from '../types';
import { SERVICES } from '../data';
import { Sparkles, Shirt, ShieldCheck, Flame, Sliders, ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceAndBook: (serviceId: ServiceType) => void;
  onNavigate: (page: Page) => void;
}

const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'Sparkles':
      return Sparkles;
    case 'Shirt':
      return Shirt;
    case 'ShieldCheck':
      return ShieldCheck;
    case 'Flame':
      return Flame;
    case 'Sliders':
    default:
      return Sliders;
  }
};

const getAccentStyles = (accent: string) => {
  switch (accent) {
    case 'blue':
      return {
        bgLight: 'bg-blue-50',
        text: 'text-[#1D4ED8]',
        borderHover: 'hover:border-blue-400',
        dotBg: 'bg-[#1D4ED8]',
        badgeBg: 'bg-blue-100 text-[#1D4ED8]'
      };
    case 'aqua':
      return {
        bgLight: 'bg-teal-50',
        text: 'text-[#14B8A6]',
        borderHover: 'hover:border-teal-400',
        dotBg: 'bg-[#14B8A6]',
        badgeBg: 'bg-teal-100 text-[#14B8A6]'
      };
    case 'lavender':
      return {
        bgLight: 'bg-purple-50',
        text: 'text-[#A78BFA]',
        borderHover: 'hover:border-purple-400',
        dotBg: 'bg-[#A78BFA]',
        badgeBg: 'bg-purple-100 text-[#7C3AED]'
      };
    case 'coral':
      return {
        bgLight: 'bg-rose-50',
        text: 'text-[#FF6B5E]',
        borderHover: 'hover:border-rose-400',
        dotBg: 'bg-[#FF6B5E]',
        badgeBg: 'bg-rose-100 text-[#E11D48]'
      };
    case 'amber':
    default:
      return {
        bgLight: 'bg-amber-50',
        text: 'text-[#F59E0B]',
        borderHover: 'hover:border-amber-400',
        dotBg: 'bg-[#FBBF24]',
        badgeBg: 'bg-amber-100 text-[#D97706]'
      };
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceAndBook,
  onNavigate
}) => {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-white via-[#F8FAFC] to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#1D4ED8] uppercase tracking-wider">
            <span>In-Home Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            Services That Come to Your Door
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Every service is handled on-site inside your living space or balcony. No hauling clothes, no drop-off depots, no laundromats.
          </p>
        </div>

        {/* 5 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service, index) => {
            const Icon = getServiceIcon(service.iconName);
            const style = getAccentStyles(service.accent);
            return (
              <div
                key={service.id}
                onClick={() => onSelectServiceAndBook(service.id)}
                className={`group relative bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl ${style.borderHover} transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer`}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div>
                  {/* Top Icon Circle with Accent Color */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-14 h-14 rounded-2xl ${style.bgLight} ${style.text} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-xs`}
                    >
                      <Icon className="w-7 h-7 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {service.durationEstimate}
                    </span>
                  </div>

                  {/* Name and Description */}
                  <h3 className="text-xl font-bold text-[#0B1F4B] mb-2 group-hover:text-[#1D4ED8] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {service.description}
                  </p>

                  {/* Feature preview list */}
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dotBg} mt-1.5 shrink-0`} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer with Starting Price and Book Now */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Pricing</span>
                    <span className="text-sm font-bold text-[#0B1F4B] tabular-nums">
                      {service.startingPrice}
                    </span>
                  </div>

                  <div className={`inline-flex items-center gap-1.5 text-sm font-bold ${style.text} group-hover:translate-x-1 transition-transform duration-200`}>
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Custom Household Care banner */}
          <div className="bg-gradient-to-br from-[#0B1F4B] to-[#1D4ED8] rounded-3xl p-7 text-white flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-[#7DD3FC]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Kenya’s Premier In-Home Care
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1 mb-3">
                Need a custom recurring plan?
              </h3>
              <p className="text-sm text-blue-100 leading-relaxed mb-6">
                Weekly, bi-weekly, or estate-wide housekeeping arranged with your favorite dedicated professional.
              </p>
            </div>
            <button
              onClick={() => onSelectServiceAndBook('custom')}
              className="w-full bg-white text-[#0B1F4B] hover:bg-blue-50 text-sm font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Build Custom Package</span>
              <ArrowRight className="w-4 h-4 text-[#1D4ED8]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
