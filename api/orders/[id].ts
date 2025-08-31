import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    const id = String(req.query?.id || '');
    if (!id) {
      res.status(400).json({ ok: false, error: 'id required' });
      return;
    }
    const supabase = createServiceClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, created_at, status, total_price, order_items ( quantity, price ), tour:tour_id ( name )')
        .eq('id', id)
        .single();
      if (error) throw error;
      res.status(200).json({ ok: true, item: data });
      return;
    }
    res.status(200).json({ ok: true, item: null });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'order get failed' });
  }
}

