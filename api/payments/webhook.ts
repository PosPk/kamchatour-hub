import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') { res.status(405).json({ ok: false }); return; }
  try {
    const provider = (req.headers['x-provider'] as string | undefined)?.toLowerCase() || 'yookassa';
    const supabase = createServiceClient();
    if (!supabase) { res.status(500).json({ ok: false, error: 'Supabase not configured' }); return; }

    // Parse payload
    const payload = req.body || {};
    let bookingId: string | null = null;
    let paymentId: string | null = null;
    let status: 'paid' | 'payment_failed' | 'pending' = 'pending';

    if (provider === 'yookassa') {
      // Expect payload.object.status and payload.object.id; metadata.booking_id
      const obj = payload.object || {};
      paymentId = obj.id || null;
      bookingId = obj.metadata?.booking_id || null;
      status = obj.status === 'succeeded' ? 'paid' : (obj.status === 'canceled' || obj.status === 'canceled_by_user' ? 'payment_failed' : 'pending');
    } else if (provider === 'cloudpayments') {
      paymentId = payload.TransactionId?.toString() || null;
      bookingId = payload.InvoiceId || payload.Data?.booking_id || null;
      status = payload.Status === 'Completed' ? 'paid' : 'pending';
    }

    if (!bookingId || !paymentId) { res.status(400).json({ ok: false, error: 'Invalid payload' }); return; }

    // Upsert payment
    await supabase.from('payments').upsert({
      id: paymentId,
      booking_id: bookingId as any,
      provider,
      status: status === 'paid' ? 'paid' : (status === 'payment_failed' ? 'payment_failed' : 'pending'),
      payload
    });

    // Update booking status
    if (status === 'paid') {
      await supabase.from('bookings').update({ status: 'paid' }).eq('id', bookingId);
    } else if (status === 'payment_failed') {
      await supabase.from('bookings').update({ status: 'payment_failed' }).eq('id', bookingId);
    }

    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'webhook failed' });
  }
}

