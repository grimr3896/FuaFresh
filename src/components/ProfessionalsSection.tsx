import React from 'react';
import { PROFESSIONALS } from '../data';
import { Star, ShieldCheck, CheckCircle2, MapPin, Calendar } from 'lucide-react';
import { Page } from '../types';

interface ProfessionalsSectionProps {
  onSelectProAndBook?: (proName: string) => void;
  onNavigate: (page: Page) => void;
}

export const ProfessionalsSection: React.FC<ProfessionalsSectionProps> = ({
  onSelectProAndBook,
  onNavigate,
}) => {
  return (
    <section className="py-24 bg-[#F8FAFC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-xs font-bold text-[#7C3AED] uppercase tracking-wider">
            <span>Our Trusted Team</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            Meet Your In-Home Specialists
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            Every Fua Fresh team member undergoes strict police vetting, background clearance, and hospitality-grade training.
          </p>
        </div>

        {/* 3 Pro Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {PROFESSIONALS.map((pro) => (
            <div
              key={pro.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
              style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
            >
              <div>
                {/* Photo with zoom on hover */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={pro.avatar}
                    alt={pro.name}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle dark gradient scrim at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Verification Badge */}
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-md text-xs font-bold text-[#1D4ED8]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>Police Cleared</span>
                  </div>

                  {/* Experience Tag */}
                  <div className="absolute bottom-3 left-4 text-white">
                    <p className="text-xs font-semibold drop-shadow-xs">
                      {pro.yearsExperience} Years In-Home Experience
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-[#0B1F4B] group-hover:text-[#1D4ED8] transition-colors">
                      {pro.name}
                    </h3>
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                      <span className="text-xs font-bold text-[#0B1F4B] tabular-nums">
                        {pro.rating}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        ({pro.reviewsCount})
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-[#14B8A6] mb-3">
                    {pro.specialty}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 font-normal">
                    {pro.bio}
                  </p>

                  {/* Estates Served */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                    <span className="truncate">
                      Servicing: {pro.neighborhoods.join(', ')}
                    </span>
                  </div>

                  {/* Jobs count */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#14B8A6] shrink-0" />
                    <span>Completed {pro.completedJobs}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    if (onSelectProAndBook) onSelectProAndBook(pro.name);
                    else onNavigate('booking');
                  }}
                  className="w-full py-3 px-4 rounded-xl border border-blue-200 hover:border-[#1D4ED8] text-sm font-semibold text-[#1D4ED8] hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request {pro.name.split(' ')[0]} for Your Home</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Reassurance banner & Cleaner Recruitment */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#14B8A6] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#0B1F4B]">
                Your Security & Sanctuary Come First
              </h4>
              <p className="text-xs text-slate-500">
                Every staff member presents a digital Kenyan national ID and company badge before entering your home. Insured against damages.
              </p>
            </div>
            <button
              onClick={() => onNavigate('professionals')}
              className="text-xs font-bold text-[#1D4ED8] hover:underline shrink-0"
            >
              Learn about our vetting →
            </button>
          </div>

          {/* Dedicated Pro Recruitment Banner */}
          <div className="bg-gradient-to-r from-teal-900 to-[#0B1F4B] text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-300 uppercase tracking-wider">
                <span>Hiring in Kilimani, Westlands, Kileleshwa & Karen</span>
              </div>
              <h4 className="text-base font-extrabold text-white">
                Are you a skilled housekeeper or cleaner in Nairobi?
              </h4>
              <p className="text-xs text-slate-300 max-w-xl">
                Earn 75% of every booking with immediate M-Pesa disbursements, flexible neighborhood routes, and supplied eco-friendly detergents.
              </p>
            </div>
            <button
              onClick={() => onNavigate('auth')}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md whitespace-nowrap cursor-pointer transition-colors"
            >
              Apply as a Cleaner
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
