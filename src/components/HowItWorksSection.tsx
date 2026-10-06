import React, { useEffect, useRef, useState } from 'react';
import { CalendarCheck, Car, Sparkles, Smile, ArrowRight, ShieldCheck } from 'lucide-react';

interface HowItWorksSectionProps {
  onBookClick: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onBookClick }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [lineWidth, setLineWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight && rect.bottom > 0) {
        const total = windowHeight + rect.height;
        const current = windowHeight - rect.top;
        const progress = Math.min(Math.max(current / total, 0), 1);
        setLineWidth(progress * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      step: '01',
      title: 'Book Online',
      desc: 'Select your preferred service, customized details, and pick an exact date and time that fits your day.',
      icon: CalendarCheck,
      color: '#1D4ED8',
      bgColor: '#EFF6FF',
    },
    {
      step: '02',
      title: 'We Come To You',
      desc: 'A verified, background-checked Fua Fresh specialist arrives at your door equipped with all necessary tools.',
      icon: Car,
      color: '#14B8A6',
      bgColor: '#F0FDFA',
      highlight: true
    },
    {
      step: '03',
      title: 'We Clean On-Site',
      desc: 'Your laundry, ironing, and deep cleaning is completed right inside your residence with utter care and precision.',
      icon: Sparkles,
      color: '#A78BFA',
      bgColor: '#F5F3FF',
    },
    {
      step: '04',
      title: 'Relax & Enjoy',
      desc: 'Inspect the sparkling work, confirm satisfaction, and pay safely via M-Pesa. Your home feels completely renewed.',
      icon: Smile,
      color: '#FF6B5E',
      bgColor: '#FFF1F2',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-[#14B8A6] uppercase tracking-wider">
            <span>Seamless In-Home Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            We eliminated trips to the laundromat and pickup drop-offs completely. Everything happens right where you live.
          </p>
        </div>

        {/* Desktop Step Flow with Scroll-Drawn Gradient Line */}
        <div className="relative mb-16">
          {/* Background connecting track */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-1 bg-slate-100 -translate-y-12 z-0" />
          
          {/* Animated drawing line (blue to aqua) */}
          <div
            className="hidden lg:block absolute top-1/2 left-12 h-1 bg-gradient-to-r from-[#1D4ED8] via-[#3B82F6] to-[#14B8A6] -translate-y-12 z-0 transition-all duration-300 rounded-full"
            style={{ width: `${Math.min(lineWidth * 1.15, 88)}%` }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-3xl p-7 border transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md flex flex-col justify-between ${
                    item.highlight
                      ? 'border-[#14B8A6]/40 ring-2 ring-teal-500/10'
                      : 'border-slate-200/80'
                  }`}
                >
                  <div>
                    {/* Step number badge + icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: item.bgColor, color: item.color }}
                      >
                        <Icon className="w-7 h-7 stroke-[2.2]" />
                      </div>
                      <span className="text-2xl font-black text-slate-300">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#0B1F4B] mb-2.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>

                  {item.highlight && (
                    <div className="mt-5 pt-3 border-t border-teal-100 flex items-center gap-1.5 text-xs font-bold text-[#14B8A6]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Zero transit risk for your belongings</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={onBookClick}
            className="inline-flex items-center justify-center gap-2 bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-base font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 cursor-pointer"
          >
            <span>Experience At-Home Freshness</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
