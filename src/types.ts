export type Page = 'home' | 'services' | 'how-it-works' | 'pricing' | 'professionals' | 'booking' | 'dashboard';

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
}

export type TrackerStage = 'confirmed' | 'assigned' | 'on_the_way' | 'arrived' | 'cleaning' | 'completed';
