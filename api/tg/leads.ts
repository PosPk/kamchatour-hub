import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServiceClient } from '../../lib/supabase';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const adminToken = process.env.ADMIN_API_TOKEN || process.env.ADMIN_TOKEN || '';
    const provided = (req.headers['x-admin-token'] as string) || '';
    if (!adminToken || !provided || provided !== adminToken) {
      res.status(200).json({ ok: false, error: 'not_authorized' });
      return;
    }

    const supabase = createServiceClient();
    if (!supabase) {
      res.status(200).json({ ok: true, items: [] });
      return;
    }

    const limit = Math.min(Number(req.query.limit || 100), 500);
    const { data, error } = await supabase
      .from('leads')
      .select('id, tour_id, name, contact, tg_user_id, tg_chat_id, payload, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    res.status(200).json({ ok: true, items: data || [] });
  } catch (e: any) {
    res.status(200).json({ ok: false, error: String(e?.message || e) });
  }
}

