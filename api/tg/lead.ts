import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { name, contact, payload, tour_id, tg_user_id, tg_chat_id } = (req.body ?? {}) as any;
    if (!name || !contact) {
      res.status(400).json({ error: 'name and contact are required' });
      return;
    }

    const supabase = createServiceClient();
    if (!supabase) {
      res.status(500).json({ error: 'Supabase service key is not configured' });
      return;
    }

    const { error } = await supabase.from('leads').insert({
      name,
      contact,
      tour_id: tour_id ?? payload?.tour_id ?? null,
      tg_user_id: tg_user_id ?? null,
      tg_chat_id: tg_chat_id ?? null,
      payload: payload ?? null,
    });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Unexpected error' });
  }
}

