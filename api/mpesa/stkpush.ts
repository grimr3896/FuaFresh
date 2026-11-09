import { formatPhoneNumber, initiateStkPush } from '../../server/daraja';
import { getSupabaseAdmin } from '../../server/supabaseAdmin';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const orderId = String(req.body?.orderId || '');
    const phone = String(req.body?.phone || '');
    if (!orderId || !phone) {
      return res.status(400).json({ success: false, error: 'orderId and phone are required.' });
    }

    const supabase = getSupabaseAdmin();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (orderError) throw orderError;
    if (!order) return res.status(404).json({ success: false, error: 'Order not found.' });
    if (order.status === 'PAID') {
      return res.status(409).json({ success: false, error: 'This order has already been paid.' });
    }
    if (order.checkout_request_id) {
      return res.status(409).json({
        success: false,
        error: 'A payment request already exists for this order. Check your phone or wait for its result before retrying.',
      });
    }

    const formattedPhone = formatPhoneNumber(phone);
    if (formatPhoneNumber(String(order.phone_number)) !== formattedPhone) {
      return res.status(400).json({ success: false, error: 'The payment phone number must match the number entered for this booking.' });
    }

    const result = await initiateStkPush({
      amount: Number(order.total_price),
      phoneNumber: formattedPhone,
      orderId: order.id,
      accountReference: 'FuaFresh',
      transactionDesc: `FuaFresh ${order.service_name}`,
    });

    const { error: paymentError } = await supabase.from('payments').insert({
      checkout_request_id: result.checkoutRequestId,
      merchant_request_id: result.merchantRequestId,
      order_id: order.id,
      amount: Number(order.total_price),
      phone_number: formattedPhone,
      status: 'PENDING',
    });
    if (paymentError) {
      console.error('[mpesa/stkpush] Payment record insert failed:', paymentError.message);
      return res.status(502).json({
        success: false,
        error: 'Daraja accepted the payment request but we could not save its tracking record. Contact support before retrying.',
      });
    }

    const { error: updateError } = await supabase.from('orders')
      .update({ checkout_request_id: result.checkoutRequestId, status: 'PROCESSING', updated_at: new Date().toISOString() })
      .eq('id', order.id);
    if (updateError) throw updateError;

    return res.status(200).json({
      success: true,
      checkoutRequestId: result.checkoutRequestId,
      merchantRequestId: result.merchantRequestId,
      customerMessage: result.customerMessage,
      orderId: order.id,
      amount: Number(order.total_price),
    });
  } catch (error: any) {
    console.error('[mpesa/stkpush] Error:', error.message);
    const missing = error.message?.startsWith('MISSING_CREDENTIALS');
    const status = missing ? 428 : error.message?.startsWith('SUPABASE_NOT_CONFIGURED') ? 503 : 502;
    return res.status(status).json({
      success: false,
      error: missing ? 'MISSING_CREDENTIALS' : 'STK_PUSH_FAILED',
      message: error.message || 'Could not initiate M-Pesa payment.',
    });
  }
}
