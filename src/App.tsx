/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Page, ServiceType, BookingData } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustStrip } from './components/TrustStrip';
import { ServicesSection } from './components/ServicesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ProfessionalsSection } from './components/ProfessionalsSection';
import { TestimonialsCarousel } from './components/TestimonialsCarousel';
import { PricingSection } from './components/PricingSection';
import { FinalCtaBand } from './components/FinalCtaBand';
import { Footer } from './components/Footer';
import { BookingFlow } from './components/BookingFlow';
import { CustomerDashboard } from './components/CustomerDashboard';
import { ServicesView } from './components/ServicesView';
import { HowItWorksView } from './components/HowItWorksView';
import { PricingView } from './components/PricingView';
import { ProfessionalsView } from './components/ProfessionalsView';
import { MobileTabBar } from './components/MobileTabBar';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceType>('home-cleaning');
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);

  // Page Transition Handler with thin blue-to-aqua sweep
  const navigateTo = (newPage: Page) => {
    if (newPage === currentPage) return;

    // Start transition
    setIsTransitioning(true);
    setTransitionProgress(true);

    setTimeout(() => {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionProgress(false);
      }, 200);
    }, 180);
  };

  const handleSelectServiceAndBook = (serviceId: ServiceType) => {
    setSelectedServiceForBooking(serviceId);
    navigateTo('booking');
  };

  const handleSelectProAndBook = (proName: string) => {
    navigateTo('booking');
  };

  const handleBookingComplete = (booking: BookingData) => {
    setConfirmedBooking(booking);
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1F4B] flex flex-col font-sans selection:bg-[#1D4ED8]/10 selection:text-[#1D4ED8]">
      {/* Page Sweep Progress Bar during transition */}
      {transitionProgress && (
        <div className="fixed top-0 left-0 right-0 h-1 z-50 overflow-hidden pointer-events-none">
          <div className="h-full bg-gradient-to-r from-[#1D4ED8] via-[#3B82F6] to-[#14B8A6] animate-pulse w-full transition-all duration-300" />
        </div>
      )}

      {/* Sticky Fixed Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
      />

      {/* Main View Area with Smooth Transitions */}
      <main
        className={`flex-1 transition-all duration-200 ${
          isTransitioning ? 'opacity-40 translate-y-1' : 'opacity-100 translate-y-0'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
      >
        {currentPage === 'home' && (
          <>
            {/* Showpiece Hero Section with Airbnb polish */}
            <HeroSection onNavigate={navigateTo} />

            {/* 1. Trust Strip with animated counters */}
            <TrustStrip />

            {/* 2. Services Section with 5 accent-colored cards */}
            <ServicesSection
              onSelectServiceAndBook={handleSelectServiceAndBook}
              onNavigate={navigateTo}
            />

            {/* 3. How It Works Section with scroll-drawn line */}
            <HowItWorksSection onBookClick={() => navigateTo('booking')} />

            {/* 4. Professionals Section with verified badges & hover zoom */}
            <ProfessionalsSection
              onSelectProAndBook={handleSelectProAndBook}
              onNavigate={navigateTo}
            />

            {/* 5. Testimonials Carousel with slow auto-advance */}
            <TestimonialsCarousel />

            {/* 6. Pricing Section */}
            <PricingSection
              onBookClick={() => navigateTo('booking')}
              onNavigate={navigateTo}
            />

            {/* 7. Final CTA Band in deep navy gradient with animated bubbles */}
            <FinalCtaBand onBookClick={() => navigateTo('booking')} />

            {/* 8. Footer */}
            <Footer onNavigate={navigateTo} />
          </>
        )}

        {currentPage === 'services' && (
          <>
            <ServicesView
              onSelectServiceAndBook={handleSelectServiceAndBook}
              onNavigate={navigateTo}
            />
            <Footer onNavigate={navigateTo} />
          </>
        )}

        {currentPage === 'how-it-works' && (
          <>
            <HowItWorksView onNavigate={navigateTo} />
            <Footer onNavigate={navigateTo} />
          </>
        )}

        {currentPage === 'pricing' && (
          <>
            <PricingView
              onNavigate={navigateTo}
              onSelectServiceAndBook={handleSelectServiceAndBook}
            />
            <Footer onNavigate={navigateTo} />
          </>
        )}

        {currentPage === 'professionals' && (
          <>
            <ProfessionalsView
              onNavigate={navigateTo}
              onSelectProAndBook={handleSelectProAndBook}
            />
            <Footer onNavigate={navigateTo} />
          </>
        )}

        {currentPage === 'booking' && (
          <BookingFlow
            initialServiceId={selectedServiceForBooking}
            onNavigate={navigateTo}
            onBookingComplete={handleBookingComplete}
          />
        )}

        {currentPage === 'dashboard' && (
          <CustomerDashboard
            currentBooking={confirmedBooking}
            onNavigate={navigateTo}
          />
        )}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <MobileTabBar
        currentPage={currentPage}
        onNavigate={navigateTo}
      />
    </div>
  );
}
