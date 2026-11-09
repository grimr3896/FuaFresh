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
import { AuthView } from './components/AuthView';
import { AdminPanel } from './components/AdminPanel';
import { CleanerPortal } from './components/CleanerPortal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Shield, Sparkles, ArrowRight, Home } from 'lucide-react';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceType>('home-cleaning');
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);
  const [authInitialTab, setAuthInitialTab] = useState<'signin' | 'signup-client' | 'join-cleaner'>('signin');
  const { currentUser } = useAuth();

  // Page Transition Handler with thin blue-to-aqua sweep
  const navigateTo = (newPage: Page, authTab?: 'signin' | 'signup-client' | 'join-cleaner') => {
    if (authTab) {
      setAuthInitialTab(authTab);
    }
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

  const isNavHidden = currentPage === 'admin';

  return (
    <div className="min-h-screen bg-white text-[#0B1F4B] flex flex-col font-sans selection:bg-[#1D4ED8]/10 selection:text-[#1D4ED8]">
      {/* Page Sweep Progress Bar during transition */}
      {transitionProgress && (
        <div className="fixed top-0 left-0 right-0 h-1 z-50 overflow-hidden pointer-events-none">
          <div className="h-full bg-gradient-to-r from-[#1D4ED8] via-[#3B82F6] to-[#14B8A6] animate-pulse w-full transition-all duration-300" />
        </div>
      )}

      {/* Sticky Fixed Navbar (Hidden in full-screen Admin console) */}
      {!isNavHidden && (
        <Navbar
          currentPage={currentPage}
          onNavigate={navigateTo}
        />
      )}

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

        {currentPage === 'auth' && (
          <>
            <AuthView onNavigate={navigateTo} initialTab={authInitialTab} />
            <Footer onNavigate={navigateTo} />
          </>
        )}

        {currentPage === 'admin' && (
          currentUser?.role === 'admin' ? (
            <AdminPanel onNavigate={navigateTo} />
          ) : (
            <div className="min-h-screen pt-28 pb-20 bg-slate-50 flex items-center justify-center px-4">
              <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1D4ED8] mx-auto flex items-center justify-center border border-blue-200 shadow-sm">
                  <Shield className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Restricted Area
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#0B1F4B]">
                    Operations Portal
                  </h2>
                  <p className="text-xs text-slate-500">
                    The Fua Fresh Admin Console is reserved for operations coordinators and staff.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button onClick={() => navigateTo('auth')} className="w-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-bold py-3 px-5 rounded-xl shadow-md transition-all text-xs">Sign In with Staff Credentials</button>

                  <button
                    onClick={() => navigateTo('auth')}
                    className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold py-2.5 px-5 rounded-xl transition-all text-xs cursor-pointer"
                  >
                    Enter Specific Staff Credentials
                  </button>

                  <button
                    onClick={() => navigateTo('home')}
                    className="w-full text-slate-500 hover:text-slate-800 font-semibold text-xs py-1"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {currentPage === 'cleaner-portal' && (
          currentUser?.role === 'cleaner' ? (
            <CleanerPortal onNavigate={navigateTo} />
          ) : (
            <div className="min-h-screen pt-28 pb-20 bg-gradient-to-b from-teal-50/50 to-slate-50 flex items-center justify-center px-4">
              <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-teal-200/80 shadow-xl text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 mx-auto flex items-center justify-center border border-teal-200 shadow-sm">
                  <Sparkles className="w-8 h-8 text-teal-600" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                    Housekeeper Access Only
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#0B1F4B]">
                    Cleaner Dispatch Portal
                  </h2>
                  <p className="text-xs text-slate-500">
                    This portal is designed for registered Fua Fresh cleaning specialists to view their schedule, accept bookings, and manage M-Pesa payouts.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button onClick={() => navigateTo('auth')} className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-5 rounded-xl shadow-md transition-all text-xs">Sign In to Cleaner Account</button>

                  <button
                    onClick={() => navigateTo('auth')}
                    className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold py-2.5 px-5 rounded-xl transition-all text-xs cursor-pointer"
                  >
                    Sign Up as a New Cleaner
                  </button>

                  <button
                    onClick={() => navigateTo('home')}
                    className="w-full text-slate-500 hover:text-slate-800 font-semibold text-xs py-1"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Mobile Bottom Tab Bar (Hidden in Admin console) */}
      {!isNavHidden && (
        <MobileTabBar
          currentPage={currentPage}
          onNavigate={navigateTo}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
