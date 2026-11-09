import { queryStkPush } from '../../../server/daraja';
import { getSupabaseAdmin } from '../../../server/supabaseAdmin';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const checkoutRequestId = String(req.query.checkoutRequestId || '');
    if (!checkoutRequestId) return res.status(400).json({ error: 'Checkout request ID is required.' });

    const supabase = getSupabaseAdmin();
    let { data: payment, error } = await supabase.from('payments')
      .select('*')
      .eq('checkout_request_id', checkoutRequestId)
      .maybeSingle();
    if (error) throw error;
    if (!payment) return res.status(404).json({ error: 'Payment record not found.' });

    if (payment.status === 'PENDING') {
      try {
        const result = await queryStkPush(checkoutRequestId);
        if (result.resultCode && result.resultCode !== '0') {
          const status = result.resultCode === '1032' ? 'CANCELLED' : 'FAILED';
          const { error: paymentUpdateError } = await supabase.from('payments')
            .update({
              status,
              result_code: Number(result.resultCode),
              result_desc: result.resultDesc,
              completed_at: new Date().toISOString(),
            })
            .eq('checkout_request_id', checkoutRequestId)
            .eq('status', 'PENDING');
          if (paymentUpdateError) throw paymentUpdateError;

          const { error: orderUpdateError } = await supabase.from('orders')
            .update({
              status: 'PAYMENT_FAILED',
              failure_reason: result.resultDesc || 'M-Pesa payment failed.',
              updated_at: new Date().toISOString(),
            })
            .eq('id', payment.order_id)
            .eq('checkout_request_id', checkoutRequestId);
          if (orderUpdateError) throw orderUpdateError;

          const refreshed = await supabase.from('payments').select('*')
            .eq('checkout_request_id', checkoutRequestId).single();
          payment = refreshed.data || payment;
        }
        // A successful STK query does not contain the receipt proof needed to mark the order PAID.
        // Wait for the callback to provide and verify the receipt metadata.
      } catch (queryError: any) {
        console.warn('[mpesa/status] Daraja query deferred:', queryError.message);
      }
    }

    return res.status(200).json({
      status: payment.status,
      checkoutRequestId: payment.checkout_request_id,
      orderId: payment.order_id,
      amount: Number(payment.amount),
      phoneNumber: payment.phone_number,
      mpesaReceiptNumber: payment.mpesa_receipt_number,
      resultDesc: payment.result_desc,
      completedAt: payment.completed_at,
    });
  } catch (error: any) {
    console.error('[mpesa/status] Error:', error.message);
    return res.status(500).json({ error: 'Could not check payment status.' });
  }
}
