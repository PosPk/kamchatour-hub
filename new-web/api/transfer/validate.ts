import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const token = String(req.query?.token || '');
    if (!token) {
      res.status(400).json({ error: 'token required' });
      return;
    }
    const secret = process.env.CLOUDPAYMENTS_API_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'secret';
    const parts = token.split('.');
    if (parts.length !== 3) {
      res.status(200).json({ valid: false, reason: 'bad token' });
      return;
    }
    const [bookingId, expStr, hmac] = parts;
    const payload = `${bookingId}.${expStr}`;
    const calc = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    if (calc !== hmac) {
      res.status(200).json({ valid: false, reason: 'invalid signature' });
      return;
    }
    const expiresAt = Number(expStr);
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      res.status(200).json({ valid: false, reason: 'expired', bookingId, expiresAt });
      return;
    }
    res.status(200).json({ valid: true, bookingId, expiresAt });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'validate failed' });
  }
}

