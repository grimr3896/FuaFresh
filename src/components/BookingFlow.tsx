import React, { useState } from 'react';
import { Page, ServiceType, BookingData } from '../types';
import { SERVICES, NAIROBI_ESTATES } from '../data';
import {
  Sparkles,
  Shirt,
  ShieldCheck,
  Flame,
  Sliders,
  Check,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Smartphone,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Home,
  Info,
  ShieldAlert,
  Loader2,
  RefreshCw,
  XCircle,
  KeyRound
} from 'lucide-react';

interface BookingFlowProps {
  initialServiceId?: ServiceType;
  onNavigate: (page: Page) => void;
  onBookingComplete: (booking: BookingData) => void;
}

const STEPS = ['Service', 'Details', 'Schedule', 'Location', 'Review', 'Payment'];

async function readApiResponse(response: Response): Promise<any> {
  const raw = await response.text();
  let data: any;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    const contentType = response.headers.get('content-type') || 'unknown content type';
    const preview = raw.replace(/\s+/g, ' ').slice(0, 180);
    throw new Error(`The server returned an unexpected response (HTTP ${response.status}, ${contentType}). ${preview}`);
  }
  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed with HTTP ${response.status}.`);
  }
  return data;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  initialServiceId = 'home-cleaning',
  onNavigate,
  onBookingComplete
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Booking Form State
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceType>(initialServiceId);
  const [homeSize, setHomeSize] = useState('2 BR');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([
    'Degrease Kitchen Stovetop'
  ]);
  const [ecoUpgrade, setEcoUpgrade] = useState(true);
  const [fragranceFree, setFragranceFree] = useState(false);
  const [notes, setNotes] = useState('');

  // Schedule
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 9:00 AM');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:00 AM - 12:00 PM');

  // Location
  const [estate, setEstate] = useState(NAIROBI_ESTATES[0]);
  const [streetAddress, setStreetAddress] = useState('Ring Road, Kilimani');
  const [houseNumber, setHouseNumber] = useState('Apt 4B, Oasis Court');
  const [accessInstructions, setAccessInstructions] = useState('Gate code 1492, elevator to 4th floor.');
  const [customerName, setCustomerName] = useState('Wanjiku K.');
  const [phoneNumber, setPhoneNumber] = useState('0712 345 678');

  // Payment & Daraja STK
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('0712 345 678');
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'initiating' | 'awaiting_approval' | 'success' | 'failed' | 'cancelled'
  >('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string>('');
  const [activeOrderId, setActiveOrderId] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [credentialsNotice, setCredentialsNotice] = useState<{
    message: string;
    missing: string[];
    orderId?: string;
  } | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const pollTimerRef = React.useRef<any>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);

  React.useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, []);

  // Home size options
  const homeSizeOptions = [
    { label: 'Studio', priceMultiplier: 0.8 },
    { label: '1 BR', priceMultiplier: 0.9 },
    { label: '2 BR', priceMultiplier: 1.0 },
    { label: '3 BR', priceMultiplier: 1.25 },
    { label: '4+ BR', priceMultiplier: 1.5 },
  ];

  // Extra requirements options
  const extrasCatalog: { [key in ServiceType]?: { name: string; price: number }[] } = {
    'home-cleaning': [
      { name: 'Wash & Fold Basket of Clothes', price: 350 },
      { name: 'Iron & Steam Clothes (10 Garments)', price: 350 },
      { name: 'Fold & Organize Wardrobe Clothes', price: 250 },
      { name: 'Degrease Kitchen Stovetop & Hood', price: 400 },
      { name: 'Inside Refrigerator Deep Scrub', price: 450 },
      { name: 'Sanitize Balcony & Balustrades', price: 400 },
      { name: 'Interior Window Pane Polish', price: 350 },
    ],
    'laundry': [
      { name: 'Everyday Clothes Wash & Line Dry (Full Basket)', price: 350 },
      { name: 'Delicate Clothes & Handwash Care', price: 400 },
      { name: 'Steam Iron & Hang Washed Clothes', price: 350 },
      { name: 'Bed Linen & Towels Hot Wash', price: 400 },
      { name: 'Curtains & Heavy Drapes Wash', price: 600 },
      { name: 'Duvet & Comforter Deep Wash', price: 500 },
    ],
    'deep-cleaning': [
      { name: 'Sanitize & Organize Wardrobe Clothes', price: 400 },
      { name: 'Oven & Range Interior Restoration', price: 600 },
      { name: 'Tile Grout Power Scrub Machine', price: 600 },
      { name: 'Balcony Jet Scrubbing', price: 500 },
      { name: 'Full Chandelier Dusting', price: 450 },
    ],
    'ironing': [
      { name: 'Everyday Clothes Pressing (10 pcs)', price: 350 },
      { name: 'Executive Business Clothes & Shirts (10 pcs)', price: 400 },
      { name: 'Traditional Wear & Delicate Clothes', price: 450 },
      { name: 'Bedsheet & Duvet Crisp Pressing', price: 400 },
    ],
    'custom': [
      { name: 'Full Basket Clothes Wash, Dry & Fold', price: 450 },
      { name: 'Clothes Steam Ironing & Wardrobe Hanging', price: 400 },
      { name: 'Combined Laundry + Kitchen Deep Wash', price: 600 },
      { name: 'Full Pantry & Wardrobe Reorganization', price: 550 },
      { name: 'Patio & Compound Sweep', price: 400 },
    ]
  };

  const currentService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

  // Price Calculation
  const selectedSizeObj = homeSizeOptions.find((h) => h.label === homeSize) || homeSizeOptions[2];
  const basePrice = Math.round(currentService.priceAmount * selectedSizeObj.priceMultiplier);
  const availableExtras = extrasCatalog[selectedServiceId] || [];
  const extrasTotal = selectedExtras.reduce((sum, extraName) => {
    const item = availableExtras.find((e) => e.name === extraName);
    return sum + (item ? item.price : 400);
  }, 0);
  const ecoFee = ecoUpgrade ? 250 : 0;
  const totalPrice = basePrice + extrasTotal + ecoFee;

  const toggleExtra = (name: string) => {
    if (selectedExtras.includes(name)) {
      setSelectedExtras(selectedExtras.filter((e) => e !== name));
    } else {
      setSelectedExtras([...selectedExtras, name]);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setDirection('forward');
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setDirection('backward');
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const completeBooking = (receiptCode: string, cReqId?: string, ordId?: string) => {
    const newBooking: BookingData = {
      serviceId: selectedServiceId,
      homeSize,
      homeSizePrice: basePrice,
      selectedExtras,
      extrasTotal,
      ecoProducts: ecoUpgrade,
      notes,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      address: `${streetAddress}, ${houseNumber}`,
      estate,
      houseNumber,
      accessInstructions,
      customerName: customerName || 'Valued Homeowner',
      phoneNumber,
      paymentMethod,
      mpesaPhone,
      totalPrice,
      businessShortCode: '',
      orderId: ordId || activeOrderId,
      checkoutRequestId: cReqId || checkoutRequestId,
      mpesaReceiptNumber: receiptCode,
    };
    setConfirmedBooking(newBooking);
    setPaymentStatus('success');
    onBookingComplete(newBooking);
  };

  const startPolling = (cReqId: string, ordId: string) => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
    }
    setPollCount(0);

    pollTimerRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/mpesa/status/${encodeURIComponent(cReqId)}`);
        if (!res.ok) return;
        const data = await readApiResponse(res);

        if (data.status === 'SUCCESS' && data.mpesaReceiptNumber) {
          clearInterval(pollTimerRef.current);
          completeBooking(data.mpesaReceiptNumber, cReqId, ordId);
        } else if (data.status === 'CANCELLED') {
          clearInterval(pollTimerRef.current);
          setPaymentStatus('cancelled');
          setPaymentError('The transaction was cancelled on your mobile phone. You can retry anytime.');
        } else if (data.status === 'FAILED') {
          clearInterval(pollTimerRef.current);
          setPaymentStatus('failed');
          setPaymentError(data.resultDesc || 'Payment could not be completed on Safaricom network.');
        } else {
          setPollCount((prev) => prev + 1);
        }
      } catch (err) {
        // network polling retry
      }
    }, 2500);
  };

  const handleProcessPayment = async () => {
    setPaymentError(null);
    setCredentialsNotice(null);

    if (paymentMethod === 'card') {
      setPaymentStatus('idle');
      setPaymentError('Card payments are not connected yet. Please select M-Pesa to continue.');
      return;
    }

    // Validate phone number before sending
    const cleaned = mpesaPhone.replace(/\D/g, '');
    if (!/^(254|0)?(7|1)\d{8}$/.test(cleaned)) {
      setPaymentError('Please enter a valid Safaricom Kenyan phone number (e.g., 0712 345 678 or 0110 123 456).');
      return;
    }

    setPaymentStatus('initiating');

    try {
      // 1. Create order on server with trusted authoritative pricing (Requirement 8)
      const orderRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          homeSize,
          selectedExtras,
          ecoProducts: ecoUpgrade,
          notes,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          estate,
          streetAddress,
          houseNumber,
          accessInstructions,
          customerName: customerName || 'Valued Homeowner',
          phoneNumber: mpesaPhone,
        }),
      });

      if (!orderRes.ok) {
        const errData = await readApiResponse(orderRes);
        throw new Error(errData.error || 'Failed to initialize booking order.');
      }

      const { order } = await readApiResponse(orderRes);
      setActiveOrderId(order.id);

      // 2. Initiate STK Push via server
      const stkRes = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          phone: mpesaPhone,
        }),
      });

      let stkData: any;
      try {
        stkData = await readApiResponse(stkRes);
      } catch (error: any) {
        if (stkRes.status === 428) {
          setPaymentStatus('idle');
          setCredentialsNotice({
            message: error.message,
            missing: ['Check Daraja environment variables in Vercel'],
            orderId: order.id,
          });
          return;
        }
        throw error;
      }

      if (stkRes.status === 428 || stkData.error === 'MISSING_CREDENTIALS') {
        setPaymentStatus('idle');
        setCredentialsNotice({
          message: stkData.message || 'Safaricom Daraja credentials are not fully configured in server environment.',
          missing: stkData.missing || ['MPESA_CONSUMER_SECRET', 'MPESA_PASSKEY'],
          orderId: order.id,
        });
        return;
      }

      if (!stkRes.ok || !stkData.success) {
        throw new Error(stkData.message || 'Safaricom Daraja STK Push request could not be completed.');
      }

      // 3. Prompt accepted by Daraja -> await handset approval (Requirement 10)
      setCheckoutRequestId(stkData.checkoutRequestId);
      setPaymentStatus('awaiting_approval');
      startPolling(stkData.checkoutRequestId, order.id);

    } catch (err: any) {
      console.error('[Payment Error]:', err);
      setPaymentStatus('failed');
      setPaymentError(err.message || 'An error occurred while connecting to Safaricom Daraja.');
    }
  };

  // Dates for the schedule strip
  const scheduleDays = [
    { day: 'Tomorrow', date: 'Oct 7', available: true },
    { day: 'Thursday', date: 'Oct 8', available: true },
    { day: 'Friday', date: 'Oct 9', available: true },
    { day: 'Saturday', date: 'Oct 10', available: true },
    { day: 'Sunday', date: 'Oct 11', available: true },
    { day: 'Monday', date: 'Oct 12', available: true },
    { day: 'Tuesday', date: 'Oct 13', available: true },
  ];

  const timeSlots = [
    '08:00 AM - 11:00 AM (Early Morning)',
    '11:30 AM - 02:30 PM (Midday)',
    '03:00 PM - 06:00 PM (Afternoon)',
    '05:00 PM - 08:00 PM (Evening Arrival)'
  ];

  // Success view if confirmed
  if (paymentStatus === 'success' && confirmedBooking) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-gradient-to-b from-[#F0F7FF] via-white to-white flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-400">
          <div className="w-20 h-20 rounded-full bg-teal-50 text-[#14B8A6] mx-auto flex items-center justify-center ring-8 ring-teal-100/50">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#14B8A6] uppercase tracking-wider">
              Payment Successful
            </span>
            <h2 className="text-3xl font-extrabold text-[#0B1F4B]">
              Booking Confirmed!
            </h2>
            <p className="text-sm text-slate-600">
              Your Fua Fresh specialist will arrive at your residence on{' '}
              <span className="font-semibold text-[#0B1F4B]">{confirmedBooking.date}</span>.
            </p>
          </div>

          {/* Core reassurance badge */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-left flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1D4ED8] shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-[#0B1F4B]">
                Remember: We Come To You!
              </p>
              <p className="text-slate-600">
                You never need to pack, drop off, or travel. Keep your doors open and let our vetted professional do the work.
              </p>
            </div>
          </div>

          {/* Receipt details */}
          <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs space-y-2 border border-slate-200/60">
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500">Service:</span>
              <span className="font-semibold text-[#0B1F4B]">{currentService.name} ({homeSize})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500">Time Window:</span>
              <span className="font-semibold text-[#0B1F4B]">{selectedTimeSlot}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500">Location:</span>
              <span className="font-semibold text-[#0B1F4B]">{confirmedBooking.address}, {confirmedBooking.estate}</span>
            </div>
            {confirmedBooking.orderId && (
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Order Reference:</span>
                <span className="font-mono font-semibold text-[#0B1F4B]">{confirmedBooking.orderId}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500">M-Pesa Receipt:</span>
              <span className="font-mono font-bold text-emerald-700">{confirmedBooking.mpesaReceiptNumber || 'Awaiting receipt'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500">Business ShortCode:</span>
              <span className="font-mono font-bold text-[#0B1F4B]">{confirmedBooking.businessShortCode || 'Configured on server'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500">Checkout Request ID:</span>
              <span className="font-mono text-[10px] text-slate-600 truncate max-w-[200px]">{confirmedBooking.checkoutRequestId || '—'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500">Payment Channel:</span>
              <span className="font-semibold text-[#14B8A6]">Lipa na M-Pesa Online (STK)</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-bold text-[#0B1F4B]">
              <span>Total Paid:</span>
              <span className="tabular-nums">KES {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex-1 bg-[#1D4ED8] hover:bg-[#1e40af] text-white py-3.5 px-6 rounded-2xl text-sm font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              View Live Tracker in Dashboard
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="py-3.5 px-6 rounded-2xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-24 bg-gradient-to-b from-[#F0F7FF] via-[#F8FAFC] to-white">
      {/* Top Reminder Banner */}
      <div className="bg-[#0B1F4B] text-white py-2.5 px-4 text-center text-xs font-semibold tracking-wide border-b border-blue-900 sticky top-[68px] sm:top-[72px] z-30 shadow-xs">
        <span className="text-[#14B8A6] font-bold mr-2">✓</span>
        <span>REMINDER: We come to you. No drop-off, no pickup. Everything performed right in your home.</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Animated Progress Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs mb-8">
          <div className="flex items-center justify-between mb-3 text-xs font-bold">
            {STEPS.map((step, idx) => (
              <div
                key={step}
                className={`flex items-center gap-1.5 transition-colors ${
                  idx === currentStepIndex
                    ? 'text-[#1D4ED8]'
                    : idx < currentStepIndex
                    ? 'text-[#14B8A6]'
                    : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    idx < currentStepIndex
                      ? 'bg-teal-50 text-[#14B8A6] ring-1 ring-[#14B8A6]'
                      : idx === currentStepIndex
                      ? 'bg-[#1D4ED8] text-white ring-2 ring-blue-300'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {idx < currentStepIndex ? '✓' : idx + 1}
                </span>
                <span className="hidden sm:inline">{step}</span>
              </div>
            ))}
          </div>

          {/* Smooth line fill */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1D4ED8] via-[#3B82F6] to-[#14B8A6] transition-all duration-400 rounded-full"
              style={{
                width: `${((currentStepIndex) / (STEPS.length - 1)) * 100}%`,
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            />
          </div>
        </div>

        {/* Live Summary Bar (Sticky on Desktop) */}
        <div className="mb-6 flex items-center justify-between bg-blue-50/80 border border-blue-200/70 rounded-2xl p-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#1D4ED8]" />
            <span className="font-semibold text-[#0B1F4B]">
              Selected: <strong className="text-[#1D4ED8]">{currentService.name}</strong> ({homeSize})
            </span>
          </div>
          <div>
            <span className="text-slate-500 mr-2">Estimated:</span>
            <span className="text-base font-extrabold text-[#0B1F4B] tabular-nums">
              KES {totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* STEP CONTENT CONTAINER */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md transition-all duration-300">
          {/* STEP 1: SERVICE SELECTION */}
          {currentStepIndex === 0 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-[#0B1F4B]">
                  1. Choose Your In-Home Service
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-normal">
                  Our professional brings all necessary supplies to perform the work inside your home.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {SERVICES.map((srv) => {
                  const isSelected = selectedServiceId === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-[#1D4ED8] bg-blue-50/40 shadow-md scale-[1.01]'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                          style={{
                            backgroundColor: `${srv.hex}15`,
                            color: srv.hex
                          }}
                        >
                          {srv.id === 'home-cleaning' && <Sparkles className="w-5 h-5" />}
                          {srv.id === 'laundry' && <Shirt className="w-5 h-5" />}
                          {srv.id === 'deep-cleaning' && <ShieldCheck className="w-5 h-5" />}
                          {srv.id === 'ironing' && <Flame className="w-5 h-5" />}
                          {srv.id === 'custom' && <Sliders className="w-5 h-5" />}
                        </span>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center text-xs font-bold">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-[#0B1F4B] mb-1">
                        {srv.name}
                      </h4>
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                        {srv.description}
                      </p>
                      <span className="text-xs font-bold text-[#1D4ED8]">
                        {srv.startingPrice}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {currentStepIndex === 1 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-[#0B1F4B]">
                  2. Customize Household Details
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-normal">
                  Configure your residence scale and select targeted requirements.
                </p>
              </div>

              {/* Home Size Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                  Select Home Size
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {homeSizeOptions.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setHomeSize(opt.label)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold text-center border-2 transition-all cursor-pointer ${
                        homeSize === opt.label
                          ? 'border-[#1D4ED8] bg-blue-50 text-[#1D4ED8] shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra Requirements Checkboxes */}
              {availableExtras.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                    Targeted Add-on Focus Areas
                  </label>
                  <div className="space-y-2.5">
                    {availableExtras.map((extra) => {
                      const isChecked = selectedExtras.includes(extra.name);
                      return (
                        <div
                          key={extra.name}
                          onClick={() => toggleExtra(extra.name)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'border-blue-400 bg-blue-50/50'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                                isChecked
                                  ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-semibold text-[#0B1F4B]">
                                {extra.name}
                              </span>
                              {extra.name.toLowerCase().includes('clothes') && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#14B8A6] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                                  <Shirt className="w-3 h-3" />
                                  <span>Clothes Care</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-500 tabular-nums">
                            +KES {extra.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add-on Toggles */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                  Product Upgrades
                </label>
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#0B1F4B]">
                      Hypoallergenic Eco-Detergent Pack (+KES 250)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Plant-derived formulas safe for infants, puppies, and sensitive skin.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={ecoUpgrade}
                    onChange={(e) => setEcoUpgrade(e.target.checked)}
                    className="w-5 h-5 accent-[#1D4ED8] rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Special Notes Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                  Special Notes for Your Professional (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please wash laundry in cold cycle; iron delicate dresses first; dog is in the balcony..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#1D4ED8] transition-colors"
                />
              </div>
            </div>
          )}

          {/* STEP 3: SCHEDULE */}
          {currentStepIndex === 2 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-[#0B1F4B]">
                  3. Select Date & Arrival Time
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-normal">
                  Our professional will arrive at the beginning of your selected window.
                </p>
              </div>

              {/* Date strip */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                  Upcoming Available Days
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                  {scheduleDays.map((d) => {
                    const isSelected = selectedDate.includes(d.date);
                    return (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setSelectedDate(`${d.day}, ${d.date}`)}
                        className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#1D4ED8] bg-blue-50 text-[#1D4ED8] shadow-xs'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="block text-[11px] font-semibold text-slate-500">
                          {d.day}
                        </span>
                        <span className="block text-sm font-extrabold text-[#0B1F4B] mt-0.5">
                          {d.date}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slot chips */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                  Arrival Time Window
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <div
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#1D4ED8] bg-blue-50/50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className={`w-4 h-4 ${isSelected ? 'text-[#1D4ED8]' : 'text-slate-400'}`} />
                          <span className="text-xs sm:text-sm font-bold text-[#0B1F4B]">
                            {slot}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center text-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: LOCATION */}
          {currentStepIndex === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-[#0B1F4B]">
                  4. Your Kenyan Home Address
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-normal">
                  Remember: we travel to you. Please provide accurate estate & gate instructions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider">
                    Neighborhood / Estate
                  </label>
                  <select
                    value={estate}
                    onChange={(e) => setEstate(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-[#0B1F4B] focus:outline-none focus:border-[#1D4ED8]"
                  >
                    {NAIROBI_ESTATES.map((est) => (
                      <option key={est} value={est}>
                        {est}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider">
                    Road / Street
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. Dennis Pritt Road"
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider">
                    House / Apartment / Floor
                  </label>
                  <input
                    type="text"
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    placeholder="e.g. Block C, Apt 302"
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider">
                    Gate Code / Access Instructions
                  </label>
                  <input
                    type="text"
                    value={accessInstructions}
                    onChange={(e) => setAccessInstructions(e.target.value)}
                    placeholder="e.g. Ask security for Unit 4B, park in visitor slot 12"
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Wanjiku Kamau"
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider">
                    Contact Phone Number (For Cleaner Arrival)
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 0712 345 678"
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>
              </div>

              {/* Map Placeholder Graphic */}
              <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1D4ED8] flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0B1F4B] block">
                      Geocoded Destination: {estate}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Standard dispatch from Kilimani central logistics hub
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                  GPS Active
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW */}
          {currentStepIndex === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-[#0B1F4B]">
                  5. Review Your In-Home Booking
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-normal">
                  Confirm the details before proceeding to payment.
                </p>
              </div>

              {/* Section by section card */}
              <div className="space-y-4">
                {/* Service block */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Service</span>
                    <h4 className="text-sm font-bold text-[#0B1F4B]">
                      {currentService.name} · {homeSize}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {selectedExtras.length > 0 ? selectedExtras.join(', ') : 'Standard plan'}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStepIndex(1)}
                    className="text-xs font-bold text-[#1D4ED8] hover:underline"
                  >
                    Edit
                  </button>
                </div>

                {/* Schedule block */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Schedule</span>
                    <h4 className="text-sm font-bold text-[#0B1F4B]">
                      {selectedDate}
                    </h4>
                    <p className="text-xs text-slate-500">{selectedTimeSlot}</p>
                  </div>
                  <button
                    onClick={() => setCurrentStepIndex(2)}
                    className="text-xs font-bold text-[#1D4ED8] hover:underline"
                  >
                    Edit
                  </button>
                </div>

                {/* Location block */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Arrival Address</span>
                    <h4 className="text-sm font-bold text-[#0B1F4B]">
                      {houseNumber}, {streetAddress}
                    </h4>
                    <p className="text-xs text-slate-500">{estate}</p>
                  </div>
                  <button
                    onClick={() => setCurrentStepIndex(3)}
                    className="text-xs font-bold text-[#1D4ED8] hover:underline"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-200/70 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Base Rate ({homeSize}):</span>
                  <span className="font-semibold text-[#0B1F4B] tabular-nums">KES {basePrice.toLocaleString()}</span>
                </div>
                {extrasTotal > 0 && (
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Add-ons ({selectedExtras.length} items):</span>
                    <span className="font-semibold text-[#0B1F4B] tabular-nums">+KES {extrasTotal.toLocaleString()}</span>
                  </div>
                )}
                {ecoUpgrade && (
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Eco-friendly detergents:</span>
                    <span className="font-semibold text-[#0B1F4B] tabular-nums">+KES 250</span>
                  </div>
                )}
                <div className="pt-2 border-t border-blue-200 flex justify-between items-center text-sm font-extrabold text-[#0B1F4B]">
                  <span>Total Amount Due:</span>
                  <span className="text-lg text-[#1D4ED8] tabular-nums">KES {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PAYMENT */}
          {currentStepIndex === 5 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-[#0B1F4B]">
                  6. Payment Method
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-normal">
                  Safaricom M-Pesa is the preferred method across Kenya.
                </p>
              </div>

              {/* Method Tabs */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'mpesa'
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    M
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#0B1F4B] block">
                      M-Pesa STK Push
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Instant & Safe
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-slate-500" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#0B1F4B] block">
                      Debit / Credit Card
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Visa / Mastercard
                    </span>
                  </div>
                </div>
              </div>

              {/* Error banner */}
              {paymentError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold">M-Pesa Transaction Notice</p>
                    <p className="mt-0.5">{paymentError}</p>
                  </div>
                  <button
                    onClick={() => {
                      setPaymentError(null);
                      setPaymentStatus('idle');
                    }}
                    className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Server Credentials Notice */}
              {credentialsNotice && (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-start gap-3">
                    <KeyRound className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-amber-950">
                        Safaricom Daraja Configuration Required
                      </p>
                      <p className="text-amber-800">
                        {credentialsNotice.message}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-amber-200/80 font-mono text-[11px] text-amber-900 space-y-1">
                    <div>Order ID: <span className="font-bold">{credentialsNotice.orderId}</span> (Trusted Total: <span className="font-bold">KES {totalPrice.toLocaleString()}</span>)</div>
                    <div>Shortcode: <span className="font-bold">174379</span> (Sandbox)</div>
                    <div>Missing Secrets: <span className="font-bold text-rose-600">{credentialsNotice.missing.join(', ')}</span></div>
                  </div>
                  <p className="text-[11px] text-amber-700">
                    To test live STK push to your Kenyan phone number, add <code className="font-bold">MPESA_CONSUMER_SECRET</code> and <code className="font-bold">MPESA_PASSKEY</code> to your server-side environment secrets.
                  </p>
                </div>
              )}

              {/* Awaiting Handset Approval Live View */}
              {paymentStatus === 'awaiting_approval' ? (
                <div className="bg-emerald-50/70 border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 text-center space-y-5 animate-in zoom-in-95">
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
                    <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                      <Smartphone className="w-8 h-8 animate-bounce" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      STK Push Sent to Phone
                    </span>
                    <h4 className="text-xl font-extrabold text-[#0B1F4B]">
                      Approve on Your Handset
                    </h4>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      A prompt for <span className="font-bold text-[#0B1F4B]">KES {totalPrice.toLocaleString()}</span> was sent to <span className="font-bold text-emerald-800">{mpesaPhone}</span>.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-emerald-200 text-xs text-left space-y-1.5 shadow-2xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Checkout Request ID:</span>
                      <span className="font-mono font-semibold text-slate-800 truncate max-w-[190px]">{checkoutRequestId}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Network Status:</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Listening for callback...
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Business ShortCode:</span>
                      <span className="font-mono text-slate-700 font-bold">174379</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
                        setPaymentStatus('idle');
                      }}
                      className="text-xs font-bold text-slate-600 hover:text-rose-600 py-2 px-4 rounded-xl border border-slate-300 bg-white hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer"
                    >
                      Cancel or Change Number
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard M-Pesa / Card Input Form */
                paymentMethod === 'mpesa' ? (
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
                    {/* Official Daraja STK Push Badge */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#008751] text-white flex items-center justify-center font-black text-xs shadow-xs">
                          M
                        </div>
                        <div>
                          <span className="font-bold text-[#0B1F4B] block">
                            Lipa na M-Pesa Online (STK Push)
                          </span>
                          <span className="text-[10px] text-emerald-700 font-medium">
                            Safaricom Daraja API Active
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Business ShortCode</span>
                        <span className="font-mono font-bold text-xs text-[#008751] bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
                          174379
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                        Enter M-Pesa Registered Mobile Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={mpesaPhone}
                          onChange={(e) => setMpesaPhone(e.target.value)}
                          placeholder="07XX XXX XXX or 01XX XXX XXX"
                          className="w-full p-4 pl-12 rounded-xl border border-slate-300 text-base font-bold text-[#0B1F4B] tracking-wide focus:outline-none focus:border-emerald-500"
                        />
                        <Smartphone className="w-5 h-5 text-emerald-600 absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        Accepts Kenyan formats: <span className="font-medium">0712 345 678</span>, <span className="font-medium">0110 123 456</span>, or <span className="font-medium">2547XXXXXXXX</span>.
                      </span>
                    </div>

                    {/* Daraja Request Info */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Business ShortCode:</span>
                        <span className="font-mono text-[10px] font-semibold text-slate-700">174379 (CustomerPayBillOnline)</span>
                      </div>
                      <div className="space-y-1 text-slate-600 text-[11px]">
                        <p className="font-bold text-[#0B1F4B]">
                          How the STK Push Works:
                        </p>
                        <p>
                          1. Tap <strong className="text-emerald-700">"Pay with M-Pesa"</strong> below to send the payment prompt directly to your phone.
                        </p>
                        <p>
                          2. Approve the payment of KES {totalPrice.toLocaleString()} on your mobile phone.
                        </p>
                        <p>
                          3. Your in-home booking is confirmed immediately!
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0B1F4B] uppercase tracking-wider block">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="4000 1234 5678 9010"
                        className="w-full p-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="p-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="p-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* CONTROLS (BACK & CONTINUE / PAY WITH M-PESA) */}
          <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0 || paymentStatus === 'awaiting_approval' || paymentStatus === 'initiating'}
              className={`inline-flex items-center gap-2 text-sm font-semibold py-3 px-5 rounded-xl transition-all cursor-pointer ${
                currentStepIndex === 0 || paymentStatus === 'awaiting_approval' || paymentStatus === 'initiating'
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentStepIndex < STEPS.length - 1 ? (
              <button
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-sm font-bold py-3.5 px-8 rounded-xl shadow-md shadow-blue-600/30 hover:-translate-y-0.5 active:scale-[0.97] transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : paymentMethod === 'mpesa' ? (
              <button
                onClick={handleProcessPayment}
                disabled={paymentStatus === 'initiating' || paymentStatus === 'awaiting_approval'}
                className="inline-flex items-center gap-2.5 bg-[#008751] hover:bg-[#007043] text-white text-sm font-bold py-3.5 px-8 rounded-xl shadow-md shadow-emerald-600/30 hover:-translate-y-0.5 active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50"
              >
                {paymentStatus === 'initiating' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Initiating STK Push...</span>
                  </>
                ) : paymentStatus === 'awaiting_approval' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Awaiting Approval on Handset...</span>
                  </>
                ) : (
                  <>
                    <span className="w-5 h-5 rounded-full bg-white text-[#008751] flex items-center justify-center text-xs font-black">M</span>
                    <span>Pay with M-Pesa · KES {totalPrice.toLocaleString()}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleProcessPayment}
                disabled={paymentStatus === 'initiating'}
                className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-sm font-bold py-3.5 px-8 rounded-xl shadow-md shadow-blue-600/30 hover:-translate-y-0.5 active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50"
              >
                {paymentStatus === 'initiating' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Card Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Pay KES {totalPrice.toLocaleString()} with Card</span>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
