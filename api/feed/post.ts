import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    const { title, imageUrl, userId } = req.body || {};
    if (!imageUrl) {
      res.status(400).json({ ok: false, error: 'imageUrl required' });
      return;
    }
    const supabase = createServiceClient();
    if (supabase) {
      const { data, error } = await supabase.from('feed_posts').insert({ title, image_url: imageUrl, user_id: userId || null, likes: 0 }).select('id').single();
      if (error) throw error;
      res.status(200).json({ ok: true, id: data?.id });
      return;
    }
    res.status(200).json({ ok: true, id: null });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'feed post failed' });
  }
}

