import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    const userId = String(req.query?.userId || '') || undefined;
    const supabase = createServiceClient();
    if (supabase) {
      let q = supabase.from('bookings').select('id, created_at, status, total_price').order('created_at', { ascending: false }).limit(50);
      if (userId) q = q.eq('user_id', userId);
      const { data, error } = await q;
      if (error) throw error;
      res.status(200).json({ ok: true, items: data || [] });
      return;
    }
    // Fallback demo data
    res.status(200).json({ ok: true, items: [] });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'orders list failed' });
  }
}

