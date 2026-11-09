export type Page = 'home' | 'services' | 'how-it-works' | 'pricing' | 'professionals' | 'booking' | 'dashboard' | 'auth' | 'admin' | 'cleaner-portal';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer' | 'cleaner';
  avatar?: string;
  joinedAt: string;
  estate?: string;
  title?: string;
  // Cleaner specific profile fields
  cleanerStatus?: 'pending' | 'approved' | 'rejected';
  passportPhoto?: string;
  ruiruArea?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  refereeName?: string;
  refereePhone?: string;
  yearsLivingInRuiru?: string;
  specialty?: string;
  yearsExperience?: number;
  neighborhoods?: string[];
  idNumber?: string;
  goodConductCertified?: boolean;
  availability?: string;
  bio?: string;
  earningsTotal?: number;
  rating?: number;
  jobsCompletedCount?: number;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export type ServiceType = 'home-cleaning' | 'laundry' | 'deep-cleaning' | 'ironing' | 'custom';

export interface ServiceItem {
  id: ServiceType;
  name: string;
  tagline: string;
  description: string;
  accent: 'blue' | 'aqua' | 'lavender' | 'coral' | 'amber';
  hex: string;
  startingPrice: string;
  priceAmount: number;
  iconName: string;
  features: string[];
  durationEstimate: string;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  completedJobs: string;
  avatar: string;
  verified: boolean;
  yearsExperience: number;
  neighborhoods: string[];
  bio: string;
}

export interface BookingData {
  serviceId: ServiceType;
  homeSize: string;
  homeSizePrice: number;
  selectedExtras: string[];
  extrasTotal: number;
  ecoProducts: boolean;
  notes: string;
  date: string;
  timeSlot: string;
  address: string;
  estate: string;
  houseNumber: string;
  accessInstructions: string;
  customerName: string;
  phoneNumber: string;
  paymentMethod: 'mpesa' | 'card';
  mpesaPhone: string;
  totalPrice: number;
  mpesaReceiptNumber?: string;
  orderId?: string;
  checkoutRequestId?: string;
  businessShortCode?: string;
}

export type TrackerStage = 'confirmed' | 'assigned' | 'on_the_way' | 'arrived' | 'cleaning' | 'completed';
