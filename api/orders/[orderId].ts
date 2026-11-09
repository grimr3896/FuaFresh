import { getSupabaseAdmin } from '../../server/supabaseAdmin';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const orderId = String(req.query.orderId || '');
    if (!orderId) return res.status(400).json({ error: 'Order ID is required.' });

    const { data, error } = await getSupabaseAdmin()
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Order not found.' });

    return res.status(200).json({
      order: {
        id: data.id,
        serviceId: data.service_id,
        serviceName: data.service_name,
        totalPrice: Number(data.total_price),
        status: data.status,
        mpesaReceiptNumber: data.mpesa_receipt_number,
      },
    });
  } catch (error: any) {
    console.error('[orders/:orderId] Error:', error.message);
    return res.status(500).json({ error: 'Could not retrieve booking order.' });
  }
}
