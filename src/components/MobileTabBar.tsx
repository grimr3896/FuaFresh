import React from 'react';
import { Page } from '../types';
import { Home, Sparkles, PlusCircle, CalendarCheck, Tag } from 'lucide-react';

interface MobileTabBarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  currentPage,
  onNavigate,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-blue-100 shadow-lg px-2 py-2">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
            currentPage === 'home'
              ? 'text-[#1D4ED8] font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Services */}
        <button
          onClick={() => onNavigate('services')}
          className={`flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
            currentPage === 'services'
              ? 'text-[#1D4ED8] font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Services</span>
        </button>

        {/* Center Prominent Book Button */}
        <button
          onClick={() => onNavigate('booking')}
          className="flex flex-col items-center justify-center -mt-5 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1D4ED8] to-[#14B8A6] text-white flex items-center justify-center shadow-lg shadow-blue-600/35 active:scale-95 transition-transform">
            <PlusCircle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-bold text-[#1D4ED8] mt-0.5">Book</span>
        </button>

        {/* Dashboard / Bookings */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
            currentPage === 'dashboard'
              ? 'text-[#1D4ED8] font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <CalendarCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Tracker</span>
        </button>

        {/* Pricing */}
        <button
          onClick={() => onNavigate('pricing')}
          className={`flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
            currentPage === 'pricing'
              ? 'text-[#1D4ED8] font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Tag className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Pricing</span>
        </button>
      </div>
    </div>
  );
};
