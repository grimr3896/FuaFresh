import { getSupabaseAdmin } from '../../server/supabaseAdmin';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ResultCode: 1, ResultDesc: 'Method not allowed' });
  }

  try {
    const callback = req.body?.Body?.stkCallback;
    const checkoutRequestId = String(callback?.CheckoutRequestID || '');
    if (!checkoutRequestId) {
      return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    const supabase = getSupabaseAdmin();
    const { data: payment, error } = await supabase.from('payments')
      .select('*')
      .eq('checkout_request_id', checkoutRequestId)
      .maybeSingle();

    if (error) throw error;
    if (!payment || ['SUCCESS', 'FAILED', 'CANCELLED'].includes(payment.status)) {
      return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    const resultCode = Number(callback.ResultCode);
    const resultDesc = String(callback.ResultDesc || '');
    const items = Array.isArray(callback.CallbackMetadata?.Item) ? callback.CallbackMetadata.Item : [];
    const value = (name: string) => items.find((item: any) => item.Name === name)?.Value;

    if (resultCode === 0) {
      const receipt = value('MpesaReceiptNumber');
      const amount = Number(value('Amount'));
      const paidPhone = value('PhoneNumber') ? String(value('PhoneNumber')) : '';
      if (!receipt || amount !== Number(payment.amount) || (paidPhone && paidPhone !== payment.phone_number)) {
        console.error('[mpesa/callback] Success callback did not match stored payment details.');
        return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted; awaiting verified receipt details' });
      }

      const transactionDate = value('TransactionDate');
      const { error: paymentUpdateError } = await supabase.from('payments')
        .update({
          status: 'SUCCESS',
          result_code: 0,
          result_desc: resultDesc,
          mpesa_receipt_number: String(receipt),
          transaction_date: transactionDate ? String(transactionDate) : null,
          completed_at: new Date().toISOString(),
        })
        .eq('checkout_request_id', checkoutRequestId)
        .eq('status', 'PENDING');
      if (paymentUpdateError) throw paymentUpdateError;

      const { error: orderUpdateError } = await supabase.from('orders')
        .update({
          status: 'PAID',
          mpesa_receipt_number: String(receipt),
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.order_id)
        .eq('checkout_request_id', checkoutRequestId);
      if (orderUpdateError) throw orderUpdateError;
    } else {
      const status = resultCode === 1032 ? 'CANCELLED' : 'FAILED';
      const { error: paymentUpdateError } = await supabase.from('payments')
        .update({
          status,
          result_code: resultCode,
          result_desc: resultDesc,
          completed_at: new Date().toISOString(),
        })
        .eq('checkout_request_id', checkoutRequestId)
        .eq('status', 'PENDING');
      if (paymentUpdateError) throw paymentUpdateError;

      const { error: orderUpdateError } = await supabase.from('orders')
        .update({
          status: 'PAYMENT_FAILED',
          failure_reason: resultDesc || (status === 'CANCELLED' ? 'Customer cancelled payment.' : 'M-Pesa payment failed.'),
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.order_id)
        .eq('checkout_request_id', checkoutRequestId);
      if (orderUpdateError) throw orderUpdateError;
    }

    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error: any) {
    console.error('[mpesa/callback] Processing error:', error.message);
    // Acknowledge Safaricom callback to avoid repeated delivery; reconcile using status query/support.
    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted for reconciliation' });
  }
}
