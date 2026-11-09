import React from 'react';
import { Page } from '../types';
import { PROFESSIONALS } from '../data';
import { Star, ShieldCheck, CheckCircle2, MapPin, Calendar, Award, FileCheck } from 'lucide-react';

interface ProfessionalsViewProps {
  onNavigate: (page: Page) => void;
  onSelectProAndBook: (proName: string) => void;
}

export const ProfessionalsView: React.FC<ProfessionalsViewProps> = ({
  onNavigate,
  onSelectProAndBook
}) => {
  return (
    <div className="pt-28 pb-24 bg-gradient-to-b from-[#F0F7FF] via-[#F8FAFC] to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-xs font-bold text-[#7C3AED] uppercase tracking-wider">
            <span>Rigorous 5-Stage Vetting</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            Our Vetted In-Home Professionals
          </h1>
          <p className="text-base text-slate-600 font-normal">
            Trust is the cornerstone of letting someone into your personal sanctuary. Every Fua Fresh specialist is verified, insured, and thoroughly reviewed.
          </p>
        </div>

        {/* 3 Pillars of Vetting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0B1F4B]">
              Kenyan DCI Police Clearance
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Official Certificates of Good Conduct authenticated before onboarding any staff member.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#14B8A6] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0B1F4B]">
              Hospitality Academy Trained
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Garment fabric care, stain chemistry, steam pressing, and discreet in-home conduct.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0B1F4B]">
              Full Liability Protection
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Every appointment is bonded and insured against accidental property damages.
            </p>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {PROFESSIONALS.map((pro) => (
            <div
              key={pro.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={pro.avatar}
                    alt={pro.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#1D4ED8]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>DCI Cleared</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold text-[#0B1F4B]">
                      {pro.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                      <span className="text-xs font-bold text-[#0B1F4B]">
                        {pro.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-[#14B8A6] mb-3">
                    {pro.specialty}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 font-normal">
                    {pro.bio}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                    <span>Estates: {pro.neighborhoods.join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#14B8A6] shrink-0" />
                    <span>{pro.completedJobs} completed in Kenya</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectProAndBook(pro.name)}
                  className="w-full py-3.5 px-4 bg-[#1D4ED8] hover:bg-[#1e40af] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request {pro.name.split(' ')[0]} for Home Visit</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cleaner Fleet Recruitment Banner */}
        <div className="mt-12 bg-gradient-to-r from-teal-900 via-[#0B1F4B] to-[#1D4ED8] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">
              Join Nairobi's #1 In-Home Housekeeping Network
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Want to Clean with Fua Fresh?
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              Earn 75% on every booking, keep 100% of tips, get weekly M-Pesa automatic disbursements, and choose your preferred estates across Nairobi (Kilimani, Westlands, Karen, Kileleshwa).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onNavigate('auth')}
              className="py-3 px-6 rounded-xl bg-teal-400 hover:bg-teal-300 text-[#0B1F4B] text-xs sm:text-sm font-extrabold shadow-md transition-all active:scale-[0.98] cursor-pointer text-center"
            >
              Sign Up as a Cleaner
            </button>
            <button
              onClick={() => onNavigate('auth')}
              className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition-all cursor-pointer text-center"
            >
              Cleaner Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
