import { createServiceClient } from '../../lib/supabase';
import crypto from 'crypto';

const supabase = createServiceClient();

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const bookingId = String(req.query?.bookingId || '');
    if (!bookingId) {
      res.status(400).json({ error: 'bookingId required' });
      return;
    }

    // If Supabase configured, validate status; otherwise allow (demo mode)
    if (supabase) {
      const { data: booking, error: bErr } = await supabase
        .from('bookings')
        .select('id, status')
        .eq('id', bookingId)
        .single();
      if (bErr) throw bErr;
      if (!booking || booking.status !== 'paid') {
        res.status(400).json({ error: 'booking not paid' });
        return;
      }
    }

    // Generate token (HMAC of bookingId + ts)
    const secret = process.env.CLOUDPAYMENTS_API_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'secret';
    const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24h
    const payload = `${bookingId}.${expiresAt}`;
    const token = `${payload}.${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;

    res.status(200).json({ token, bookingId, expiresAt });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'ticket issue failed' });
  }
}

