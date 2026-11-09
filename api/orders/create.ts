import { calculateOrderPricing } from '../../server/pricing';
import { getSupabaseAdmin } from '../../server/supabaseAdmin';

function makeOrderId() {
  return `ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    if (!body.serviceId || !body.homeSize) {
      return res.status(400).json({ error: 'serviceId and homeSize are required.' });
    }
    if (!body.customerName || !body.phoneNumber) {
      return res.status(400).json({ error: 'Customer name and phone number are required.' });
    }

    const pricing = calculateOrderPricing({
      serviceId: String(body.serviceId),
      homeSize: String(body.homeSize),
      selectedExtras: Array.isArray(body.selectedExtras) ? body.selectedExtras : [],
      ecoProducts: Boolean(body.ecoProducts),
    });

    const order = {
      id: makeOrderId(),
      service_id: pricing.serviceId,
      service_name: pricing.serviceName,
      home_size: pricing.homeSize,
      base_price: pricing.basePrice,
      selected_extras: pricing.selectedExtras,
      extras_total: pricing.extrasTotal,
      eco_products: pricing.ecoProducts,
      eco_fee: pricing.ecoFee,
      total_price: pricing.totalPrice,
      booking_date: String(body.date || ''),
      time_slot: String(body.timeSlot || ''),
      estate: String(body.estate || ''),
      street_address: String(body.streetAddress || ''),
      house_number: String(body.houseNumber || ''),
      access_instructions: String(body.accessInstructions || ''),
      customer_name: String(body.customerName).trim().slice(0, 120),
      phone_number: String(body.phoneNumber).trim(),
      status: 'PENDING_PAYMENT',
    };

    const { data, error } = await getSupabaseAdmin()
      .from('orders')
      .insert(order)
      .select('*')
      .single();

    if (error) {
      console.error('[orders/create] Supabase insert failed:', error.message);
      return res.status(500).json({ error: 'Could not save your booking. Please try again.' });
    }

    return res.status(201).json({
      success: true,
      order: {
        id: data.id,
        serviceId: data.service_id,
        serviceName: data.service_name,
        totalPrice: Number(data.total_price),
        status: data.status,
      },
    });
  } catch (error: any) {
    console.error('[orders/create] Error:', error.message);
    const status = error.message?.startsWith('SUPABASE_NOT_CONFIGURED') ? 503 : 500;
    return res.status(status).json({ error: error.message || 'Could not create booking order.' });
  }
}
