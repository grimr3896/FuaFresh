import React, { useState } from 'react';
import { Page } from '../types';
import { useAuth } from '../context/AuthContext';
import { NAIROBI_ESTATES, RUIRU_SUB_AREAS } from '../data';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  MapPin,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Briefcase,
  Home,
  Check,
  Award,
  Clock,
  Camera,
  Upload,
  UserCheck,
  HelpCircle,
  FileCheck2,
  Calendar,
  Building
} from 'lucide-react';

export type AuthTab = 'signin' | 'signup-client' | 'join-cleaner';

interface AuthViewProps {
  onNavigate: (page: Page) => void;
  initialTab?: AuthTab;
  initialMode?: 'signin' | 'signup';
  initialRole?: 'customer' | 'cleaner';
}

const PRESET_PASSPORT_PHOTOS = [
  {
    id: 'mercy',
    url: '/src/assets/images/fua_pro_mercy_1791328985938.jpg',
    label: 'Standard Formal',
  },
  {
    id: 'faith',
    url: '/src/assets/images/fua_pro_faith_1791329006931.jpg',
    label: 'Housekeeping Uniform',
  },
  {
    id: 'brian',
    url: '/src/assets/images/fua_pro_brian_1791328996614.jpg',
    label: 'Male Lead Specialist',
  },
];

export const AuthView: React.FC<AuthViewProps> = ({
  onNavigate,
  initialTab,
  initialMode,
  initialRole,
}) => {
  const { signIn, signUp } = useAuth();

  const determineInitialTab = (): AuthTab => {
    if (initialTab) return initialTab;
    if (initialMode === 'signup') {
      return initialRole === 'cleaner' ? 'join-cleaner' : 'signup-client';
    }
    return 'signin';
  };

  const [activeTab, setActiveTab] = useState<AuthTab>(determineInitialTab);

  // Common credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Client-specific fields
  const [clientEstate, setClientEstate] = useState('Ruiru, Kiambu/Nairobi Metropolitan');
  const [clientHomeSize, setClientHomeSize] = useState('2 Bedroom (Standard)');

  // Cleaner-specific fields (Target location: RUIRU)
  const [cleanerSpecialty, setCleanerSpecialty] = useState('Home Cleaning & Eco-Sanitization');
  const [cleanerExperience, setCleanerExperience] = useState('4');
  const [cleanerAvailability, setCleanerAvailability] = useState('full-time');
  const [cleanerGoodConduct, setCleanerGoodConduct] = useState(true);
  const [cleanerBio, setCleanerBio] = useState('');
  const [passportPhoto, setPassportPhoto] = useState(PRESET_PASSPORT_PHOTOS[1].url);
  const [customPhotoSelected, setCustomPhotoSelected] = useState(false);
  const [ruiruArea, setRuiruArea] = useState('Kamakis (Eastern Bypass), Ruiru');
  const [yearsLivingInRuiru, setYearsLivingInRuiru] = useState('3 - 5 Years');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [refereeName, setRefereeName] = useState('');
  const [refereePhone, setRefereePhone] = useState('');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([
    'Kamakis (Eastern Bypass), Ruiru',
    'Membley Estate, Ruiru',
    'Ruiru Town Center',
  ]);

  // Cleaner application submission confirmation state
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [submittedApplicantDetails, setSubmittedApplicantDetails] = useState<{
    name: string;
    phone: string;
    ruiruArea: string;
    specialty: string;
    photo: string;
  } | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const toggleNeighborhood = (est: string) => {
    if (selectedNeighborhoods.includes(est)) {
      if (selectedNeighborhoods.length > 1) {
        setSelectedNeighborhoods(selectedNeighborhoods.filter((n) => n !== est));
      }
    } else {
      setSelectedNeighborhoods([...selectedNeighborhoods, est]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassportPhoto(reader.result as string);
        setCustomPhotoSelected(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    const res = await signIn(email.trim(), password);
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Invalid email or password.');
    } else {
      const role = res.user?.role;
      if (role === 'admin') {
        onNavigate('admin');
      } else if (role === 'cleaner') {
        onNavigate('cleaner-portal');
      } else {
        onNavigate('dashboard');
      }
    }
  };

  const handleClientSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter your Kenyan phone number (M-Pesa enabled).');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please confirm agreement to service terms and safety guidelines.');
      return;
    }

    setIsLoading(true);
    const res = await signUp({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      role: 'customer',
      estate: clientEstate,
    });
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Registration could not be completed.');
    } else if (res.user) {
      setSuccessNotice('Account created successfully! Taking you to your dashboard...');
      setTimeout(() => onNavigate('dashboard'), 700);
    } else {
      setSuccessNotice(res.message || 'Account created. Check your email for a verification link, then sign in.');
    }
  };

  const handleCleanerSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter your Safaricom phone number for M-Pesa payouts.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!emergencyContactName.trim() || !emergencyContactPhone.trim()) {
      setErrorMessage('Please provide an Emergency Contact / Next of Kin name and phone number.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please confirm agreement to professional vetting & safety standards.');
      return;
    }

    setIsLoading(true);
    const res = await signUp({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      role: 'cleaner',
      estate: 'Ruiru, Kiambu/Nairobi Metropolitan',
      ruiruArea,
      passportPhoto,
      specialty: cleanerSpecialty,
      yearsExperience: Number(cleanerExperience),
      neighborhoods: selectedNeighborhoods,
      goodConductCertified: cleanerGoodConduct,
      availability: cleanerAvailability,
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
      refereeName: refereeName.trim() || undefined,
      refereePhone: refereePhone.trim() || undefined,
      yearsLivingInRuiru,
      bio: cleanerBio.trim() || undefined,
    });
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Cleaner application could not be submitted.');
    } else {
      // Store details and show Application Received waiting for approval view
      setSubmittedApplicantDetails({
        name: name.trim(),
        phone: phone.trim(),
        ruiruArea,
        specialty: cleanerSpecialty,
        photo: passportPhoto,
      });
      setApplicationSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-[#F0F7FF] via-white to-white flex items-center justify-center px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Brand Story & Ruiru Operations Highlight */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0B1F4B] to-[#1D4ED8] rounded-3xl p-8 sm:p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#14B8A6]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-200 hover:text-white transition-colors"
            >
              <span>← Back to Homepage</span>
            </button>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
                <Sparkles className="w-6 h-6 text-[#14B8A6]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Fua Fresh
              </h2>
              <p className="text-sm text-blue-100 leading-relaxed">
                Kenya's trusted at-home housekeeping platform. Serving residences across Ruiru, Kiambu & Nairobi.
              </p>
            </div>

            {/* Ruiru Hub Notice */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-white">
                <MapPin className="w-4 h-4 text-emerald-300" />
                <span>Ruiru Operations & Vetting Hub</span>
              </div>
              <p className="text-blue-100 text-[11px] leading-relaxed">
                <strong>Cleaner Recruitment:</strong> Now onboarding qualified housekeepers and cleaning specialists in Ruiru (Kamakis, Membley, Kimbo, Ruiru Town).
              </p>
              <p className="text-blue-100 text-[11px] leading-relaxed">
                <strong>Admin Vetting:</strong> All submitted applications are reviewed in the Ruiru Operations Admin Console before dispatch clearance is granted.
              </p>
            </div>

            {/* Guarantees */}
            <div className="space-y-3 pt-3 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#14B8A6] shrink-0 stroke-[2.5]" />
                <span>75% Cleaner payout share + weekly M-Pesa disbursements</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#14B8A6] shrink-0 stroke-[2.5]" />
                <span>Verified by passport photo & emergency references</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#14B8A6] shrink-0 stroke-[2.5]" />
                <span>Zero registration fees — free professional fleet onboarding</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-white/10 text-[11px] text-blue-200 flex items-center justify-between">
            <span>Ruiru Hub: Kamakis, Membley, Kimbo & Toll</span>
            <span className="font-bold text-teal-300">Operations Live</span>
          </div>
        </div>

        {/* Right Column: Unified 3-in-1 Tab Container */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl flex flex-col justify-between">
          <div>
            {/* ======================================================== */}
            {/* THE UNIFIED TAB: SIGN IN / SIGN UP / JOIN AS CLEANER    */}
            {/* ======================================================== */}
            {!applicationSubmitted && (
              <div className="grid grid-cols-3 p-1.5 bg-slate-100 rounded-2xl mb-6 gap-1 border border-slate-200/80">
                {/* Tab 1: Sign In */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signin');
                    setErrorMessage(null);
                  }}
                  className={`py-2.5 px-2 text-xs sm:text-sm font-bold rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'signin'
                      ? 'bg-white text-[#0B1F4B] shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-[#0B1F4B]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>

                {/* Tab 2: Client Sign Up */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup-client');
                    setErrorMessage(null);
                  }}
                  className={`py-2.5 px-2 text-xs sm:text-sm font-bold rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'signup-client'
                      ? 'bg-white text-[#1D4ED8] shadow-sm border border-blue-200'
                      : 'text-slate-600 hover:text-[#0B1F4B]'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span className="truncate">Sign Up (Client)</span>
                </button>

                {/* Tab 3: Join as Cleaner */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('join-cleaner');
                    setErrorMessage(null);
                  }}
                  className={`py-2.5 px-2 text-xs sm:text-sm font-bold rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'join-cleaner'
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-teal-800 hover:text-teal-950 font-bold bg-teal-50/70'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                  <span className="truncate">Join as Cleaner</span>
                </button>
              </div>
            )}

            {/* Error & Success notices */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="flex-1 font-medium">{errorMessage}</span>
              </div>
            )}

            {successNotice && (
              <div className="mb-5 p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span className="flex-1 font-medium">{successNotice}</span>
              </div>
            )}

            {/* ======================================================== */}
            {/* APPLICATION SUBMITTED — WAITING FOR APPROVAL VIEW       */}
            {/* ======================================================== */}
            {applicationSubmitted && submittedApplicantDetails && (
              <div className="space-y-6 text-center animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center shadow-sm">
                  <Clock className="w-8 h-8 text-amber-600 animate-pulse" />
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    <Clock className="w-3.5 h-3.5" />
                    Status: Pending Admin Approval
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#0B1F4B]">
                    Application Received & Waiting for Approval
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Thank you, <strong>{submittedApplicantDetails.name}</strong>. Your application has been logged into the Fua Fresh Operations Admin Panel.
                  </p>
                </div>

                {/* Applicant Dossier Preview Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left max-w-md mx-auto space-y-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={submittedApplicantDetails.photo}
                      alt={submittedApplicantDetails.name}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-teal-600 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-[#0B1F4B]">
                        {submittedApplicantDetails.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {submittedApplicantDetails.specialty}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-teal-700 font-semibold mt-0.5">
                        <MapPin className="w-3 h-3 text-teal-600" />
                        <span>{submittedApplicantDetails.ruiruArea}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 text-xs text-slate-600 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">M-Pesa Payout:</span>
                      <span className="font-mono font-bold text-slate-800">{submittedApplicantDetails.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vetting Hub:</span>
                      <span className="font-semibold text-slate-800">Ruiru Operations Station</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Review:</span>
                      <span className="font-semibold text-amber-700">Within 24–48 Hours</span>
                    </div>
                  </div>
                </div>

                {/* Explanation note */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 max-w-md mx-auto text-left space-y-1">
                  <span className="font-bold text-[#1D4ED8] block">What happens next?</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Our Ruiru fleet coordinator will inspect your passport photo and emergency contact. Once approved in the Admin Console, you will receive an SMS notification and can immediately sign in to claim cleaning bookings.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                  <button
                    onClick={() => {
                      setApplicationSubmitted(false);
                      setActiveTab('signin');
                      setEmail(submittedApplicantDetails.phone);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#1D4ED8] text-white text-xs font-bold hover:bg-[#1e40af] transition-colors cursor-pointer shadow-sm"
                  >
                    Check Review Status (Sign In)
                  </button>

                  <button
                    onClick={() => onNavigate('admin')}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Open Admin Review Panel
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 1: SIGN IN                                          */}
            {/* ======================================================== */}
            {!applicationSubmitted && activeTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4B]">
                    Sign In to Fua Fresh
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Access your client bookings, cleaner dispatch schedule, or operations portal.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                      Email Address or Phone
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. david@gmail.com or mercy@fuafresh.co.ke"
                        className="w-full p-3.5 pl-10 rounded-xl border border-slate-300 text-sm font-medium text-[#0B1F4B] focus:outline-none focus:border-[#1D4ED8]"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Demo Passwords:\n• Client: pass123\n• Cleaner (Approved): cleaner123\n• Admin: admin123')}
                        className="text-[11px] font-semibold text-[#1D4ED8] hover:underline"
                      >
                        Need Help?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-3.5 pl-10 pr-10 rounded-xl border border-slate-300 text-sm font-medium text-[#0B1F4B] focus:outline-none focus:border-[#1D4ED8]"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-[#1D4ED8] hover:bg-[#1e40af] active:scale-[0.98] text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? <span>Signing In...</span> : (
                    <>
                      <span>Sign In to Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ======================================================== */}
            {/* VIEW 2: SIGN UP AS A CLIENT                              */}
            {/* ======================================================== */}
            {!applicationSubmitted && activeTab === 'signup-client' && (
              <form onSubmit={handleClientSignUpSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D4ED8] bg-blue-50 px-2.5 py-0.5 rounded-full">
                    <Home className="w-3.5 h-3.5" />
                    <span>Homeowner Registration</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4B]">
                    Sign Up as a Client
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Create your account to book in-home housekeeping, laundry & steam ironing across Ruiru & Nairobi.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. David Kiprono"
                        className="w-full p-3 pl-9 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-[#0B1F4B] focus:outline-none focus:border-[#1D4ED8]"
                      />
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                      M-Pesa Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07XX XXX XXX or 01XX XXX XXX"
                        className="w-full p-3 pl-9 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-[#0B1F4B] focus:outline-none focus:border-[#1D4ED8]"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. david@gmail.com"
                      className="w-full p-3 pl-9 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-[#0B1F4B] focus:outline-none focus:border-[#1D4ED8]"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Client residence selection */}
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                  <span className="text-[11px] font-bold text-[#1D4ED8] uppercase tracking-wider block">
                    Residence & Location Details
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Primary Estate / Town
                      </label>
                      <select
                        value={clientEstate}
                        onChange={(e) => setClientEstate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white text-[#0B1F4B]"
                      >
                        {NAIROBI_ESTATES.map((est) => (
                          <option key={est} value={est}>
                            {est}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Typical Home Size
                      </label>
                      <select
                        value={clientHomeSize}
                        onChange={(e) => setClientHomeSize(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white text-[#0B1F4B]"
                      >
                        <option value="Studio">Studio Apartment</option>
                        <option value="1 Bedroom (Compact)">1 Bedroom (Compact)</option>
                        <option value="2 Bedroom (Standard)">2 Bedroom (Standard)</option>
                        <option value="3 Bedroom (Family)">3 Bedroom (Family)</option>
                        <option value="4+ Bedroom (Villa / Maisonette)">4+ Bedroom (Villa / Maisonette)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                    Create Password (Min 6 Characters)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-3 pl-9 pr-9 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-[#0B1F4B] focus:outline-none focus:border-[#1D4ED8]"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Agreement checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="clientTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1D4ED8] border-slate-300 focus:ring-[#1D4ED8]"
                  />
                  <label htmlFor="clientTerms" className="text-[11px] text-slate-600">
                    I agree to Fua Fresh service terms and in-home residential care standards.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full font-bold py-3.5 px-6 rounded-xl shadow-md shadow-blue-600/25 bg-[#1D4ED8] hover:bg-[#1e40af] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-white"
                >
                  {isLoading ? <span>Creating Client Account...</span> : (
                    <>
                      <span>Complete Client Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ======================================================== */}
            {/* VIEW 3: JOIN AS A CLEANER (LOCATION SET TO RUIRU)        */}
            {/* ======================================================== */}
            {!applicationSubmitted && activeTab === 'join-cleaner' && (
              <form onSubmit={handleCleanerSignUpSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
                    <MapPin className="w-3.5 h-3.5 text-teal-700" />
                    <span>Location: Ruiru Hub · Earn 75% Per Job</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4B]">
                    Join as a Cleaner (Ruiru Pro Fleet)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Apply to clean homes in Ruiru. Applications are received and reviewed in the Admin Console before approval.
                  </p>
                </div>

                {/* PASSPORT PHOTO SECTION (Detailed as requested) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      1. Official Passport Photo (Required for Vetting)
                    </span>
                    <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      High Resolution
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Live Preview of Passport Photo */}
                    <div className="relative shrink-0">
                      <img
                        src={passportPhoto}
                        alt="Passport Preview"
                        className="w-20 h-24 rounded-xl object-cover border-2 border-teal-600 shadow-md bg-white"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-1 p-1 bg-teal-600 text-white rounded-full shadow-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    </div>

                    <div className="flex-1 space-y-2 text-xs w-full">
                      <p className="text-slate-600 leading-tight">
                        Upload your clear passport photo or select one of our verified starter headshots.
                      </p>

                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-colors">
                          <Upload className="w-3.5 h-3.5 text-teal-600" />
                          <span>Upload From Phone / PC</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                        {customPhotoSelected && (
                          <span className="text-[11px] text-emerald-700 font-bold">Custom Photo Loaded ✓</span>
                        )}
                      </div>

                      {/* Headshot quick presets */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Or select profile:</span>
                        <div className="flex items-center gap-1.5">
                          {PRESET_PASSPORT_PHOTOS.map((p) => (
                            <button
                              type="button"
                              key={p.id}
                              onClick={() => {
                                setPassportPhoto(p.url);
                                setCustomPhotoSelected(false);
                              }}
                              className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-all ${
                                passportPhoto === p.url && !customPhotoSelected
                                  ? 'border-teal-600 scale-105 shadow-sm'
                                  : 'border-transparent opacity-70 hover:opacity-100'
                              }`}
                              title={p.label}
                            >
                              <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* APPLICANT LEGAL NAME & M-PESA PHONE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Grace Wanjiru Kinyua"
                        className="w-full p-3 pl-9 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-[#0B1F4B] focus:outline-none focus:border-teal-600"
                      />
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                      M-Pesa Number (For Wage Payouts)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07XX XXX XXX (Safaricom)"
                        className="w-full p-3 pl-9 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-[#0B1F4B] focus:outline-none focus:border-teal-600"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. grace.wanjiru@gmail.com"
                      className="w-full p-3 pl-9 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-[#0B1F4B] focus:outline-none focus:border-teal-600"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* LOCATION SET TO RUIRU (Highlighted) */}
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-800" />
                      <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider block">
                        2. Location Set: Ruiru Hub & Service Zones
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-200 text-teal-900">
                      Ruiru Kiambu
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Your Ruiru Residential Area / Sub-Zone:
                      </label>
                      <select
                        value={ruiruArea}
                        onChange={(e) => setRuiruArea(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white text-[#0B1F4B]"
                      >
                        {RUIRU_SUB_AREAS.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Years Living in Ruiru Area:
                      </label>
                      <select
                        value={yearsLivingInRuiru}
                        onChange={(e) => setYearsLivingInRuiru(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white text-[#0B1F4B]"
                      >
                        <option value="Less than 1 Year">Less than 1 Year</option>
                        <option value="1 - 2 Years">1 - 2 Years</option>
                        <option value="3 - 5 Years">3 - 5 Years</option>
                        <option value="5+ Years Resident">5+ Years Resident in Ruiru</option>
                      </select>
                    </div>
                  </div>

                  {/* Coverage in Ruiru sub-areas */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Ruiru Estates You Can Travel To for In-Home Jobs:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Ruiru Town Center', 'Membley Estate, Ruiru', 'Kamakis (Eastern Bypass), Ruiru', 'Kimbo / Toll Station, Ruiru', 'Mugutha Estate, Ruiru', 'Kihunguro, Ruiru'].map((est) => {
                        const isSelected = selectedNeighborhoods.includes(est);
                        return (
                          <button
                            type="button"
                            key={est}
                            onClick={() => toggleNeighborhood(est)}
                            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-teal-700 text-white border-teal-700 font-semibold'
                                : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                            }`}
                          >
                            {est} {isSelected ? '✓' : '+'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* HOUSEKEEPING DETAILS & EMERGENCY CONTACTS (More Details) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#1D4ED8]" />
                    <span className="text-[11px] font-bold text-[#0B1F4B] uppercase tracking-wider block">
                      3. Housekeeping Specialty & Vetting References
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Primary Housekeeping Specialty
                      </label>
                      <select
                        value={cleanerSpecialty}
                        onChange={(e) => setCleanerSpecialty(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white text-[#0B1F4B]"
                      >
                        <option value="Home Cleaning & Eco-Sanitization">Home Cleaning & Eco-Sanitization</option>
                        <option value="Laundry & Fabric Care Master">Laundry & Fabric Care Master</option>
                        <option value="Deep Cleaning & Move-In Revival">Deep Cleaning & Move-In Revival</option>
                        <option value="Crisp Steam Ironing & Wardrobe Care">Crisp Steam Ironing & Wardrobe Care</option>
                        <option value="Full Housekeeping & Meal Prep Organization">Full Housekeeping & Organization</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Years of Housekeeping Experience
                      </label>
                      <select
                        value={cleanerExperience}
                        onChange={(e) => setCleanerExperience(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white text-[#0B1F4B]"
                      >
                        <option value="1">1 - 2 Years</option>
                        <option value="3">3 - 4 Years</option>
                        <option value="5">5 - 7 Years</option>
                        <option value="8">8+ Years (Senior Lead)</option>
                      </select>
                    </div>
                  </div>

                  {/* EMERGENCY CONTACT & REFEREE (More details) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200/80">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Emergency Contact / Next of Kin (Name & Relationship)
                      </label>
                      <input
                        type="text"
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        placeholder="e.g. Peter Kinyua (Brother)"
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-[#0B1F4B]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Emergency Contact Phone Number
                      </label>
                      <input
                        type="tel"
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                        placeholder="07XX XXX XXX"
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-[#0B1F4B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Previous Cleaning Referee (Name)
                      </label>
                      <input
                        type="text"
                        value={refereeName}
                        onChange={(e) => setRefereeName(e.target.value)}
                        placeholder="e.g. Mrs. Jane Kamau (Membley Homeowner)"
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-[#0B1F4B]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Referee Phone Number
                      </label>
                      <input
                        type="tel"
                        value={refereePhone}
                        onChange={(e) => setRefereePhone(e.target.value)}
                        placeholder="07XX XXX XXX"
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-[#0B1F4B]"
                      />
                    </div>
                  </div>

                  {/* Police Clearance Checkbox */}
                  <div className="flex items-start gap-2 pt-1 border-t border-slate-200">
                    <input
                      type="checkbox"
                      id="cleanerGoodConduct"
                      checked={cleanerGoodConduct}
                      onChange={(e) => setCleanerGoodConduct(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-teal-700 border-slate-300 focus:ring-teal-600"
                    />
                    <label htmlFor="cleanerGoodConduct" className="text-xs text-slate-700 font-medium">
                      I confirm I hold or am ready to present my Certificate of Good Conduct (DCI Police Clearance) during onboarding.
                    </label>
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                    Create Portal Password (Min 6 Characters)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-3 pl-9 pr-9 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-[#0B1F4B] focus:outline-none focus:border-teal-600"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Agreement checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="cleanerTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-700 border-slate-300 focus:ring-teal-600"
                  />
                  <label htmlFor="cleanerTerms" className="text-[11px] text-slate-600">
                    I acknowledge my application will be received in the Ruiru Operations Admin Panel for review & approval before dispatch clearance.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full font-bold py-3.5 px-6 rounded-xl shadow-md bg-teal-700 hover:bg-teal-800 shadow-teal-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-white"
                >
                  {isLoading ? <span>Submitting Application to Admin...</span> : (
                    <>
                      <span>Submit Application to Admin Panel for Approval</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Quick tab switcher helper notes at bottom */}
          {!applicationSubmitted && (
            <div className="pt-6 mt-6 border-t border-slate-100 text-center text-xs text-slate-500">
              {activeTab === 'signin' && (
                <p>
                  New to Fua Fresh?{' '}
                  <button
                    onClick={() => setActiveTab('signup-client')}
                    className="font-bold text-[#1D4ED8] hover:underline cursor-pointer"
                  >
                    Sign Up as Client
                  </button>
                  {' '}or{' '}
                  <button
                    onClick={() => setActiveTab('join-cleaner')}
                    className="font-bold text-teal-700 hover:underline cursor-pointer"
                  >
                    Apply as a Cleaner in Ruiru (Earn 75%)
                  </button>
                </p>
              )}

              {activeTab === 'signup-client' && (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => setActiveTab('signin')}
                    className="font-bold text-[#1D4ED8] hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                  {' '}· Want to clean in Ruiru?{' '}
                  <button
                    onClick={() => setActiveTab('join-cleaner')}
                    className="font-bold text-teal-700 hover:underline cursor-pointer"
                  >
                    Join as Cleaner
                  </button>
                </p>
              )}

              {activeTab === 'join-cleaner' && (
                <p>
                  Already registered in the fleet?{' '}
                  <button
                    onClick={() => setActiveTab('signin')}
                    className="font-bold text-[#1D4ED8] hover:underline cursor-pointer"
                  >
                    Sign In to Check Approval / Dispatch
                  </button>
                  {' '}· Looking for cleaning?{' '}
                  <button
                    onClick={() => setActiveTab('signup-client')}
                    className="font-bold text-[#1D4ED8] hover:underline cursor-pointer"
                  >
                    Sign Up as Client
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
