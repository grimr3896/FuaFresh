import React, { useState, useEffect } from 'react';
import { TESTIMONIALS } from '../data';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const TestimonialsCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[activeIndex];

  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-[#D97706] uppercase tracking-wider">
            <span>Verified Customer Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            Loved Across Kenyan Residences
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Real stories from homeowners in Kilimani, Westlands, Karen, and Kileleshwa.
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative bg-gradient-to-br from-[#F0F7FF] via-white to-[#F0FDFA] rounded-[32px] p-8 sm:p-12 md:p-16 border border-blue-100/80 shadow-xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Quote Icon Watermark */}
          <div className="absolute top-8 right-8 text-blue-200/40 pointer-events-none">
            <Quote className="w-20 h-20 sm:w-28 sm:h-28 rotate-180" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
            {/* 5 Stars */}
            <div className="flex items-center justify-center gap-1.5">
              {[...Array(current.stars)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-[#FBBF24] text-[#FBBF24]"
                />
              ))}
            </div>

            {/* Quote text */}
            <blockquote className="text-lg sm:text-2xl md:text-3xl font-medium text-[#0B1F4B] leading-relaxed transition-all duration-500 ease-out italic">
              "{current.comment}"
            </blockquote>

            {/* Author info */}
            <div className="flex flex-col items-center justify-center gap-3 pt-2">
              <img
                src={current.avatar}
                alt={current.author}
                className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-md"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-base font-bold text-[#0B1F4B]">
                  {current.author}
                </h4>
                <p className="text-xs sm:text-sm text-[#1D4ED8] font-semibold">
                  {current.role}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Arrow Nav Buttons */}
          <div className="hidden sm:flex items-center justify-between absolute top-1/2 left-6 right-6 -translate-y-1/2 pointer-events-none">
            <button
              onClick={handlePrev}
              className="pointer-events-auto w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-[#1D4ED8] hover:scale-105 transition-all cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="pointer-events-auto w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-[#1D4ED8] hover:scale-105 transition-all cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Indicators / Dots */}
          <div className="flex items-center justify-center gap-2 mt-8 pt-4">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === i
                    ? 'w-8 bg-[#1D4ED8]'
                    : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
