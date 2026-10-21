import { ServiceItem, Professional } from './types';

export const SERVICES: ServiceItem[] = [
  {
    id: 'home-cleaning',
    name: 'Home Cleaning',
    tagline: 'Standard Housekeeping',
    description: 'Professional cleaning performed right inside your home. Kitchen, bedrooms, living spaces, and bathroom sanitization.',
    accent: 'blue',
    hex: '#1D4ED8',
    startingPrice: 'Starting from KES 800',
    priceAmount: 800,
    iconName: 'Sparkles',
    durationEstimate: '2.5 - 3.5 hrs',
    features: [
      'Dusting and surface sanitization throughout all rooms',
      'Vacuuming and wet-mopping floors with eco-solutions',
      'Kitchen counters, stovetop degreasing & sink polish',
      'Bathroom disinfection, tile scrub & mirror polishing',
      'Trash removal and fresh bed making'
    ]
  },
  {
    id: 'laundry',
    name: 'Laundry',
    tagline: 'Wash, Line Dry & Fold',
    description: 'Washed, dried, and folded inside your home. We use your laundry machines or hand-wash station on-site.',
    accent: 'aqua',
    hex: '#14B8A6',
    startingPrice: 'Starting from KES 350',
    priceAmount: 350,
    iconName: 'Shirt',
    durationEstimate: '2 - 3 hrs',
    features: [
      'Fabric sorting by color, delicate fibers & wash temperatures',
      'Hand washing or machine wash cycle monitoring',
      'Air-dry hanging on your lines or balcony racks',
      'Crisp folding and sorting into your custom wardrobe baskets',
      'Stain pre-treatment with gentle fabric-safe agents'
    ]
  },
  {
    id: 'deep-cleaning',
    name: 'Deep Cleaning',
    tagline: 'Intensive Revival',
    description: 'Comprehensive high-detail sanitization for move-ins, move-outs, post-renovation, or seasonal spring resets.',
    accent: 'lavender',
    hex: '#A78BFA',
    startingPrice: 'Starting from KES 1,000',
    priceAmount: 1000,
    iconName: 'ShieldCheck',
    durationEstimate: '4 - 6 hrs',
    features: [
      'Deep grout scrub, descaling shower heads and fixtures',
      'Inside oven, microwave, and refrigerator scrub',
      'Baseboards, door frames, switches, and high vents dusted',
      'Under-furniture and behind heavy appliances detail work',
      'Window panes, sliding glass tracks, and window sills'
    ]
  },
  {
    id: 'ironing',
    name: 'Ironing',
    tagline: 'Crisp Press & Steam',
    description: 'Expert steam pressing and folding right at your ironing station. Work shirts, linens, trousers and delicate fabrics.',
    accent: 'coral',
    hex: '#FF6B5E',
    startingPrice: 'Starting from KES 1,000',
    priceAmount: 1000,
    iconName: 'Flame',
    durationEstimate: '1.5 - 2.5 hrs',
    features: [
      'Precise temperature tuning for silk, linen, cotton & wool',
      'Crisp collar, cuff, and pleat alignment',
      'Hanging in closets or smooth boutique-style folding',
      'Bed sheet and duvet cover steaming',
      'Garment inspection for loose threads or button care'
    ]
  },
  {
    id: 'custom',
    name: 'Custom Service',
    tagline: 'Bespoke In-Home Package',
    description: 'Tailored housekeeping adapted to your household routine, combining cleaning, laundry, organization and meal prep cleanup.',
    accent: 'amber',
    hex: '#FBBF24',
    startingPrice: 'Starting from KES 2,500',
    priceAmount: 2500,
    iconName: 'Sliders',
    durationEstimate: 'Custom duration',
    features: [
      'Mix and match home cleaning, laundry & wardrobe sorting',
      'Specialized attention for patio, verandas, or compound entries',
      'Organization of pantry, kids playrooms, or closets',
      'Flexible hourly schedule adapted to your Nairobi home routine',
      'Dedicated primary professional for recurring visits'
    ]
  }
];

export const NAIROBI_ESTATES = [
  'Kilimani, Nairobi',
  'Kileleshwa, Nairobi',
  'Westlands, Nairobi',
  'Lavington, Nairobi',
  'Karen, Nairobi',
  'Runda, Nairobi',
  'Riverside, Nairobi',
  'Parklands, Nairobi',
  'South C, Nairobi',
  'Langata, Nairobi',
  'Muthaiga, Nairobi',
  'Spring Valley, Nairobi',
  'Gigiri, Nairobi',
  'South B, Nairobi',
  'Syokimau, Machakos/Nairobi border',
  'Ngong Road / Jamhuri, Nairobi'
];

export const PROFESSIONALS: Professional[] = [
  {
    id: 'pro-1',
    name: 'Mercy Wambui',
    specialty: 'Home Cleaning & Eco-Sanitization',
    rating: 4.98,
    reviewsCount: 312,
    completedJobs: '540+ homes (placeholder)',
    avatar: '/src/assets/images/fua_pro_mercy_1791328985938.jpg',
    verified: true,
    yearsExperience: 5,
    neighborhoods: ['Kilimani', 'Kileleshwa', 'Lavington'],
    bio: 'Certified hospitality specialist passionate about creating serene, impeccably organized home environments with child-safe eco detergents.'
  },
  {
    id: 'pro-2',
    name: 'Brian Kiprop',
    specialty: 'Laundry & Fabric Care Master',
    rating: 4.96,
    reviewsCount: 248,
    completedJobs: '420+ homes (placeholder)',
    avatar: '/src/assets/images/fua_pro_brian_1791328996834.jpg',
    verified: true,
    yearsExperience: 4,
    neighborhoods: ['Westlands', 'Parklands', 'Riverside'],
    bio: 'Expert in garment preservation, stain science, and delicate fabrics. Brings precision iron pressing and wardrobe perfection to your home.'
  },
  {
    id: 'pro-3',
    name: 'Faith Achieng',
    specialty: 'Deep Cleaning & Move-In Revival',
    rating: 4.99,
    reviewsCount: 420,
    completedJobs: '680+ homes (placeholder)',
    avatar: '/src/assets/images/fua_pro_faith_1791329006931.jpg',
    verified: true,
    yearsExperience: 7,
    neighborhoods: ['Karen', 'Runda', 'Muthaiga'],
    bio: 'Seven years of premium residential housekeeping experience. Known for meticulous grout scrub, oven restorations, and spotless surfaces.'
  }
];

export const TESTIMONIALS = [
  {
    id: 't-1',
    author: 'Wanjiku Kamau',
    role: 'Homeowner, Kilimani',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    stars: 5,
    comment: 'Having a vetted professional come right to my apartment in Kilimani changed everything. No more hauling bags of clothes to laundromats or worrying about lost items. Mercy was courteous, meticulous, and left my home smelling like fresh lavender.'
  },
  {
    id: 't-2',
    author: 'David Omondi',
    role: 'Tech Lead, Westlands',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    stars: 5,
    comment: 'The core promise is 100% true: they come to you. Brian washed, dried, and ironed all my shirts directly in my flat while I worked from home in my study. Transparent M-Pesa billing with zero surprise fees.'
  },
  {
    id: 't-3',
    author: 'Njeri & Mark Mwangi',
    role: 'Family Home, Karen',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    stars: 5,
    comment: 'We booked a deep clean before family visited for the holidays. Faith was punctual, brought all her specialized sanitizers, and treated our home with the highest degree of care. Truly an Airbnb-level service.'
  }
];

export const TRUST_METRICS = [
  {
    label: 'Vetted Professionals',
    stat: '100% Verified',
    sub: 'Police clearance & background check',
    icon: 'ShieldCheck'
  },
  {
    label: 'At-Home Service',
    stat: 'Zero Travel For You',
    sub: 'We arrive right at your doorstep',
    icon: 'Home'
  },
  {
    label: 'Transparent Pricing',
    stat: 'No Hidden Fees',
    sub: 'Final price clear before checkout',
    icon: 'Receipt'
  },
  {
    label: 'Secure Payments',
    stat: 'Instant M-Pesa',
    sub: 'Safe prompt via Safaricom STK',
    icon: 'Smartphone'
  },
  {
    label: 'Quality Assurance',
    stat: '1,000+ Happy Homes',
    sub: '100% re-clean satisfaction guarantee',
    icon: 'CheckCircle2'
  }
];

export const PRICING_TIERS = [
  {
    name: 'Essential In-Home Reset',
    description: 'Perfect for regular maintenance of 1 to 2 bedroom apartments.',
    priceText: 'Starting from KES 800',
    note: 'Final price shown after you choose your requirements.',
    popular: false,
    accent: 'blue',
    features: [
      'Complete home surface dusting & floor mop',
      'Sanitization of 1-2 bathrooms & kitchen surfaces',
      'Professional arrives with eco cleaning supplies',
      'Bed linen change & waste clearance',
      'Up to 3 hours on-site dedicated care'
    ]
  },
  {
    name: 'Full Home + Laundry Care',
    description: 'Our most loved package combining deep housekeeping and full wardrobe wash & fold.',
    priceText: 'Starting from KES 1,150',
    note: 'Final price shown after you choose your requirements.',
    popular: true,
    accent: 'aqua',
    features: [
      'Full home cleaning (up to 3 bedrooms)',
      'Complete laundry wash, line dry & neat fold on-site',
      'Kitchen degrease & bathroom lime scale treatment',
      'Wardrobe organization & steam pressing on request',
      'Dedicated vetted professional of your choice'
    ]
  },
  {
    name: 'Comprehensive Deep Revival',
    description: 'Ideal for move-ins, large family residences in Karen/Runda, or seasonal overhauls.',
    priceText: 'Starting from KES 1,000',
    note: 'Final price shown after you choose your requirements.',
    popular: false,
    accent: 'lavender',
    features: [
      'Grout scrub, interior cabinet scrub & oven degreasing',
      'Balcony power-scrub & window track detailing',
      'Fabric sanitization & linen refresh',
      'Two vetted professionals for thorough execution',
      'Fua Fresh Quality Re-clean guarantee included'
    ]
  }
];
