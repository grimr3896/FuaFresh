import React from 'react';
import { Sparkles, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0B1F4B] text-slate-300 pt-16 pb-24 md:pb-16 border-t border-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-blue-900/50">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1D4ED8] to-[#14B8A6] flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Fua Fresh
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Kenya’s premier at-home laundry and residential cleaning service. We never use pickup or drop-off depots—our trusted professionals bring premium care directly inside your residence.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-950/70 border border-blue-800 text-xs font-semibold text-[#7DD3FC]">
                <ShieldCheck className="w-4 h-4 text-[#14B8A6]" />
                NO DROP-OFF. NO PICKUP. WE COME TO YOU.
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400"
                >
                  All Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400"
                >
                  Pricing Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('professionals')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400"
                >
                  Our Professionals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('auth')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400"
                >
                  Sign In / Register
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cleaner-portal')}
                  className="hover:text-white transition-colors cursor-pointer text-teal-400 font-semibold"
                >
                  Join as Cleaner (Earn 75%)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('booking')}
                  className="hover:text-white transition-colors cursor-pointer text-[#7DD3FC]"
                >
                  Book In-Home Service
                </button>
              </li>
            </ul>
          </div>

          {/* Services list */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Home Cleaning</li>
              <li>In-Home Laundry & Line Dry</li>
              <li>Intensive Deep Cleaning</li>
              <li>Delicate Ironing & Pressing</li>
              <li>Custom Household Packages</li>
            </ul>
          </div>

          {/* Contacts & Payment badge */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Kenya Operations
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                <span>Kilimani Business Hub, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#14B8A6] shrink-0" />
                <span>+254 700 123 456 (placeholder)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF6B5E] shrink-0" />
                <span>hello@fuafresh.co.ke</span>
              </div>
            </div>

            {/* Official M-Pesa Badge */}
            <div className="pt-2">
              <div className="bg-[#122A5E] border border-blue-900 rounded-xl p-3 inline-flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                  M
                </div>
                <div>
                  <span className="text-[11px] font-bold text-white block">
                    Lipa Na M-Pesa
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Instant STK Push Guaranteed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Fua Fresh Kenya Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Police Clearance Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
