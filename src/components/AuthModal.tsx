import React, { useState } from 'react';
import { X, Smartphone, ShieldCheck, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (phoneNumber: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [phoneNumber, setPhoneNumber] = useState('0712 345 678');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpStep(true);
    }, 700);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(phoneNumber);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1D4ED8] mx-auto flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-[#0B1F4B]">
            {otpStep ? 'Enter 4-Digit Security Code' : 'Welcome to Fua Fresh'}
          </h3>
          <p className="text-xs text-slate-500">
            {otpStep
              ? `We sent a quick SMS code to ${phoneNumber}`
              : 'Sign in with your Kenyan mobile phone number to view bookings'}
          </p>
        </div>

        {!otpStep ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="07XX XXX XXX or 01XX XXX XXX"
                  className="w-full p-3.5 pl-11 rounded-xl border border-slate-300 text-sm font-semibold text-[#0B1F4B] focus:outline-none focus:border-[#1D4ED8]"
                />
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-sm font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Sending SMS...' : 'Continue with Phone'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="1 2 3 4"
                className="w-full p-3.5 text-center tracking-widest text-xl font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl shadow-md shadow-teal-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying...' : 'Verify & Enter'}
            </button>

            <button
              type="button"
              onClick={() => setOtpStep(false)}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800"
            >
              Change Phone Number
            </button>
          </form>
        )}

        <div className="pt-2 text-center border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
          <span>No password needed · Safe in-home booking</span>
        </div>
      </div>
    </div>
  );
};
