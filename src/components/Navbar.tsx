import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Menu, X, Shield, User, LogOut } from 'lucide-react';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate
}) => {
  const { currentUser, signOut } = useAuth();
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

          {/* Right Actions: Track Order + Auth / Admin + Book a Service */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`text-sm font-medium transition-colors py-1 ${
                currentPage === 'dashboard'
                  ? 'text-[#1D4ED8] font-semibold'
                  : 'text-slate-600 hover:text-[#0B1F4B]'
              }`}
            >
              Track Order
            </button>

            {/* Auth / Role / Cleaner Links */}
            {currentUser ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                {currentUser.role === 'admin' ? (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      currentPage === 'admin'
                        ? 'bg-[#1D4ED8] text-white shadow-xs'
                        : 'bg-blue-50 text-[#1D4ED8] hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Panel</span>
                  </button>
                ) : currentUser.role === 'cleaner' ? (
                  <button
                    onClick={() => onNavigate('cleaner-portal')}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      currentPage === 'cleaner-portal'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Cleaner Portal</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="text-xs font-semibold text-slate-700 hover:text-[#1D4ED8] transition-colors"
                  >
                    Hi, {currentUser.name.split(' ')[0]}
                  </button>
                )}

                <button
                  onClick={() => signOut()}
                  className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
                  title="Sign Out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                {/* ONE UNIFIED TAB: Sign Up / Sign In / Join as Cleaner */}
                <button
                  onClick={() => onNavigate('auth')}
                  className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer border ${
                    currentPage === 'auth'
                      ? 'bg-[#0B1F4B] text-white border-[#0B1F4B] shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-[#0B1F4B] border-slate-200/90 shadow-2xs'
                  }`}
                  title="Sign In, Sign Up as Client, or Join as a Cleaner"
                >
                  <User className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  <span>Sign In / Join as Cleaner</span>
                </button>

                <button
                  onClick={() => onNavigate('admin')}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-100 px-2 py-1.5 rounded-lg transition-colors"
                  title="Access Operations Admin Panel"
                >
                  Admin
                </button>
              </div>
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
            <button
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`text-left text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                currentPage === 'dashboard'
                  ? 'bg-blue-50 text-[#1D4ED8] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Track Order
            </button>

            {currentUser ? (
              <>
                {currentUser.role === 'admin' ? (
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left text-base font-bold py-2 px-3 rounded-lg transition-colors ${
                      currentPage === 'admin'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-[#1D4ED8]'
                    }`}
                  >
                    Admin Operations Console
                  </button>
                ) : currentUser.role === 'cleaner' ? (
                  <button
                    onClick={() => {
                      onNavigate('cleaner-portal');
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left text-base font-bold py-2 px-3 rounded-lg transition-colors ${
                      currentPage === 'cleaner-portal'
                        ? 'bg-teal-700 text-white'
                        : 'bg-teal-50 text-teal-800'
                    }`}
                  >
                    Cleaner Dispatch Portal
                  </button>
                ) : null}
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-sm font-semibold py-2 px-3 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  Sign Out ({currentUser.name})
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                {/* ONE UNIFIED TAB IN MOBILE DRAWER */}
                <button
                  onClick={() => {
                    onNavigate('auth');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    currentPage === 'auth'
                      ? 'bg-[#0B1F4B] text-white'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#1D4ED8]" />
                    <span>Sign In / Sign Up / Join as Cleaner</span>
                  </div>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                    All in 1 Tab
                  </span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-50 rounded-lg border border-slate-200/60"
                >
                  Staff Operations Admin Console
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
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
