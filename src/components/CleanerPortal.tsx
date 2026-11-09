import React, { useState, useEffect } from 'react';
import { Page, Professional } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Calendar,
  Check,
  Truck,
  ArrowRight,
  RefreshCw,
  LogOut,
  User,
  DollarSign,
  AlertCircle,
  Award,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface CleanerPortalProps {
  onNavigate: (page: Page) => void;
}

interface OrderItem {
  id: string;
  serviceId: string;
  serviceName: string;
  homeSize: string;
  basePrice: number;
  selectedExtras: string[];
  extrasTotal: number;
  ecoProducts: boolean;
  ecoFee: number;
  totalPrice: number;
  date: string;
  timeSlot: string;
  estate: string;
  streetAddress: string;
  houseNumber: string;
  accessInstructions?: string;
  customerName: string;
  phoneNumber: string;
  status: 'PENDING_PAYMENT' | 'PROCESSING' | 'PAID' | 'ASSIGNED' | 'ON_THE_WAY' | 'COMPLETED' | 'PAYMENT_FAILED' | 'CANCELLED';
  assignedPro?: string;
  checkoutRequestId?: string;
  mpesaReceiptNumber?: string;
  failureReason?: string;
  createdAt: string;
}

export const CleanerPortal: React.FC<CleanerPortalProps> = ({ onNavigate }) => {
  const { currentUser, signOut } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'jobs' | 'earnings' | 'profile'>('jobs');
  const [selectedJob, setSelectedJob] = useState<OrderItem | null>(null);

  const cleanerName = currentUser?.name || 'Mercy Wambui';

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching cleaner jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateJobStatus = async (orderId: string, newStatus: OrderItem['status']) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, assignedPro: cleanerName }),
      });
      if (res.ok) {
        const { order: updated } = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        if (selectedJob && selectedJob.id === orderId) {
          setSelectedJob(updated);
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleClaimJob = async (orderId: string) => {
    await handleUpdateJobStatus(orderId, 'ASSIGNED');
  };

  // Cleaner's personal jobs
  const myAssignedJobs = orders.filter(
    (o) => o.assignedPro === cleanerName || o.assignedPro?.toLowerCase() === cleanerName.toLowerCase()
  );

  // Available open jobs in Nairobi that need assignment
  const openAvailableJobs = orders.filter(
    (o) => (!o.assignedPro || o.assignedPro === 'Unassigned') && ['PAID', 'PENDING_PAYMENT'].includes(o.status)
  );

  const completedCount = myAssignedJobs.filter((o) => o.status === 'COMPLETED').length + (currentUser?.jobsCompletedCount || 12);
  const estimatedEarnings = myAssignedJobs
    .filter((o) => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + Math.round(o.totalPrice * 0.75), 0) + (currentUser?.earningsTotal || 18450);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-teal-50/40 via-white to-slate-50 text-[#0B1F4B] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Cleaner Portal Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar || '/src/assets/images/fua_pro_mercy_1791328985938.jpg'}
              alt={cleanerName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4B]">
                  {cleanerName}
                </h1>
                <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  Verified Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {currentUser?.specialty || 'Home Cleaning & Eco-Sanitization'} · {currentUser?.estate || 'Kilimani, Nairobi'}
              </p>
            </div>
          </div>

          {/* Availability Toggle & Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                isAvailable
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {isAvailable ? '● Available for Jobs' : '○ On Duty / Busy'}
            </button>

            <button
              onClick={() => {
                signOut();
                onNavigate('auth');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-rose-600 px-3 py-2 rounded-lg border border-slate-200 bg-white"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              M-Pesa Payout Balance
            </span>
            <div className="text-2xl font-extrabold text-teal-800 font-mono tabular-nums">
              KES {estimatedEarnings.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block">
              Direct to {currentUser?.phone || '0712 345 678'}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Assigned Active Jobs
            </span>
            <div className="text-2xl font-extrabold text-[#0B1F4B] font-mono tabular-nums">
              {myAssignedJobs.filter((o) => ['ASSIGNED', 'ON_THE_WAY'].includes(o.status)).length} Active
            </div>
            <span className="text-[11px] text-slate-500 block">
              In your neighborhood
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Homes Cleaned & Verified
            </span>
            <div className="text-2xl font-extrabold text-[#0B1F4B] font-mono tabular-nums">
              {completedCount} Homes
            </div>
            <span className="text-[11px] text-slate-500 block">
              100% in-home service
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Specialist Rating
            </span>
            <div className="text-2xl font-extrabold text-[#0B1F4B] font-mono tabular-nums">
              4.98 ★
            </div>
            <span className="text-[11px] text-teal-700 font-semibold block">
              Top 5% in Nairobi
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Jobs vs Earnings vs Profile) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-md">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'jobs'
                ? 'bg-white text-[#0B1F4B] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Assigned Jobs ({myAssignedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'earnings'
                ? 'bg-white text-[#0B1F4B] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Earnings & Payouts
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-[#0B1F4B] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Fleet Profile
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: MY ASSIGNED JOBS & DISPATCH QUEUE                 */}
        {/* ======================================================== */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0B1F4B]">
                  Your Scheduled In-Home Visits
                </h2>
                <p className="text-xs text-slate-500">
                  Update your arrival status as you travel to the client's residence.
                </p>
              </div>

              <button
                onClick={fetchOrders}
                className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#1D4ED8]' : ''}`} />
                <span>Refresh Queue</span>
              </button>
            </div>

            {/* List of cleaner's active jobs */}
            {myAssignedJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0B1F4B]">
                    No Active Jobs Right Now
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    You have finished your active schedule. Browse available bookings below or wait for automatic dispatch in {currentUser?.estate || 'Kilimani'}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myAssignedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                            {job.id}
                          </span>
                          <h4 className="text-base font-extrabold text-[#0B1F4B]">
                            {job.customerName}
                          </h4>
                          <span className="text-xs font-semibold text-slate-700 block">
                            {job.serviceName} · {job.homeSize}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                          job.status === 'COMPLETED'
                            ? 'bg-teal-50 text-teal-800 border-teal-200'
                            : job.status === 'ON_THE_WAY'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Location & Time */}
                      <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-xs">
                        <div className="flex items-center gap-2 text-slate-700 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{job.houseNumber}, {job.streetAddress || job.estate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{job.date} · {job.timeSlot}</span>
                        </div>
                        {job.accessInstructions && (
                          <div className="pt-1 text-[11px] text-slate-600 italic border-t border-slate-200/80">
                            Access: "{job.accessInstructions}"
                          </div>
                        )}
                      </div>

                      {/* Financial share */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-500">Cleaner Payout (75%):</span>
                        <span className="font-mono font-bold text-emerald-800 text-sm">
                          KES {Math.round(job.totalPrice * 0.75).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Step Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                      {job.status !== 'ON_THE_WAY' && job.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleUpdateJobStatus(job.id, 'ON_THE_WAY')}
                          className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Mark On The Way</span>
                        </button>
                      )}

                      {job.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleUpdateJobStatus(job.id, 'COMPLETED')}
                          className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-teal-700 text-white hover:bg-teal-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Mark Completed</span>
                        </button>
                      )}

                      <a
                        href={`tel:${job.phoneNumber}`}
                        className="py-2 px-3 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call Client</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Open / Unassigned Jobs Available in Nairobi */}
            {openAvailableJobs.length > 0 && (
              <div className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-[#0B1F4B]">
                      Open Bookings Looking for Cleaners
                    </h3>
                    <p className="text-xs text-slate-500">
                      Unassigned client bookings in Nairobi you can claim.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {openAvailableJobs.map((openJob) => (
                    <div
                      key={openJob.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-[10px] text-slate-400 font-bold">{openJob.id}</span>
                          <span className="text-[11px] font-bold text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded">
                            Open Job
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-[#0B1F4B] mt-1">{openJob.serviceName}</h4>
                        <span className="text-xs text-slate-500 block">{openJob.estate} · {openJob.date}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-mono font-bold text-emerald-800 text-xs">
                          Payout: KES {Math.round(openJob.totalPrice * 0.75).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleClaimJob(openJob.id)}
                          className="py-1.5 px-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-2xs transition-colors"
                        >
                          Accept Job
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: EARNINGS & PAYOUTS                                */}
        {/* ======================================================== */}
        {activeTab === 'earnings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#0B1F4B]">
                Earnings & M-Pesa Weekly Disbursements
              </h2>
              <p className="text-xs text-slate-500">
                You receive 75% of every completed in-home booking directly to your registered Safaricom mobile phone.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-950 uppercase">Payout Destination</span>
                <span className="font-mono font-bold text-emerald-800 text-sm">
                  {currentUser?.phone || '0712 345 678'} (M-Pesa)
                </span>
              </div>
              <p className="text-[11px] text-emerald-900">
                Automatic disbursements occur every Monday morning and Friday evening at 5:00 PM EAT.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Recent Completed Cleaning Earnings
              </span>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#0B1F4B] block">Deep Cleaning · Villa 12, Westlands</span>
                    <span className="text-slate-400 text-[11px]">Completed yesterday · Ref: QJH834BM99</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 text-sm">+KES 2,025</span>
                </div>

                <div className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#0B1F4B] block">Laundry & Pressing · Mandera Rd, Kileleshwa</span>
                    <span className="text-slate-400 text-[11px]">Completed Oct 17 · Ref: QJG411PR22</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 text-sm">+KES 798</span>
                </div>

                <div className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#0B1F4B] block">Home Cleaning · Silver Oak, Kilimani</span>
                    <span className="text-slate-400 text-[11px]">Completed Oct 15 · Ref: QJH910XK01</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 text-sm">+KES 1,350</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CLEANER FLEET PROFILE                             */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#0B1F4B]">
                Your Fleet Credentials & Specialty
              </h2>
              <p className="text-xs text-slate-500">
                Information visible to the dispatch coordinator and clients for matching in-home jobs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Specialty</span>
                <span className="font-bold text-sm text-[#0B1F4B]">
                  {currentUser?.specialty || 'Home Cleaning & Eco-Sanitization'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Experience</span>
                <span className="font-bold text-sm text-[#0B1F4B]">
                  {currentUser?.yearsExperience || 5} Years Professional Housekeeping
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Good Conduct Certificate</span>
                <span className="font-semibold text-emerald-700 block">
                  ✓ Verified by Directorate of Criminal Investigations (DCI)
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Base Working Area</span>
                <span className="font-bold text-slate-800 block">
                  {currentUser?.estate || 'Kilimani & Westlands, Nairobi'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Professional Bio & Client Note
              </span>
              <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl leading-relaxed italic">
                "{currentUser?.bio || 'Certified hospitality specialist passionate about creating serene, impeccably organized home environments with child-safe eco detergents.'}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
