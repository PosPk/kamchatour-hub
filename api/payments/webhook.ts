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
    let holdId: string | null = null;

    if (provider === 'yookassa') {
      // Expect payload.object.status and payload.object.id; metadata.booking_id
      const obj = payload.object || {};
      paymentId = obj.id || null;
      bookingId = obj.metadata?.booking_id || null;
      holdId = obj.metadata?.hold_id || null;
      status = obj.status === 'succeeded' ? 'paid' : (obj.status === 'canceled' || obj.status === 'canceled_by_user' ? 'payment_failed' : 'pending');
    } else if (provider === 'cloudpayments') {
      paymentId = payload.TransactionId?.toString() || null;
      bookingId = payload.InvoiceId || payload.Data?.booking_id || null;
      holdId = payload.AccountId || payload.Data?.hold_id || null;
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

    // Update booking via RPC to keep seat state in sync
    if (status === 'paid' && holdId) {
      const { data: confirmed, error: cErr } = await supabase.rpc('transfer_confirm_payment', { p_hold_id: holdId, p_amount: payload?.amount?.value || payload?.Amount || null });
      if (cErr) throw cErr;
    } else if (status === 'payment_failed' && holdId) {
      const { error: xErr } = await supabase.rpc('transfer_cancel_payment', { p_hold_id: holdId });
      if (xErr) throw xErr;
    } else if (status !== 'pending' && bookingId) {
      await supabase.from('bookings').update({ status: status === 'paid' ? 'paid' : 'payment_failed' }).eq('id', bookingId);
    }

    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'webhook failed' });
  }
}

