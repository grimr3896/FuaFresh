import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { Sparkles, Menu, X, Shield, PhoneCall } from 'lucide-react';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
  userPhone: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenLogin,
  isLoggedIn,
  userPhone
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; page: Page }[] = [
    { label: 'Services', page: 'services' },
    { label: 'How It Works', page: 'how-it-works' },
    { label: 'Pricing', page: 'pricing' },
    { label: 'Professionals', page: 'professionals' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3.5 bg-white/90 backdrop-blur-md shadow-sm border-b border-blue-100/80'
          : 'py-5 bg-transparent'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Wordmark (Single text element with refined logo icon) */}
          <button
            onClick={() => onNavigate('home')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
            aria-label="Fua Fresh Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1D4ED8] to-[#14B8A6] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0B1F4B]">
                Fua Fresh
              </span>
            </div>
          </button>

          {/* Center Navigation Links (Clean text with hover indicators) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => onNavigate(link.page)}
                  className={`relative text-sm font-medium transition-colors duration-200 py-1 ${
                    isActive
                      ? 'text-[#1D4ED8] font-semibold'
                      : 'text-slate-600 hover:text-[#0B1F4B]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1D4ED8] rounded-full animate-in fade-in duration-200" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Log in + Book a Service */}
          <div className="hidden md:flex items-center gap-5">
            {isLoggedIn ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-sm font-medium text-slate-700 hover:text-[#1D4ED8] flex items-center gap-1.5 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 text-[#1D4ED8] flex items-center justify-center text-xs font-bold">
                  {userPhone.slice(-2) || 'KE'}
                </div>
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="text-sm font-medium text-slate-700 hover:text-[#1D4ED8] transition-colors py-1"
              >
                Log in
              </button>
            )}

            <button
              onClick={() => onNavigate('booking')}
              className="bg-[#1D4ED8] hover:bg-[#1e40af] active:scale-[0.97] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              Book a Service
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('booking')}
              className="bg-[#1D4ED8] text-white text-xs font-semibold px-3 py-2 rounded-full shadow-sm"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#0B1F4B] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-blue-100 shadow-xl px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  onNavigate(link.page);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                  currentPage === link.page
                    ? 'bg-blue-50 text-[#1D4ED8] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 text-sm font-semibold text-[#1D4ED8] bg-blue-50 rounded-xl"
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Log in
              </button>
            )}

            <button
              onClick={() => {
                onNavigate('booking');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-3 text-sm font-semibold text-white bg-[#1D4ED8] rounded-xl shadow-md shadow-blue-500/25"
            >
              Book a Service
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
