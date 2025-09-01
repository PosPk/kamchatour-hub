import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    const supabase = createServiceClient();
    if (supabase) {
      const { data, error } = await supabase.from('feed_posts').select('id, title, image_url, likes, created_at').order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      res.status(200).json({ ok: true, items: data });
      return;
    }
    res.status(200).json({ ok: true, items: [] });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'feed list failed' });
  }
}

