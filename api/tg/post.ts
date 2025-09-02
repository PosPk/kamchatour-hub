import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method Not Allowed' }); return; }
  try {
    const token = req.headers['x-telegram-token'] || req.query.token;
    const expected = process.env.TG_WEBHOOK_TOKEN;
    if (!expected || token !== expected) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const body = req.body || {};
    const content = {
      source: 'telegram:bot',
      source_id: String(body.message_id || body.update_id || ''),
      operator_id: body.operator_id || null,
      title: body.title || null,
      text: body.text || body.caption || null,
      media: body.media || null,
      status: 'pending',
    };

    const supabase = createServiceClient();
    if (!supabase) { res.status(500).json({ error: 'Supabase service key missing' }); return; }
    const { error } = await supabase.from('announcements').insert(content);
    if (error) { res.status(500).json({ error: error.message }); return; }
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Unexpected error' });
  }
}

