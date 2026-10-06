import React, { useEffect, useState } from 'react';
import { ShieldCheck, Home, Receipt, Smartphone, CheckCircle2 } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 1000;
    const duration = 1600;
    const intervalTime = 30;
    const increment = Math.ceil(end / (duration / intervalTime));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const trustItems = [
    {
      title: 'Vetted Professionals',
      subtitle: 'Police clearance verified',
      stat: '100% Verified',
      icon: ShieldCheck,
      color: '#1D4ED8',
      bgColor: '#EFF6FF',
    },
    {
      title: 'At-Home Service',
      subtitle: 'Zero travel or drop-off',
      stat: 'We Come To You',
      icon: Home,
      color: '#14B8A6',
      bgColor: '#F0FDFA',
    },
    {
      title: 'Transparent Pricing',
      subtitle: 'No surprises or hidden fees',
      stat: 'Guaranteed Rates',
      icon: Receipt,
      color: '#A78BFA',
      bgColor: '#F5F3FF',
    },
    {
      title: 'Secure Payments',
      subtitle: 'Instant Safaricom STK',
      stat: 'M-Pesa Verified',
      icon: Smartphone,
      color: '#FF6B5E',
      bgColor: '#FFF1F2',
    },
    {
      title: 'Quality Assurance',
      subtitle: '100% re-clean promise',
      stat: `${count.toLocaleString()}+ Homes (placeholder)`,
      icon: CheckCircle2,
      color: '#FBBF24',
      bgColor: '#FEFCE8',
    },
  ];

  return (
    <section className="bg-white py-12 sm:py-16 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {trustItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="group flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50/80"
              >
                <div
                  className="w-13 h-13 rounded-2xl flex items-center justify-center mb-3.5 transition-transform duration-300 group-hover:scale-110 shadow-xs"
                  style={{ backgroundColor: item.bgColor, color: item.color }}
                >
                  <IconComponent className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-sm font-bold text-[#0B1F4B] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-[#1D4ED8] mb-0.5 tabular-nums">
                  {item.stat}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
