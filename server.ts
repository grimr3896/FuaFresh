import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { config, getPublicConfigStatus } from './server/config';
import { calculateOrderPricing } from './server/pricing';
import { storage, OrderRecord, PaymentRecord } from './server/storage';
import {
  initiateStkPush,
  queryStkPush,
  formatPhoneNumber,
} from './server/daraja';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = config.port;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // CORS headers for local/cross-origin requests
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // -------------------------------------------------------------
  // API: Public M-Pesa Configuration Status (Non-sensitive)
  // -------------------------------------------------------------
  app.get('/api/mpesa/config', (req: Request, res: Response) => {
    res.json(getPublicConfigStatus());
  });

  // -------------------------------------------------------------
  // API: Create Booking Order with Trusted Authoritative Pricing
  // -------------------------------------------------------------
  app.post('/api/orders/create', (req: Request, res: Response) => {
    try {
      const {
        serviceId,
        homeSize,
        selectedExtras,
        ecoProducts,
        date,
        timeSlot,
        estate,
        streetAddress,
        houseNumber,
        accessInstructions,
        customerName,
        phoneNumber,
      } = req.body;

      if (!serviceId || !homeSize) {
        return res.status(400).json({ error: 'serviceId and homeSize are required' });
      }

      // Calculate price strictly on the backend (Requirement 8)
      const pricing = calculateOrderPricing({
        serviceId,
        homeSize,
        selectedExtras,
        ecoProducts,
      });

      const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date().toISOString();

      const newOrder: OrderRecord = {
        id: orderId,
        serviceId: pricing.serviceId,
        serviceName: pricing.serviceName,
        homeSize: pricing.homeSize,
        basePrice: pricing.basePrice,
        selectedExtras: pricing.selectedExtras,
        extrasTotal: pricing.extrasTotal,
        ecoProducts: pricing.ecoProducts,
        ecoFee: pricing.ecoFee,
        totalPrice: pricing.totalPrice,
        date: date || 'Tomorrow, 9:00 AM',
        timeSlot: timeSlot || '09:00 AM - 12:00 PM',
        estate: estate || 'Kilimani, Nairobi',
        streetAddress: streetAddress || '',
        houseNumber: houseNumber || '',
        accessInstructions: accessInstructions || '',
        customerName: customerName || 'Valued Customer',
        phoneNumber: phoneNumber || '',
        status: 'PENDING_PAYMENT',
        createdAt: now,
        updatedAt: now,
      };

      storage.saveOrder(newOrder);

      return res.status(201).json({
        success: true,
        order: newOrder,
      });
    } catch (err: any) {
      console.error('[API /api/orders/create] Error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error creating order' });
    }
  });

  // -------------------------------------------------------------
  // API: Get Order by ID
  // -------------------------------------------------------------
  app.get('/api/orders/:orderId', (req: Request, res: Response) => {
    const order = storage.getOrder(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json({ order });
  });

  // -------------------------------------------------------------
  // API: Initiate Safaricom Daraja STK Push
  // -------------------------------------------------------------
  app.post('/api/mpesa/stkpush', async (req: Request, res: Response) => {
    try {
      const { orderId, phone } = req.body;

      if (!orderId) {
        return res.status(400).json({ error: 'orderId is required' });
      }
      if (!phone) {
        return res.status(400).json({ error: 'phone number is required' });
      }

      const order = storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.status === 'PAID') {
        return res.status(400).json({ error: 'Order is already paid', order });
      }

      // Check whether server-side credentials are configured
      if (!config.consumerSecret || !config.passkey) {
        return res.status(428).json({
          success: false,
          error: 'MISSING_CREDENTIALS',
          message: 'Safaricom Daraja credentials are not fully configured. Please set DARAJA_CONSUMER_SECRET, MPESA_PASSKEY, MPESA_SHORTCODE, and MPESA_CALLBACK_URL in your server-side environment secrets.',
          missing: [
            ...(!config.consumerSecret ? ['DARAJA_CONSUMER_SECRET'] : []),
            ...(!config.passkey ? ['MPESA_PASSKEY'] : []),
          ],
          orderId: order.id,
          amount: order.totalPrice,
          businessShortCode: config.businessShortCode,
        });
      }

      let formattedPhone: string;
      try {
        formattedPhone = formatPhoneNumber(phone);
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }

      // Real Daraja STK Push request with trusted server-calculated amount
      console.log(`[Daraja STK] Initiating push for order ${order.id}, amount KES ${order.totalPrice} to ${formattedPhone}`);
      const darajaResponse = await initiateStkPush({
        amount: order.totalPrice,
        phoneNumber: formattedPhone,
        orderId: order.id,
        accountReference: 'FuaFresh',
        transactionDesc: `FuaFresh ${order.serviceName}`,
      });

      // Save payment record as PENDING (Requirement 10: Never mark as paid merely on STK acceptance!)
      const paymentRecord: PaymentRecord = {
        checkoutRequestId: darajaResponse.checkoutRequestId,
        merchantRequestId: darajaResponse.merchantRequestId,
        orderId: order.id,
        amount: order.totalPrice,
        phoneNumber: formattedPhone,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      storage.savePayment(paymentRecord);

      // Update order status to PROCESSING
      storage.updateOrder(order.id, {
        checkoutRequestId: darajaResponse.checkoutRequestId,
        status: 'PROCESSING',
      });

      return res.json({
        success: true,
        checkoutRequestId: darajaResponse.checkoutRequestId,
        merchantRequestId: darajaResponse.merchantRequestId,
        customerMessage: darajaResponse.customerMessage,
        orderId: order.id,
        amount: order.totalPrice,
      });
    } catch (err: any) {
      console.error('[API /api/mpesa/stkpush] Error:', err);
      const isMissingCreds = err.message?.includes('MISSING_CREDENTIALS');
      return res.status(isMissingCreds ? 428 : 500).json({
        success: false,
        error: isMissingCreds ? 'MISSING_CREDENTIALS' : 'STK_PUSH_FAILED',
        message: err.message,
      });
    }
  });

  // -------------------------------------------------------------
  // API: Safaricom Daraja STK Push Callback (Requirement 9 & 10)
  // -------------------------------------------------------------
  app.post('/api/mpesa/callback', (req: Request, res: Response) => {
    try {
      console.log('[Daraja Callback] Received payment notification.');
      const callback = req.body?.Body?.stkCallback;

      if (!callback) {
        console.warn('[Daraja Callback] Invalid body structure');
        return res.json({ ResultCode: 0, ResultDesc: 'Accepted but payload was empty' });
      }

      const checkoutRequestId = callback.CheckoutRequestID;
      const resultCode = callback.ResultCode;
      const resultDesc = callback.ResultDesc || '';

      const payment = storage.getPayment(checkoutRequestId);
      if (!payment) {
        console.warn(`[Daraja Callback] Payment record not found for CheckoutRequestID: ${checkoutRequestId}`);
        return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
      }

      // Idempotency: Prevent duplicate processing if already in terminal state
      if (payment.status === 'SUCCESS' || payment.status === 'FAILED' || payment.status === 'CANCELLED') {
        console.log(`[Daraja Callback] Transaction ${checkoutRequestId} already in terminal state ${payment.status}. Idempotent no-op.`);
        return res.json({ ResultCode: 0, ResultDesc: 'Already processed' });
      }

      if (resultCode === 0) {
        // SUCCESS: extract metadata items
        const items: Array<{ Name: string; Value: any }> = callback.CallbackMetadata?.Item || [];
        const getValue = (name: string) => items.find((i) => i.Name === name)?.Value;

        const receiptNumber = getValue('MpesaReceiptNumber') || 'SANDBOX_OK';
        const transDate = getValue('TransactionDate');

        storage.updatePayment(checkoutRequestId, {
          status: 'SUCCESS',
          resultCode: 0,
          resultDesc,
          mpesaReceiptNumber: String(receiptNumber),
          transactionDate: transDate ? String(transDate) : undefined,
          completedAt: new Date().toISOString(),
        });

        // Mark order as PAID
        storage.updateOrder(payment.orderId, {
          status: 'PAID',
          mpesaReceiptNumber: String(receiptNumber),
        });

        console.log(`[Daraja Callback] Order ${payment.orderId} marked PAID with receipt ${receiptNumber}`);
      } else if (resultCode === 1032) {
        // Cancelled by user on mobile phone
        storage.updatePayment(checkoutRequestId, {
          status: 'CANCELLED',
          resultCode: 1032,
          resultDesc: 'Transaction cancelled by customer on handset',
          completedAt: new Date().toISOString(),
        });

        storage.updateOrder(payment.orderId, {
          status: 'PAYMENT_FAILED',
          failureReason: 'Transaction cancelled by customer on mobile handset',
        });
        console.log(`[Daraja Callback] Transaction ${checkoutRequestId} cancelled by user`);
      } else {
        // Other failures (insufficient funds, timeout, etc.)
        storage.updatePayment(checkoutRequestId, {
          status: 'FAILED',
          resultCode: Number(resultCode),
          resultDesc,
          completedAt: new Date().toISOString(),
        });

        storage.updateOrder(payment.orderId, {
          status: 'PAYMENT_FAILED',
          failureReason: resultDesc || `Daraja Error code ${resultCode}`,
        });
        console.log(`[Daraja Callback] Transaction ${checkoutRequestId} failed: ${resultDesc}`);
      }

      // Acknowledge receipt to Safaricom
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    } catch (err: any) {
      console.error('[Daraja Callback] Error processing callback:', err);
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted with internal handling notice' });
    }
  });

  // -------------------------------------------------------------
  // API: Check Payment Status by CheckoutRequestID
  // -------------------------------------------------------------
  app.get('/api/mpesa/status/:checkoutRequestId', async (req: Request, res: Response) => {
    try {
      const { checkoutRequestId } = req.params;
      let payment = storage.getPayment(checkoutRequestId);

      if (!payment) {
        return res.status(404).json({ error: 'Payment record not found' });
      }

      // If still PENDING and credentials configured, optionally query Daraja API directly
      if (payment.status === 'PENDING' && config.consumerKey && config.consumerSecret && config.passkey) {
        try {
          const queryResult = await queryStkPush(checkoutRequestId);
          if (queryResult.resultCode === '0') {
            payment = storage.updatePayment(checkoutRequestId, {
              status: 'SUCCESS',
              resultCode: 0,
              resultDesc: queryResult.resultDesc || 'Payment confirmed via status query',
              completedAt: new Date().toISOString(),
            }) || payment;

            storage.updateOrder(payment.orderId, {
              status: 'PAID',
              mpesaReceiptNumber: payment.mpesaReceiptNumber,
            });
          } else if (queryResult.resultCode === '1032') {
            payment = storage.updatePayment(checkoutRequestId, {
              status: 'CANCELLED',
              resultCode: 1032,
              resultDesc: queryResult.resultDesc || 'Request cancelled by user',
              completedAt: new Date().toISOString(),
            }) || payment;

            storage.updateOrder(payment.orderId, {
              status: 'PAYMENT_FAILED',
              failureReason: 'Transaction cancelled on mobile phone',
            });
          } else if (queryResult.resultCode && queryResult.resultCode !== '' && queryResult.resultCode !== '0') {
            payment = storage.updatePayment(checkoutRequestId, {
              status: 'FAILED',
              resultCode: Number(queryResult.resultCode),
              resultDesc: queryResult.resultDesc,
              completedAt: new Date().toISOString(),
            }) || payment;

            storage.updateOrder(payment.orderId, {
              status: 'PAYMENT_FAILED',
              failureReason: queryResult.resultDesc,
            });
          }
        } catch (queryErr) {
          // If query returns pending or fails, we retain existing status without error
          // console.warn('[Daraja Status Query] Polling notice:', queryErr);
        }
      }

      const order = storage.getOrder(payment.orderId);

      return res.json({
        status: payment.status,
        checkoutRequestId: payment.checkoutRequestId,
        orderId: payment.orderId,
        amount: payment.amount,
        phoneNumber: payment.phoneNumber,
        mpesaReceiptNumber: payment.mpesaReceiptNumber || order?.mpesaReceiptNumber,
        resultDesc: payment.resultDesc,
        completedAt: payment.completedAt,
        orderStatus: order?.status,
      });
    } catch (err: any) {
      console.error('[API /api/mpesa/status] Error:', err);
      return res.status(500).json({ error: err.message || 'Error checking payment status' });
    }
  });

  // -------------------------------------------------------------
  // API: Authentication (Sign In & Sign Up)
  // -------------------------------------------------------------
  app.post('/api/auth/signin', (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'No account found with this email address' });
      }

      if (user.password && user.password !== password) {
        return res.status(401).json({ error: 'Incorrect password entered' });
      }

      // Check if cleaner is pending operations approval
      if (user.role === 'cleaner' && user.cleanerStatus === 'pending') {
        return res.status(403).json({
          success: false,
          pendingApproval: true,
          error: 'Your cleaner application is currently under review by our Operations Team in Ruiru. You will receive an SMS confirmation once approved.',
        });
      }

      if (user.role === 'cleaner' && user.cleanerStatus === 'rejected') {
        return res.status(403).json({
          success: false,
          error: user.rejectionReason || 'Your cleaner application was declined by operations. Contact support at hello@fuafresh.co.ke.',
        });
      }

      const { password: _, ...safeUser } = user;
      return res.json({
        success: true,
        user: safeUser,
        token: `fua_tk_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`,
      });
    } catch (err: any) {
      console.error('[API /api/auth/signin] Error:', err);
      return res.status(500).json({ error: err.message || 'Error signing in' });
    }
  });

  app.post('/api/auth/signup', (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        phone,
        password,
        role,
        estate,
        title,
        specialty,
        yearsExperience,
        neighborhoods,
        idNumber,
        goodConductCertified,
        availability,
        bio,
        passportPhoto,
        ruiruArea,
        emergencyContactName,
        emergencyContactPhone,
        refereeName,
        refereePhone,
        yearsLivingInRuiru,
      } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }

      const existing = storage.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'An account with this email address already exists' });
      }

      const assignedRole = role === 'admin' ? 'admin' : role === 'cleaner' ? 'cleaner' : 'customer';

      const newUser: any = {
        id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
        name,
        email: email.toLowerCase().trim(),
        phone: phone || '',
        password,
        role: assignedRole,
        estate: estate || (assignedRole === 'cleaner' ? 'Ruiru, Kiambu/Nairobi Metropolitan' : 'Kilimani, Nairobi'),
        title: title || (assignedRole === 'admin' ? 'Operations Officer' : assignedRole === 'cleaner' ? 'Housekeeping Specialist' : 'Homeowner'),
        avatar: passportPhoto || (assignedRole === 'cleaner' ? '/src/assets/images/fua_pro_faith_1791329006931.jpg' : undefined),
        passportPhoto: passportPhoto || (assignedRole === 'cleaner' ? '/src/assets/images/fua_pro_faith_1791329006931.jpg' : undefined),
        cleanerStatus: assignedRole === 'cleaner' ? 'pending' : undefined,
        ruiruArea: ruiruArea || (assignedRole === 'cleaner' ? 'Ruiru Town Center' : undefined),
        emergencyContactName: emergencyContactName || '',
        emergencyContactPhone: emergencyContactPhone || '',
        refereeName: refereeName || '',
        refereePhone: refereePhone || '',
        yearsLivingInRuiru: yearsLivingInRuiru || '1 - 3 Years',
        specialty: specialty || 'Home Cleaning & Eco-Sanitization',
        yearsExperience: Number(yearsExperience) || 3,
        neighborhoods: Array.isArray(neighborhoods) && neighborhoods.length > 0 ? neighborhoods : ['Ruiru Town Center', 'Membley Estate, Ruiru'],
        idNumber: idNumber || '',
        goodConductCertified: Boolean(goodConductCertified),
        availability: availability || 'full-time',
        bio: bio || 'Professional housekeeping specialist applying to serve homes in Ruiru.',
        earningsTotal: 0,
        rating: 5.0,
        jobsCompletedCount: 0,
        joinedAt: new Date().toISOString(),
      };

      storage.saveUser(newUser);
      const { password: _, ...safeUser } = newUser;

      return res.status(201).json({
        success: true,
        pendingApproval: assignedRole === 'cleaner',
        message: assignedRole === 'cleaner'
          ? 'Cleaner application submitted successfully! Your application has been sent to the Ruiru Operations Admin Panel and is waiting for review and approval.'
          : 'Account created successfully!',
        user: safeUser,
        token: `fua_tk_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`,
      });
    } catch (err: any) {
      console.error('[API /api/auth/signup] Error:', err);
      return res.status(500).json({ error: err.message || 'Error signing up' });
    }
  });

  // -------------------------------------------------------------
  // API: Admin Operations (Cleaners Applications & Review)
  // -------------------------------------------------------------
  app.get('/api/admin/cleaners', (req: Request, res: Response) => {
    try {
      const cleaners = storage.getAllCleaners();
      return res.json({ cleaners });
    } catch (err: any) {
      console.error('[API /api/admin/cleaners] Error:', err);
      return res.status(500).json({ error: 'Error fetching cleaner applications' });
    }
  });

  app.patch('/api/admin/cleaners/:userId/status', (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { status, rejectionReason, reviewerName } = req.body;

      if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be approved, rejected, or pending.' });
      }

      const existing = storage.getUserById(userId);
      if (!existing || existing.role !== 'cleaner') {
        return res.status(404).json({ error: 'Cleaner application not found' });
      }

      const updated = storage.updateUser(userId, {
        cleanerStatus: status,
        reviewedAt: new Date().toISOString(),
        reviewedBy: reviewerName || 'Admin Operations (Wanjiku Mwangi)',
        rejectionReason: status === 'rejected' ? (rejectionReason || 'Did not meet current vetting requirements') : undefined,
      });

      return res.json({ success: true, cleaner: updated });
    } catch (err: any) {
      console.error('[API /api/admin/cleaners/:userId/status] Error:', err);
      return res.status(500).json({ error: 'Error updating cleaner status' });
    }
  });

  // -------------------------------------------------------------
  // API: Admin Operations (Orders, Payments, Fleet, Stats)
  // -------------------------------------------------------------
  app.get('/api/admin/orders', (req: Request, res: Response) => {
    try {
      const orders = storage.getAllOrders();
      return res.json({ orders });
    } catch (err: any) {
      console.error('[API /api/admin/orders] Error:', err);
      return res.status(500).json({ error: 'Error fetching orders' });
    }
  });

  app.patch('/api/admin/orders/:orderId', (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const updates = req.body;
      const updated = storage.updateOrder(orderId, updates);
      if (!updated) {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.json({ success: true, order: updated });
    } catch (err: any) {
      console.error('[API /api/admin/orders/:orderId] Error:', err);
      return res.status(500).json({ error: 'Error updating order' });
    }
  });

  app.delete('/api/admin/orders/:orderId', (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const deleted = storage.deleteOrder(orderId);
      if (!deleted) {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.json({ success: true, orderId });
    } catch (err: any) {
      console.error('[API /api/admin/orders/:orderId DELETE] Error:', err);
      return res.status(500).json({ error: 'Error deleting order' });
    }
  });

  app.get('/api/admin/payments', (req: Request, res: Response) => {
    try {
      const payments = storage.getAllPayments();
      return res.json({ payments });
    } catch (err: any) {
      console.error('[API /api/admin/payments] Error:', err);
      return res.status(500).json({ error: 'Error fetching payments' });
    }
  });

  app.get('/api/admin/stats', (req: Request, res: Response) => {
    try {
      const orders = storage.getAllOrders();
      const payments = storage.getAllPayments();

      const totalRevenue = orders
        .filter((o) => ['PAID', 'ASSIGNED', 'ON_THE_WAY', 'COMPLETED'].includes(o.status))
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      const completedOrders = orders.filter((o) => o.status === 'COMPLETED').length;
      const activeJobs = orders.filter((o) => ['ASSIGNED', 'ON_THE_WAY', 'PROCESSING'].includes(o.status)).length;
      const pendingPayment = orders.filter((o) => o.status === 'PENDING_PAYMENT').length;

      // Service breakdown
      const serviceCounts: Record<string, number> = {};
      for (const o of orders) {
        serviceCounts[o.serviceName] = (serviceCounts[o.serviceName] || 0) + 1;
      }

      // Estate breakdown
      const estateCounts: Record<string, number> = {};
      for (const o of orders) {
        const est = o.estate ? o.estate.split(',')[0].trim() : 'Nairobi Central';
        estateCounts[est] = (estateCounts[est] || 0) + 1;
      }

      return res.json({
        totalRevenue,
        totalOrders: orders.length,
        completedOrders,
        activeJobs,
        pendingPayment,
        totalPayments: payments.length,
        serviceCounts,
        estateCounts,
      });
    } catch (err: any) {
      console.error('[API /api/admin/stats] Error:', err);
      return res.status(500).json({ error: 'Error fetching admin stats' });
    }
  });

  // -------------------------------------------------------------
  // Frontend Integration: Vite Middlewares in Dev / Static in Prod
  // -------------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Fua Fresh Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[Daraja Config] Environment: ${config.env}, ShortCode: ${config.businessShortCode}`);
    console.log(`[Daraja Config] Callback URL: ${config.callbackUrl}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Startup Error]:', err);
});
