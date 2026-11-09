import React, { useState, useEffect } from 'react';
import { Page, Professional } from '../types';
import { useAuth } from '../context/AuthContext';
import { PROFESSIONALS, NAIROBI_ESTATES } from '../data';
import {
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  Users,
  Sliders,
  Settings,
  LogOut,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
  X,
  ExternalLink,
  Shield,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  UserCheck,
  Eye,
  Check,
  Trash2,
  Menu,
  Camera,
  XCircle,
  UserPlus
} from 'lucide-react';

interface AdminPanelProps {
  onNavigate: (page: Page) => void;
}

type AdminTab = 'overview' | 'orders' | 'cleaner-applications' | 'payments' | 'specialists' | 'pricing' | 'settings';

export interface CleanerApplicationItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'cleaner';
  cleanerStatus?: 'pending' | 'approved' | 'rejected';
  passportPhoto?: string;
  avatar?: string;
  ruiruArea?: string;
  estate?: string;
  specialty?: string;
  yearsExperience?: number;
  neighborhoods?: string[];
  availability?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  refereeName?: string;
  refereePhone?: string;
  yearsLivingInRuiru?: string;
  goodConductCertified?: boolean;
  bio?: string;
  joinedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
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
  updatedAt: string;
}

interface PaymentItem {
  checkoutRequestId: string;
  merchantRequestId: string;
  orderId: string;
  amount: number;
  phoneNumber: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  resultCode?: number;
  resultDesc?: string;
  mpesaReceiptNumber?: string;
  transactionDate?: string;
  createdAt: string;
  completedAt?: string;
}

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  activeJobs: number;
  pendingPayment: number;
  totalPayments: number;
  serviceCounts: Record<string, number>;
  estateCounts: Record<string, number>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  const { currentUser, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data states
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // Filters
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Specialists state
  const [fleetList, setFleetList] = useState<Array<Professional & { available: boolean }>>(() => {
    return PROFESSIONALS.map((p, idx) => ({
      ...p,
      available: idx !== 1, // Brian on duty
    }));
  });

  // Cleaner Applications state
  const [cleanerApplications, setCleanerApplications] = useState<CleanerApplicationItem[]>([]);
  const [cleanerFilter, setCleanerFilter] = useState<'ALL' | 'pending' | 'approved' | 'rejected'>('ALL');
  const [cleanerSearchQuery, setCleanerSearchQuery] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<CleanerApplicationItem | null>(null);
  const [isProcessingCleaner, setIsProcessingCleaner] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, paymentsRes, statsRes, cleanersRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/payments'),
        fetch('/api/admin/stats'),
        fetch('/api/admin/cleaners'),
      ]);

      if (ordersRes.ok) {
        const { orders } = await ordersRes.json();
        setOrders(orders);
      }
      if (paymentsRes.ok) {
        const { payments } = await paymentsRes.json();
        setPayments(payments);
      }
      if (statsRes.ok) {
        const s = await statsRes.json();
        setStats(s);
      }
      if (cleanersRes.ok) {
        const { cleaners } = await cleanersRes.json();
        setCleanerApplications(cleaners);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveCleaner = async (cleanerId: string) => {
    setIsProcessingCleaner(cleanerId);
    try {
      const res = await fetch(`/api/admin/cleaners/${cleanerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          reviewerName: currentUser?.name || 'Wanjiku Mwangi (Operations)',
        }),
      });
      if (res.ok) {
        const { cleaner: updated } = await res.json();
        setCleanerApplications((prev) => prev.map((c) => (c.id === cleanerId ? updated : c)));
        if (selectedApplicant?.id === cleanerId) setSelectedApplicant(updated);
      }
    } catch (err) {
      console.error('Error approving cleaner:', err);
    } finally {
      setIsProcessingCleaner(null);
    }
  };

  const handleRejectCleaner = async (cleanerId: string, reason?: string) => {
    setIsProcessingCleaner(cleanerId);
    try {
      const res = await fetch(`/api/admin/cleaners/${cleanerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          rejectionReason: reason || 'Application did not meet current Ruiru fleet verification criteria',
          reviewerName: currentUser?.name || 'Wanjiku Mwangi (Operations)',
        }),
      });
      if (res.ok) {
        const { cleaner: updated } = await res.json();
        setCleanerApplications((prev) => prev.map((c) => (c.id === cleanerId ? updated : c)));
        if (selectedApplicant?.id === cleanerId) setSelectedApplicant(updated);
      }
    } catch (err) {
      console.error('Error declining cleaner application:', err);
    } finally {
      setIsProcessingCleaner(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderItem['status'], assignedPro?: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, ...(assignedPro !== undefined ? { assignedPro } : {}) }),
      });
      if (res.ok) {
        const { order: updated } = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updated);
        }
        fetchData();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to remove order ${orderId}?`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        if (selectedOrder?.id === orderId) setSelectedOrder(null);
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  const toggleSpecialistAvailability = (proId: string) => {
    setFleetList((prev) =>
      prev.map((pro) => (pro.id === proId ? { ...pro, available: !pro.available } : pro))
    );
  };

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const q = orderSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phoneNumber.includes(q) ||
      o.estate.toLowerCase().includes(q) ||
      o.serviceName.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Paid
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            <UserCheck className="w-3.5 h-3.5" />
            Assigned
          </span>
        );
      case 'ON_THE_WAY':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
            <Truck className="w-3.5 h-3.5" />
            On The Way
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            Completed
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            Processing
          </span>
        );
      case 'PENDING_PAYMENT':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Pending Payment
          </span>
        );
      case 'PAYMENT_FAILED':
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            {status === 'CANCELLED' ? 'Cancelled' : 'Failed'}
          </span>
        );
      default:
        return <span className="text-xs text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#0B1F4B] flex flex-col font-sans">
      {/* Top Bar Contract (Workspace Canvas) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-[#0B1F4B] rounded-lg border border-slate-200"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <button
              onClick={() => onNavigate('home')}
              className="font-bold text-[#0B1F4B] hover:text-[#1D4ED8] transition-colors"
            >
              Fua Fresh
            </button>
            <span>/</span>
            <span className="text-slate-600 font-medium">Operations Console</span>
            <span>/</span>
            <span className="text-[#1D4ED8] font-bold capitalize">{activeTab}</span>
          </div>
        </div>

        {/* Right Top Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            title="Refresh database records"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#1D4ED8]' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] hover:text-[#1e40af] bg-blue-50/70 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </button>

          {/* Profile & Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <img
              src={currentUser?.avatar || '/src/assets/images/admin_profile_avatar_1794216630303.jpg'}
              alt={currentUser?.name || 'Administrator'}
              className="w-8 h-8 rounded-full object-cover border border-slate-300"
              referrerPolicy="no-referrer"
            />
            <div className="hidden lg:block text-left text-xs leading-tight">
              <span className="font-bold text-[#0B1F4B] block">{currentUser?.name || 'Wanjiku Mwangi'}</span>
              <span className="text-[11px] text-slate-500">{currentUser?.title || 'Operations Director'}</span>
            </div>
            <button
              onClick={() => {
                signOut();
                onNavigate('auth');
              }}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (250px-260px) */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-5 space-y-6">
            {/* Brand Logo in Sidebar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1D4ED8] to-[#14B8A6] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-base font-extrabold text-[#0B1F4B] block leading-tight">
                    Fua Fresh
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Admin Portal · Kenya
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Sections */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1">
                Core Operations
              </span>

              <button
                onClick={() => {
                  setActiveTab('overview');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-blue-50 text-[#1D4ED8] font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B1F4B]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview Dashboard</span>
                </div>
                <span className="text-[10px] text-slate-400 tabular-nums">KPIs</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('orders');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-blue-50 text-[#1D4ED8] font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B1F4B]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className="w-4 h-4" />
                  <span>Bookings & Orders</span>
                </div>
                <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 tabular-nums">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('payments');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'payments'
                    ? 'bg-blue-50 text-[#1D4ED8] font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B1F4B]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4" />
                  <span>M-Pesa Daraja STK</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                  Live
                </span>
              </button>
            </div>

            <div className="space-y-1 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1">
                Fleet & Catalog
              </span>

              {/* Cleaner Applications Review Tab Button */}
              <button
                onClick={() => {
                  setActiveTab('cleaner-applications');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'cleaner-applications'
                    ? 'bg-amber-50 text-amber-900 border border-amber-200 font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B1F4B]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  <span>Cleaner Applications</span>
                </div>
                {cleanerApplications.filter((c) => c.cleanerStatus === 'pending').length > 0 ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                    {cleanerApplications.filter((c) => c.cleanerStatus === 'pending').length} pending
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    {cleanerApplications.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('specialists');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'specialists'
                    ? 'bg-blue-50 text-[#1D4ED8] font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B1F4B]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>Cleaners & Fleet</span>
                </div>
                <span className="text-[11px] text-slate-500 tabular-nums">{fleetList.length}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('pricing');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'pricing'
                    ? 'bg-blue-50 text-[#1D4ED8] font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B1F4B]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4" />
                  <span>Services & Pricing</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-blue-50 text-[#1D4ED8] font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B1F4B]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4" />
                  <span>Gateway & Daraja</span>
                </div>
              </button>
            </div>
          </div>

          {/* Sidebar Bottom Operational Status */}
          <div className="p-4 m-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">M-Pesa ShortCode:</span>
              <span className="font-mono font-bold text-slate-800">174379</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Environment:</span>
              <span className="font-mono font-semibold text-emerald-700">Sandbox</span>
            </div>
            <div className="pt-1 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Active Fleet:</span>
              <span className="font-semibold text-[#0B1F4B]">5 Verified Staff</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Headline */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#0B1F4B] tracking-tight">
                    Operations Overview
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Live operational metrics for home cleaning and laundry bookings across Nairobi.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#1D4ED8] hover:bg-[#1e40af] px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <span>Manage Dispatch</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4 Metric KPI Cards (Tabular Figures strictly enforced) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Revenue */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Revenue (Confirmed)
                  </span>
                  <div className="text-2xl font-extrabold text-[#0B1F4B] font-mono tabular-nums">
                    KES {(stats?.totalRevenue ?? 13865).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
                    <span>M-Pesa Daraja Verified</span>
                  </div>
                </div>

                {/* Total Bookings */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total In-Home Bookings
                  </span>
                  <div className="text-2xl font-extrabold text-[#0B1F4B] font-mono tabular-nums">
                    {orders.length}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                    <span>{orders.filter((o) => o.status === 'COMPLETED').length} Completed</span>
                    <span aria-hidden="true">·</span>
                    <span>{orders.filter((o) => ['ASSIGNED', 'ON_THE_WAY'].includes(o.status)).length} Active</span>
                  </div>
                </div>

                {/* Active Specialists */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Available Specialists
                  </span>
                  <div className="text-2xl font-extrabold text-[#0B1F4B] font-mono tabular-nums">
                    {fleetList.filter((f) => f.available).length} / {fleetList.length}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                    <span>Kilimani, Westlands, Lavington</span>
                  </div>
                </div>

                {/* On-Time Completion */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Customer Satisfaction
                  </span>
                  <div className="text-2xl font-extrabold text-[#0B1F4B] font-mono tabular-nums">
                    4.97 ★
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                    <span>From 980+ verified reviews</span>
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Recent Bookings & Nairobi Estate Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Recent Bookings Queue */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-[#0B1F4B]">
                        Recent Customer Bookings
                      </h2>
                      <p className="text-xs text-slate-500">
                        Latest arrival bookings scheduled across Nairobi.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-[#1D4ED8] hover:underline"
                    >
                      View All Orders ({orders.length}) →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Client</th>
                          <th className="py-3 px-4">Service</th>
                          <th className="py-3 px-4">Estate</th>
                          <th className="py-3 px-4 text-right">Amount (KES)</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                              {order.id}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-[#0B1F4B] block">{order.customerName}</span>
                              <span className="text-[11px] text-slate-500 font-mono">{order.phoneNumber}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-800">{order.serviceName}</span>
                              <span className="text-[11px] text-slate-400 block">{order.homeSize}</span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">
                              {order.estate.split(',')[0]}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                              {order.totalPrice.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4">
                              {getStatusBadge(order.status)}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setActiveTab('orders');
                                }}
                                className="text-xs font-bold text-[#1D4ED8] hover:underline"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Column: Nairobi Fleet Status & Estates */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Estate Distribution */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                    <h2 className="text-sm font-bold text-[#0B1F4B]">
                      Top Nairobi Booking Areas
                    </h2>
                    <div className="space-y-2 text-xs">
                      {['Kilimani', 'Westlands', 'Kileleshwa', 'Lavington', 'Karen', 'Runda'].map((est) => {
                        const count = orders.filter((o) => o.estate.toLowerCase().includes(est.toLowerCase())).length || 1;
                        return (
                          <div key={est} className="flex items-center justify-between py-1.5 border-b border-slate-50">
                            <span className="font-medium text-slate-700">{est}</span>
                            <span className="font-mono font-bold text-[#0B1F4B] bg-slate-100 px-2 py-0.5 rounded text-[11px] tabular-nums">
                              {count} bookings
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Safaricom M-Pesa Gateway Health */}
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                        M
                      </div>
                      <span className="font-bold text-xs text-emerald-950">
                        Safaricom Daraja API Active
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-900 space-y-1">
                      <div className="flex justify-between">
                        <span>ShortCode:</span>
                        <span className="font-mono font-bold">174379</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium">CustomerPayBillOnline</span>
                      </div>
                      <div className="flex justify-between">
                        <span>STK Push:</span>
                        <span className="font-semibold text-emerald-700">Healthy (200 OK)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS & ORDERS DISPATCH */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#0B1F4B] tracking-tight">
                    In-Home Bookings & Dispatch
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Manage real-time customer schedules, cleaner assignments, and completion states.
                  </p>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-4 justify-between">
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by ID, Name, Phone, Estate..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-[#0B1F4B] focus:outline-none focus:border-[#1D4ED8]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Status Segmented Buttons */}
                <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 rounded-xl">
                  {['ALL', 'PENDING_PAYMENT', 'PAID', 'ASSIGNED', 'ON_THE_WAY', 'COMPLETED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        statusFilter === st
                          ? 'bg-white text-[#0B1F4B] shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st === 'ALL' ? 'All Orders' : st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Data Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer & Contact</th>
                        <th className="py-3 px-4">Service & Plan</th>
                        <th className="py-3 px-4">Address / Estate</th>
                        <th className="py-3 px-4">Schedule</th>
                        <th className="py-3 px-4 text-right">Total (KES)</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Assigned Pro</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-slate-500">
                            No bookings match the current search or status filter.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                              {order.id}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-[#0B1F4B] block">{order.customerName}</span>
                              <span className="text-[11px] text-slate-500 font-mono">{order.phoneNumber}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-800 block">{order.serviceName}</span>
                              <span className="text-[11px] text-slate-400">{order.homeSize}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-medium text-slate-700 block">{order.estate.split(',')[0]}</span>
                              <span className="text-[11px] text-slate-400 truncate max-w-[130px] block">
                                {order.houseNumber || order.streetAddress || 'Doorstep arrival'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-medium text-slate-700 block">{order.date}</span>
                              <span className="text-[11px] text-slate-400">{order.timeSlot}</span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                              {order.totalPrice.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4">
                              {getStatusBadge(order.status)}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={order.assignedPro || ''}
                                onChange={(e) => handleUpdateOrderStatus(order.id, order.status, e.target.value)}
                                className="text-xs p-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
                              >
                                <option value="">Unassigned</option>
                                {fleetList.map((pro) => (
                                  <option key={pro.id} value={pro.name}>
                                    {pro.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="text-xs font-bold text-[#1D4ED8] hover:underline"
                              >
                                Detail
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="text-xs text-slate-400 hover:text-rose-600"
                                title="Remove Order"
                              >
                                <Trash2 className="w-3.5 h-3.5 inline" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: M-PESA DARAJA STK PUSH LOG */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#0B1F4B] tracking-tight">
                    Safaricom Daraja STK Push Transactions
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Audit log of M-Pesa Express pushes, CheckoutRequestIDs, and verified transaction receipts.
                  </p>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Checkout Request ID</th>
                        <th className="py-3 px-4">Order Ref</th>
                        <th className="py-3 px-4">Customer Handset</th>
                        <th className="py-3 px-4 text-right">Amount (KES)</th>
                        <th className="py-3 px-4">M-Pesa Receipt</th>
                        <th className="py-3 px-4">Result Status</th>
                        <th className="py-3 px-4">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-500">
                            No M-Pesa STK push transactions recorded yet.
                          </td>
                        </tr>
                      ) : (
                        payments.map((p) => (
                          <tr key={p.checkoutRequestId} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                              {p.checkoutRequestId}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-600">
                              {p.orderId}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-700">
                              {p.phoneNumber}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                              {p.amount.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-semibold text-emerald-800">
                              {p.mpesaReceiptNumber || '—'}
                            </td>
                            <td className="py-3.5 px-4">
                              {p.status === 'SUCCESS' ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  SUCCESS
                                </span>
                              ) : p.status === 'PENDING' ? (
                                <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
                                  <Clock className="w-3 h-3" />
                                  PENDING
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded text-[11px] border border-rose-200">
                                  <AlertCircle className="w-3 h-3" />
                                  {p.status}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                              {new Date(p.createdAt).toLocaleTimeString()} · {new Date(p.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CLEANER APPLICATIONS & APPROVAL QUEUE */}
          {activeTab === 'cleaner-applications' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      Ruiru Operations & Metro Hub
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {cleanerApplications.filter((c) => (c.cleanerStatus || 'pending') === 'pending').length} Pending Approval
                    </span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-[#0B1F4B] tracking-tight">
                    Ruiru Cleaner Applications & Approval Queue
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Review incoming onboarding dossiers from Ruiru specialists, verify passport photos & referees, and approve candidates for live booking dispatch.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchCleaners()}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh Queue
                  </button>
                </div>
              </div>

              {/* KPI Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
                  <span className="text-slate-400 text-xs font-medium block">Total Applications</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-[#0B1F4B] font-mono tabular-nums">
                      {cleanerApplications.length}
                    </span>
                    <span className="text-[11px] text-slate-500">all time</span>
                  </div>
                </div>

                <div className="bg-amber-50/50 rounded-2xl border border-amber-200/70 p-4 shadow-2xs">
                  <span className="text-amber-800 text-xs font-medium block flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    Pending Review
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-amber-700 font-mono tabular-nums">
                      {cleanerApplications.filter((c) => (c.cleanerStatus || 'pending') === 'pending').length}
                    </span>
                    <span className="text-[11px] text-amber-700/80">awaiting action</span>
                  </div>
                </div>

                <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200/70 p-4 shadow-2xs">
                  <span className="text-emerald-800 text-xs font-medium block">Approved Specialists</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-emerald-700 font-mono tabular-nums">
                      {cleanerApplications.filter((c) => c.cleanerStatus === 'approved').length}
                    </span>
                    <span className="text-[11px] text-emerald-700/80">active in dispatch</span>
                  </div>
                </div>

                <div className="bg-sky-50/50 rounded-2xl border border-sky-200/70 p-4 shadow-2xs">
                  <span className="text-sky-800 text-xs font-medium block">Ruiru & Kamakis Hub</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-sky-700 font-mono tabular-nums">
                      {cleanerApplications.filter((c) => c.ruiruArea || (c.coverageEstates && c.coverageEstates.some((e) => e.toLowerCase().includes('ruiru')))).length}
                    </span>
                    <span className="text-[11px] text-sky-700/80">local specialists</span>
                  </div>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((filterVal) => {
                    const count = filterVal === 'all' 
                      ? cleanerApplications.length 
                      : cleanerApplications.filter((c) => (c.cleanerStatus || 'pending') === filterVal).length;
                    return (
                      <button
                        key={filterVal}
                        onClick={() => setCleanerFilter(filterVal)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                          cleanerFilter === filterVal
                            ? 'bg-white text-[#0B1F4B] shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {filterVal === 'all' ? 'All Applicants' : filterVal}
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          cleanerFilter === filterVal ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/70 text-slate-600'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative min-w-[260px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={cleanerSearchQuery}
                    onChange={(e) => setCleanerSearchQuery(e.target.value)}
                    placeholder="Search by name, phone, Ruiru area..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0070BA]/20 focus:border-[#0070BA]"
                  />
                  {cleanerSearchQuery && (
                    <button
                      onClick={() => setCleanerSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Cleaners Applications Grid */}
              {cleanerApplications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-[#0B1F4B]">No cleaner applications yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    New cleaner applications submitted from the Join as Cleaner portal in Ruiru will appear here for verification and approval.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cleanerApplications
                    .filter((c) => {
                      const matchesStatus = cleanerFilter === 'all' || (c.cleanerStatus || 'pending') === cleanerFilter;
                      const matchesSearch = !cleanerSearchQuery || 
                        c.name.toLowerCase().includes(cleanerSearchQuery.toLowerCase()) ||
                        c.phone.toLowerCase().includes(cleanerSearchQuery.toLowerCase()) ||
                        c.email.toLowerCase().includes(cleanerSearchQuery.toLowerCase()) ||
                        (c.ruiruArea && c.ruiruArea.toLowerCase().includes(cleanerSearchQuery.toLowerCase()));
                      return matchesStatus && matchesSearch;
                    })
                    .map((applicant) => {
                      const status = applicant.cleanerStatus || 'pending';
                      const isProcessing = isProcessingCleaner === applicant.id;

                      return (
                        <div
                          key={applicant.id}
                          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all"
                        >
                          <div className="space-y-4">
                            {/* Applicant Header with Passport Photo */}
                            <div className="flex items-start gap-3">
                              <div
                                onClick={() => setSelectedApplicant(applicant)}
                                className="relative cursor-pointer group flex-shrink-0"
                                title="Click to view full passport photo"
                              >
                                {applicant.passportPhoto ? (
                                  <img
                                    src={applicant.passportPhoto}
                                    alt={applicant.name}
                                    className="w-14 h-14 rounded-xl object-cover border-2 border-slate-200 group-hover:border-[#0070BA] shadow-2xs transition-colors"
                                  />
                                ) : (
                                  <div className="w-14 h-14 rounded-xl bg-slate-100 border-2 border-slate-200 flex flex-col items-center justify-center text-slate-400">
                                    <Camera className="w-5 h-5 mb-0.5" />
                                    <span className="text-[8px] font-bold uppercase">No Photo</span>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                  <Eye className="w-4 h-4" />
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="font-extrabold text-sm text-[#0B1F4B] truncate block">
                                    {applicant.name}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                                  <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                  <a
                                    href={`tel:${applicant.phone}`}
                                    className="hover:text-[#0070BA] font-mono text-[11px] truncate"
                                  >
                                    {applicant.phone}
                                  </a>
                                </div>

                                {/* Status Tag */}
                                <div>
                                  {status === 'approved' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      Approved & Active
                                    </span>
                                  )}
                                  {status === 'pending' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                      <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                                      Pending Approval
                                    </span>
                                  )}
                                  {status === 'rejected' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                      <XCircle className="w-3 h-3 text-rose-600" />
                                      Declined
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Ruiru Location and Details */}
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2 text-xs">
                              <div className="flex items-start gap-1.5 text-slate-700">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-[#0B1F4B] block">
                                    {applicant.ruiruArea || 'Ruiru, Kiambu'}
                                  </span>
                                  {applicant.yearsLivingInRuiru && (
                                    <span className="text-[11px] text-slate-500">
                                      Resident for: <strong className="text-slate-700">{applicant.yearsLivingInRuiru}</strong>
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                                <div>
                                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Specialty</span>
                                  <span className="font-semibold text-slate-800 truncate block">
                                    {applicant.specialty || 'General Home Cleaning'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Experience</span>
                                  <span className="font-semibold text-slate-800 block">
                                    {applicant.experience ? `${applicant.experience} yrs` : '2+ years'}
                                  </span>
                                </div>
                              </div>

                              {/* Emergency Contact & Referee */}
                              {(applicant.emergencyContactName || applicant.refereeName) && (
                                <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px]">
                                  {applicant.emergencyContactName && (
                                    <div className="flex items-baseline justify-between text-slate-600">
                                      <span className="text-slate-400 text-[10px] uppercase font-bold">Next of Kin:</span>
                                      <span className="font-medium text-slate-800">
                                        {applicant.emergencyContactName} ({applicant.emergencyContactPhone || 'N/A'})
                                      </span>
                                    </div>
                                  )}
                                  {applicant.refereeName && (
                                    <div className="flex items-baseline justify-between text-slate-600">
                                      <span className="text-slate-400 text-[10px] uppercase font-bold">Referee:</span>
                                      <span className="font-medium text-slate-800">
                                        {applicant.refereeName} ({applicant.refereePhone || 'N/A'})
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Coverage Estates Tags */}
                              {applicant.coverageEstates && applicant.coverageEstates.length > 0 && (
                                <div className="pt-2 border-t border-slate-200/60">
                                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Coverage Areas</span>
                                  <div className="flex flex-wrap gap-1">
                                    {applicant.coverageEstates.slice(0, 3).map((estate, i) => (
                                      <span
                                        key={i}
                                        className="inline-block px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px] font-medium"
                                      >
                                        {estate}
                                      </span>
                                    ))}
                                    {applicant.coverageEstates.length > 3 && (
                                      <span className="text-[10px] text-slate-500 font-medium self-center">
                                        +{applicant.coverageEstates.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Good Conduct Check */}
                              <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 font-medium">
                                <Shield className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                                <span>Police Clearance / ID Check submitted</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-2 border-t border-slate-100 space-y-2">
                            {status === 'pending' && (
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleApproveCleaner(applicant.id)}
                                  disabled={isProcessing}
                                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
                                >
                                  {isProcessing ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5" />
                                  )}
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectCleaner(applicant.id)}
                                  disabled={isProcessing}
                                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Decline
                                </button>
                              </div>
                            )}

                            {status === 'approved' && (
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Ready for Booking Dispatch
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRejectCleaner(applicant.id)}
                                  disabled={isProcessing}
                                  className="text-[11px] text-slate-400 hover:text-rose-600 font-medium underline"
                                >
                                  Revoke
                                </button>
                              </div>
                            )}

                            {status === 'rejected' && (
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-rose-600">Application Declined</span>
                                <button
                                  type="button"
                                  onClick={() => handleApproveCleaner(applicant.id)}
                                  disabled={isProcessing}
                                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                                >
                                  Re-evaluate & Approve
                                </button>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => setSelectedApplicant(applicant)}
                              className="w-full text-center text-[11px] text-slate-500 hover:text-[#0070BA] font-medium py-1"
                            >
                              View Complete Dossier & Passport Photo →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Full Applicant Passport & Dossier Modal */}
              {selectedApplicant && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                          Ruiru Operations Dossier
                        </span>
                        <h2 className="text-lg font-black text-[#0B1F4B]">{selectedApplicant.name}</h2>
                      </div>
                      <button
                        onClick={() => setSelectedApplicant(null)}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Passport Photo Hero */}
                      <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                        {selectedApplicant.passportPhoto ? (
                          <div className="space-y-2 text-center">
                            <img
                              src={selectedApplicant.passportPhoto}
                              alt={selectedApplicant.name}
                              className="w-36 h-36 rounded-2xl object-cover border-4 border-white shadow-md mx-auto"
                            />
                            <span className="text-xs font-bold text-slate-500 block">
                              Official Passport Photo
                            </span>
                          </div>
                        ) : (
                          <div className="w-32 h-32 rounded-2xl bg-slate-200 flex flex-col items-center justify-center text-slate-400">
                            <Camera className="w-8 h-8 mb-1" />
                            <span className="text-xs font-bold">No Photo Provided</span>
                          </div>
                        )}
                      </div>

                      {/* Dossier Information List */}
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-400 font-medium">Status</span>
                          <span className="font-bold text-[#0B1F4B] capitalize">
                            {selectedApplicant.cleanerStatus || 'pending'}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-400 font-medium">Phone Number</span>
                          <a href={`tel:${selectedApplicant.phone}`} className="font-mono font-bold text-[#0070BA]">
                            {selectedApplicant.phone}
                          </a>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-400 font-medium">Email Address</span>
                          <span className="font-medium text-slate-700">{selectedApplicant.email}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-400 font-medium">Ruiru Residence Zone</span>
                          <span className="font-bold text-emerald-800">
                            {selectedApplicant.ruiruArea || 'Ruiru, Kiambu'}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-400 font-medium">Years Living in Ruiru</span>
                          <span className="font-semibold text-slate-700">
                            {selectedApplicant.yearsLivingInRuiru || 'Not specified'}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-400 font-medium">Next of Kin / Emergency</span>
                          <span className="font-semibold text-slate-800">
                            {selectedApplicant.emergencyContactName || 'N/A'} ({selectedApplicant.emergencyContactPhone || 'N/A'})
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-400 font-medium">Professional Referee</span>
                          <span className="font-semibold text-slate-800">
                            {selectedApplicant.refereeName || 'N/A'} ({selectedApplicant.refereePhone || 'N/A'})
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-400 font-medium">Specialty & Skills</span>
                          <span className="font-semibold text-slate-800">
                            {selectedApplicant.specialty || 'Home Cleaning & Laundry'}
                          </span>
                        </div>
                        {selectedApplicant.coverageEstates && (
                          <div className="py-2 border-b border-slate-100">
                            <span className="text-slate-400 font-medium block mb-1">Preferred Coverage Estates</span>
                            <div className="flex flex-wrap gap-1">
                              {selectedApplicant.coverageEstates.map((e, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                                >
                                  {e}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Modal Actions */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleApproveCleaner(selectedApplicant.id);
                            setSelectedApplicant(null);
                          }}
                          className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Approve Cleaner for Ruiru Dispatch
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleRejectCleaner(selectedApplicant.id);
                            setSelectedApplicant(null);
                          }}
                          className="py-2.5 px-4 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SPECIALISTS & FLEET */}
          {activeTab === 'specialists' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-[#0B1F4B] tracking-tight">
                  Nairobi Specialists & Fleet Roster
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Verified in-home professionals for cleaning, laundry, and delicate wardrobe pressing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fleetList.map((pro) => (
                  <div
                    key={pro.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={pro.avatar}
                            alt={pro.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-sm text-[#0B1F4B] block">{pro.name}</span>
                            <span className="text-xs text-slate-500">{pro.specialty}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Rating</span>
                          <span className="font-bold text-[#0B1F4B] font-mono tabular-nums">{pro.rating} ★</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Experience</span>
                          <span className="font-bold text-[#0B1F4B]">{pro.yearsExperience} Years</span>
                        </div>
                      </div>

                      <div className="text-xs">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                          Covered Neighborhoods
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {pro.neighborhoods.map((n) => (
                            <span
                              key={n}
                              className="text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Dispatch availability toggle */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Availability Status:</span>
                      <button
                        type="button"
                        onClick={() => toggleSpecialistAvailability(pro.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          pro.available
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {pro.available ? '● Available for Dispatch' : '○ On Duty / Busy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SERVICES & PRICING INSPECTOR */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-[#0B1F4B] tracking-tight">
                  Services & Pricing Architecture
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Trusted server-side pricing catalog, apartment size multipliers, and extras calculation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Services Base Pricing */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <h2 className="text-base font-bold text-[#0B1F4B]">
                    Service Base Pricing (Standard 2 BR Baseline)
                  </h2>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-800">Home Cleaning</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">KES 800</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-800">Laundry (Wash, Dry & Fold)</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">KES 350</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-800">Deep Cleaning (Move-In / Post-Reno)</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">KES 1,000</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-800">Ironing (Steam Pressing)</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">KES 1,000</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-800">Custom Housekeeping Package</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">KES 2,500</span>
                    </div>
                  </div>
                </div>

                {/* Apartment Size Multipliers */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <h2 className="text-base font-bold text-[#0B1F4B]">
                    Apartment Size Multipliers
                  </h2>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-800">Studio</span>
                      <span className="font-mono text-slate-600 font-bold">0.80x Multiplier</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-800">1 Bedroom (Compact)</span>
                      <span className="font-mono text-slate-600 font-bold">0.90x Multiplier</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-800">2 Bedroom (Standard)</span>
                      <span className="font-mono text-slate-600 font-bold">1.00x (Baseline)</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-800">3 Bedroom (Family)</span>
                      <span className="font-mono text-slate-600 font-bold">1.25x Multiplier</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-800">4+ Bedroom (Villa / Maisonette)</span>
                      <span className="font-mono text-slate-600 font-bold">1.50x Multiplier</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS & DARAJA GATEWAY */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-[#0B1F4B] tracking-tight">
                  Safaricom Daraja API Gateway
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Integration settings, credentials readiness, and webhook endpoints for Lipa na M-Pesa.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5 max-w-3xl">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    M
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#0B1F4B]">
                      Safaricom Daraja STK Push Configuration
                    </h2>
                    <span className="text-xs text-slate-500">
                      Sandbox Paybill / Till Number Integration
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold text-[10px] uppercase">Business ShortCode</span>
                    <span className="font-mono font-bold text-[#0B1F4B] block text-sm">174379</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold text-[10px] uppercase">Transaction Type</span>
                    <span className="font-mono font-bold text-[#0B1F4B] block text-sm">CustomerPayBillOnline</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold text-[10px] uppercase">Environment</span>
                    <span className="font-mono font-bold text-emerald-700 block text-sm">sandbox</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold text-[10px] uppercase">Party B (Receiver)</span>
                    <span className="font-mono font-bold text-[#0B1F4B] block text-sm">174379</span>
                  </div>
                </div>

                <div className="space-y-1 pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Callback Webhook Endpoint</span>
                  <div className="p-3 bg-slate-50 rounded-xl font-mono text-[11px] text-slate-700 border border-slate-200 break-all select-all">
                    {window.location.origin}/api/mpesa/callback
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    Receives M-Pesa STK results asynchronously from Safaricom.
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Order Detail Modal Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Booking Reference
                </span>
                <h3 className="text-lg font-mono font-extrabold text-[#0B1F4B]">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Customer</span>
                  <span className="font-bold text-sm text-[#0B1F4B]">{selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Contact Phone</span>
                  <span className="font-mono font-bold text-[#0B1F4B]">{selectedOrder.phoneNumber}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Arrival Location</span>
                <span className="font-semibold text-slate-800 block">
                  {selectedOrder.houseNumber}, {selectedOrder.streetAddress}
                </span>
                <span className="text-slate-500 block">{selectedOrder.estate}</span>
                {selectedOrder.accessInstructions && (
                  <p className="text-[11px] text-slate-600 italic pt-1 border-t border-slate-200">
                    "Note: {selectedOrder.accessInstructions}"
                  </p>
                )}
              </div>

              {/* Service & Price */}
              <div className="p-3 bg-blue-50/60 rounded-xl space-y-1 text-slate-800">
                <div className="flex justify-between">
                  <span className="font-semibold">{selectedOrder.serviceName} ({selectedOrder.homeSize}):</span>
                  <span className="font-mono font-bold">KES {selectedOrder.basePrice.toLocaleString()}</span>
                </div>
                {selectedOrder.selectedExtras.length > 0 && (
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>Add-ons ({selectedOrder.selectedExtras.join(', ')}):</span>
                    <span className="font-mono font-bold">+KES {selectedOrder.extrasTotal.toLocaleString()}</span>
                  </div>
                )}
                {selectedOrder.ecoProducts && (
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>Eco detergents:</span>
                    <span className="font-mono font-bold">+KES {selectedOrder.ecoFee}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-blue-200 flex justify-between font-bold text-sm text-[#0B1F4B]">
                  <span>Total Amount Due:</span>
                  <span className="font-mono text-[#1D4ED8]">KES {selectedOrder.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Status & Assignment Controller */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dispatch Status Actions
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'ASSIGNED')}
                    className="py-2 px-3 text-xs font-bold rounded-lg bg-blue-50 text-[#1D4ED8] hover:bg-blue-100 transition-colors"
                  >
                    Mark Assigned
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'ON_THE_WAY')}
                    className="py-2 px-3 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    Mark On The Way
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'COMPLETED')}
                    className="py-2 px-3 text-xs font-bold rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 transition-colors"
                  >
                    Mark Completed
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'PAID')}
                    className="py-2 px-3 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
                  >
                    Mark Paid
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-2 px-5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
