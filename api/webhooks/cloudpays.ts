import { createServiceClient } from '../../lib/supabase';
import crypto from 'crypto';
const supabase = createServiceClient();

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
    return;
  }

  try {
    const body = req.body || {};
    // Basic log for debugging; replace with proper logger/Sentry in prod
    try { console.log('cloudpays webhook', { headers: req.headers, body }); } catch {}

    // Verify CloudPayments signature (X-Signature) using HMAC SHA256 of raw body
    const signature = req.headers['x-signature'] as string | undefined;
    const secret = process.env.CLOUDPAYMENTS_API_SECRET as string | undefined;
    if (!secret || !signature) {
      res.status(401).json({ success: false, error: 'No signature/secret' });
      return;
    }

    // In Vercel/Node, body may already be parsed; reconstruct canonical string
    const payloadString = typeof req.rawBody === 'string'
      ? req.rawBody
      : typeof req.body === 'string'
        ? req.body
        : JSON.stringify(req.body || {});
    const hmac = crypto.createHmac('sha256', secret).update(payloadString, 'utf8').digest('base64');
    if (hmac !== signature) {
      res.status(401).json({ success: false, error: 'Bad signature' });
      return;
    }

    if (!supabase) {
      res.status(500).json({ success: false, error: 'Supabase not configured' });
      return;
    }

    const bookingId = body?.AccountId;
    if (!bookingId) {
      res.status(400).json({ success: false, error: 'No booking id' });
      return;
    }

    // Idempotency by CloudPayments TransactionId
    const actionId = body?.TransactionId || body?.Id || body?.InvoiceId;
    const status = body?.Status === 'Completed' ? 'paid' : 'payment_failed';

    // Upsert payment record and update booking in a best-effort sequence
    const { error: pErr } = await supabase
      .from('payments')
      .upsert({ id: actionId, booking_id: bookingId, status, provider: 'cloudpayments', payload: body }, { onConflict: 'id' });
    if (pErr) throw pErr;

    const { error } = await supabase
      .from('bookings')
      .update({ status, payment_data: body, payment_id: actionId })
      .eq('id', bookingId);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('cloudpays webhook error', error);
    res.status(500).json({ success: false, error: 'Ошибка обработки вебхука' });
  }
}

