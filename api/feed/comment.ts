import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    const { postId, text, userId } = req.body || {};
    if (!postId || !text) { res.status(400).json({ ok: false, error: 'postId and text required' }); return; }
    const supabase = createServiceClient();
    if (supabase) {
      const { error } = await supabase.from('feed_comments').insert({ post_id: postId, text, user_id: userId || null });
      if (error) throw error;
      res.status(200).json({ ok: true });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'feed comment failed' });
  }
}

