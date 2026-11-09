import fs from 'fs';
import path from 'path';

export interface OrderRecord {
  id: string; // e.g. ORD-1729...
  serviceId: string;
  serviceName: string;
  homeSize: string;
  basePrice: number;
  selectedExtras: string[];
  extrasTotal: number;
  ecoProducts: boolean;
  ecoFee: number;
  totalPrice: number; // Trusted authoritative calculated price
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

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
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

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export interface PaymentRecord {
  checkoutRequestId: string;
  merchantRequestId: string;
  orderId: string;
  amount: number;
  phoneNumber: string;
  status: PaymentStatus;
  resultCode?: number;
  resultDesc?: string;
  mpesaReceiptNumber?: string;
  transactionDate?: string;
  createdAt: string;
  completedAt?: string;
}

class Storage {
  private dataDir: string;
  private ordersFile: string;
  private paymentsFile: string;
  private usersFile: string;
  private orders: Map<string, OrderRecord> = new Map();
  private payments: Map<string, PaymentRecord> = new Map();
  private users: Map<string, UserRecord> = new Map();

  constructor() {
    this.dataDir = path.resolve(process.cwd(), 'data');
    this.ordersFile = path.join(this.dataDir, 'orders.json');
    this.paymentsFile = path.join(this.dataDir, 'payments.json');
    this.usersFile = path.join(this.dataDir, 'users.json');
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      if (fs.existsSync(this.ordersFile)) {
        const raw = fs.readFileSync(this.ordersFile, 'utf-8');
        const list: OrderRecord[] = JSON.parse(raw);
        for (const item of list) {
          this.orders.set(item.id, item);
        }
      }

      if (fs.existsSync(this.paymentsFile)) {
        const raw = fs.readFileSync(this.paymentsFile, 'utf-8');
        const list: PaymentRecord[] = JSON.parse(raw);
        for (const item of list) {
          this.payments.set(item.checkoutRequestId, item);
        }
      }

      if (fs.existsSync(this.usersFile)) {
        const raw = fs.readFileSync(this.usersFile, 'utf-8');
        const list: UserRecord[] = JSON.parse(raw);
        for (const item of list) {
          this.users.set(item.email.toLowerCase(), item);
        }
      }

      this.seedInitialUsersAndOrders();
    } catch (err) {
      console.error('[Storage] Error initializing persistent storage:', err);
    }
  }

  private seedInitialUsersAndOrders() {
    let usersModified = false;
    const defaultAdmin: UserRecord = {
      id: 'usr_admin_1',
      name: 'Wanjiku Mwangi',
      email: 'admin@fuafresh.co.ke',
      phone: '0712345678',
      password: 'admin123',
      role: 'admin',
      avatar: '/src/assets/images/admin_profile_avatar_1794216630303.jpg',
      joinedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      estate: 'Westlands, Nairobi',
      title: 'Operations Director',
    };
    const defaultCustomer: UserRecord = {
      id: 'usr_cust_1',
      name: 'David Kiprono',
      email: 'david@gmail.com',
      phone: '0722123456',
      password: 'pass123',
      role: 'customer',
      joinedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      estate: 'Kilimani, Nairobi',
    };
    const defaultCleaner: UserRecord = {
      id: 'usr_cleaner_1',
      name: 'Mercy Wambui',
      email: 'mercy@fuafresh.co.ke',
      phone: '0712345678',
      password: 'cleaner123',
      role: 'cleaner',
      cleanerStatus: 'approved',
      avatar: '/src/assets/images/fua_pro_mercy_1791328985938.jpg',
      passportPhoto: '/src/assets/images/fua_pro_mercy_1791328985938.jpg',
      joinedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      estate: 'Ruiru, Kiambu/Nairobi Metropolitan',
      ruiruArea: 'Ruiru Town Center',
      title: 'Senior Housekeeping Specialist',
      specialty: 'Home Cleaning & Eco-Sanitization',
      yearsExperience: 5,
      neighborhoods: ['Ruiru Town Center', 'Membley Estate, Ruiru', 'Kamakis (Eastern Bypass), Ruiru'],
      goodConductCertified: true,
      availability: 'full-time',
      emergencyContactName: 'James Mwangi (Spouse)',
      emergencyContactPhone: '0711223344',
      refereeName: 'Pastor David Karanja',
      refereePhone: '0722001122',
      yearsLivingInRuiru: '5+ Years',
      bio: 'Certified hospitality specialist passionate about creating serene, impeccably organized home environments with child-safe eco detergents in Ruiru.',
      earningsTotal: 18450,
      rating: 4.98,
      jobsCompletedCount: 540,
      reviewedAt: new Date(Date.now() - 44 * 86400000).toISOString(),
      reviewedBy: 'Wanjiku Mwangi (Operations)',
    };

    const pendingCleaner: UserRecord = {
      id: 'usr_cleaner_pending_1',
      name: 'Grace Wanjiru Kinyua',
      email: 'grace.wanjiru@gmail.com',
      phone: '0718899221',
      password: 'cleaner123',
      role: 'cleaner',
      cleanerStatus: 'pending',
      avatar: '/src/assets/images/fua_pro_faith_1791329006931.jpg',
      passportPhoto: '/src/assets/images/fua_pro_faith_1791329006931.jpg',
      joinedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      estate: 'Ruiru, Kiambu/Nairobi Metropolitan',
      ruiruArea: 'Kamakis (Eastern Bypass), Ruiru',
      title: 'Housekeeping Applicant',
      specialty: 'Deep Cleaning & Move-In Revival',
      yearsExperience: 4,
      neighborhoods: ['Kamakis (Eastern Bypass), Ruiru', 'Membley Estate, Ruiru', 'Ruiru Town Center'],
      goodConductCertified: true,
      availability: 'full-time',
      emergencyContactName: 'Peter Kinyua (Brother)',
      emergencyContactPhone: '0722998811',
      refereeName: 'Mrs. Jane Kamau (Membley Homeowner)',
      refereePhone: '0733445566',
      yearsLivingInRuiru: '3 - 5 Years in Kamakis',
      bio: 'Punctual and meticulous professional cleaner residing in Kamakis, Ruiru. Experienced in villa deep scrubbing, kitchen degreasing, and steam fabric care.',
      earningsTotal: 0,
      rating: 5.0,
      jobsCompletedCount: 0,
    };

    if (!this.users.has(defaultAdmin.email.toLowerCase())) {
      this.users.set(defaultAdmin.email.toLowerCase(), defaultAdmin);
      usersModified = true;
    }
    if (!this.users.has(defaultCustomer.email.toLowerCase())) {
      this.users.set(defaultCustomer.email.toLowerCase(), defaultCustomer);
      usersModified = true;
    }
    if (!this.users.has(defaultCleaner.email.toLowerCase())) {
      this.users.set(defaultCleaner.email.toLowerCase(), defaultCleaner);
      usersModified = true;
    }
    if (!this.users.has(pendingCleaner.email.toLowerCase())) {
      this.users.set(pendingCleaner.email.toLowerCase(), pendingCleaner);
      usersModified = true;
    }
    if (usersModified) {
      this.persistUsers();
    }

    // Seed realistic sample orders if only 0 or 1 order exists
    if (this.orders.size <= 1) {
      const sampleOrders: OrderRecord[] = [
        {
          id: 'ORD-KIL-9241',
          serviceId: 'home-cleaning',
          serviceName: 'Home Cleaning',
          homeSize: '2 Bedroom (Standard)',
          basePrice: 800,
          selectedExtras: ['Wash & Fold Basket of Clothes', 'Degrease Kitchen Stovetop & Hood'],
          extrasTotal: 750,
          ecoProducts: true,
          ecoFee: 250,
          totalPrice: 1800,
          date: 'Today, 10:00 AM',
          timeSlot: '08:00 AM - 11:00 AM',
          estate: 'Kilimani, Nairobi',
          streetAddress: 'Argwings Kodhek Rd',
          houseNumber: 'Apt 4B, Silver Oak',
          accessInstructions: 'Gate code 4091, elevator to 4th floor',
          customerName: 'Amina Mohammed',
          phoneNumber: '254722345678',
          status: 'ASSIGNED',
          assignedPro: 'Beatrice Kemunto',
          checkoutRequestId: 'ws_CO_181020260930129241',
          mpesaReceiptNumber: 'QJH910XK01',
          createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        },
        {
          id: 'ORD-WST-8412',
          serviceId: 'deep-cleaning',
          serviceName: 'Deep Cleaning',
          homeSize: '3 Bedroom (Family)',
          basePrice: 1250,
          selectedExtras: ['Oven & Range Interior Restoration', 'Tile Grout Power Scrub Machine'],
          extrasTotal: 1200,
          ecoProducts: true,
          ecoFee: 250,
          totalPrice: 2700,
          date: 'Today, 2:30 PM',
          timeSlot: '11:30 AM - 02:30 PM',
          estate: 'Westlands, Nairobi',
          streetAddress: 'Rhapta Road',
          houseNumber: 'Villa 12, Westbridge Court',
          accessInstructions: 'Ask for security at gate A',
          customerName: 'Brian Otieno',
          phoneNumber: '254711892019',
          status: 'ON_THE_WAY',
          assignedPro: 'Dennis Mutua',
          checkoutRequestId: 'ws_CO_181020261130128412',
          mpesaReceiptNumber: 'QJH834BM99',
          createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
        },
        {
          id: 'ORD-KLN-3189',
          serviceId: 'laundry',
          serviceName: 'Laundry (Wash, Dry & Fold)',
          homeSize: '1 Bedroom (Compact)',
          basePrice: 315,
          selectedExtras: ['Bed Linen & Towels Hot Wash', 'Steam Iron & Hang Washed Clothes'],
          extrasTotal: 750,
          ecoProducts: false,
          ecoFee: 0,
          totalPrice: 1065,
          date: 'Yesterday, 9:00 AM',
          timeSlot: '08:00 AM - 11:00 AM',
          estate: 'Kileleshwa, Nairobi',
          streetAddress: 'Mandera Road',
          houseNumber: 'House 8C',
          customerName: 'Grace Wambui',
          phoneNumber: '254708112233',
          status: 'COMPLETED',
          assignedPro: 'Mercy Atieno',
          checkoutRequestId: 'ws_CO_171020260900123189',
          mpesaReceiptNumber: 'QJG411PR22',
          createdAt: new Date(Date.now() - 28 * 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
        },
        {
          id: 'ORD-LAV-7721',
          serviceId: 'ironing',
          serviceName: 'Ironing',
          homeSize: '2 Bedroom (Standard)',
          basePrice: 1000,
          selectedExtras: ['Executive Business Clothes & Shirts (10 pcs)', 'Traditional Wear & Delicate Clothes'],
          extrasTotal: 850,
          ecoProducts: false,
          ecoFee: 0,
          totalPrice: 1850,
          date: 'Tomorrow, 9:00 AM',
          timeSlot: '09:00 AM - 12:00 PM',
          estate: 'Lavington, Nairobi',
          streetAddress: 'James Gichuru Rd',
          houseNumber: 'Gate 4, Greenfield Residency',
          customerName: 'Kevin Njoroge',
          phoneNumber: '254721445566',
          status: 'PAID',
          checkoutRequestId: 'ws_CO_181020261300127721',
          mpesaReceiptNumber: 'QJH992ZZ14',
          createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
        },
        {
          id: 'ORD-RND-1102',
          serviceId: 'custom',
          serviceName: 'Custom Full Service',
          homeSize: '4+ BR (Villa/Maisonette)',
          basePrice: 3750,
          selectedExtras: ['Full Basket Clothes Wash, Dry & Fold', 'Combined Laundry + Kitchen Deep Wash', 'Patio & Compound Sweep'],
          extrasTotal: 1450,
          ecoProducts: true,
          ecoFee: 250,
          totalPrice: 5450,
          date: 'Friday, 8:00 AM',
          timeSlot: '08:00 AM - 11:00 AM',
          estate: 'Runda, Nairobi',
          streetAddress: 'Runda Grove',
          houseNumber: 'Compound 45',
          customerName: 'Catherine Mutisya',
          phoneNumber: '254733990011',
          status: 'PENDING_PAYMENT',
          createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
          updatedAt: new Date(Date.now() - 15 * 60000).toISOString(),
        }
      ];

      for (const order of sampleOrders) {
        if (!this.orders.has(order.id)) {
          this.orders.set(order.id, order);
        }
      }
      this.persistOrders();
    }
  }

  private persistOrders() {
    try {
      const list = Array.from(this.orders.values());
      fs.writeFileSync(this.ordersFile, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Storage] Error saving orders:', err);
    }
  }

  private persistPayments() {
    try {
      const list = Array.from(this.payments.values());
      fs.writeFileSync(this.paymentsFile, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Storage] Error saving payments:', err);
    }
  }

  private persistUsers() {
    try {
      const list = Array.from(this.users.values());
      fs.writeFileSync(this.usersFile, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Storage] Error saving users:', err);
    }
  }

  // Users
  getUserByEmail(email: string): UserRecord | null {
    return this.users.get(email.toLowerCase().trim()) || null;
  }

  saveUser(user: UserRecord): UserRecord {
    this.users.set(user.email.toLowerCase().trim(), user);
    this.persistUsers();
    return user;
  }

  getUserById(id: string): UserRecord | null {
    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return null;
  }

  updateUser(id: string, updates: Partial<UserRecord>): UserRecord | null {
    for (const [email, user] of this.users.entries()) {
      if (user.id === id) {
        const updated: UserRecord = {
          ...user,
          ...updates,
        };
        this.users.set(email, updated);
        this.persistUsers();
        return updated;
      }
    }
    return null;
  }

  getAllCleaners(): UserRecord[] {
    return Array.from(this.users.values())
      .filter((u) => u.role === 'cleaner')
      .map((u) => {
        const { password, ...safe } = u;
        return safe as UserRecord;
      })
      .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
  }

  // Orders
  saveOrder(order: OrderRecord): OrderRecord {
    this.orders.set(order.id, order);
    this.persistOrders();
    return order;
  }

  getOrder(id: string): OrderRecord | null {
    return this.orders.get(id) || null;
  }

  getAllOrders(): OrderRecord[] {
    return Array.from(this.orders.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  deleteOrder(id: string): boolean {
    const deleted = this.orders.delete(id);
    if (deleted) this.persistOrders();
    return deleted;
  }

  updateOrder(id: string, updates: Partial<OrderRecord>): OrderRecord | null {
    const existing = this.orders.get(id);
    if (!existing) return null;
    const updated: OrderRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.orders.set(id, updated);
    this.persistOrders();
    return updated;
  }

  // Payments
  savePayment(payment: PaymentRecord): PaymentRecord {
    this.payments.set(payment.checkoutRequestId, payment);
    this.persistPayments();
    return payment;
  }

  getPayment(checkoutRequestId: string): PaymentRecord | null {
    return this.payments.get(checkoutRequestId) || null;
  }

  getAllPayments(): PaymentRecord[] {
    return Array.from(this.payments.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  getPaymentByOrderId(orderId: string): PaymentRecord | null {
    for (const payment of this.payments.values()) {
      if (payment.orderId === orderId) {
        return payment;
      }
    }
    return null;
  }

  updatePayment(checkoutRequestId: string, updates: Partial<PaymentRecord>): PaymentRecord | null {
    const existing = this.payments.get(checkoutRequestId);
    if (!existing) return null;
    const updated: PaymentRecord = {
      ...existing,
      ...updates,
    };
    this.payments.set(checkoutRequestId, updated);
    this.persistPayments();
    return updated;
  }
}

export const storage = new Storage();
