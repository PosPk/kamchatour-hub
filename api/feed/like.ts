import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    const { id } = req.body || {};
    if (!id) { res.status(400).json({ ok: false, error: 'id required' }); return; }
    const supabase = createServiceClient();
    if (supabase) {
      const { data, error } = await supabase.rpc('feed_like', { post_id: id });
      if (error) throw error;
      res.status(200).json({ ok: true });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'feed like failed' });
  }
}

