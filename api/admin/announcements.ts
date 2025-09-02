import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServiceClient } from '../../lib/supabase';

function isAuthorized(req: VercelRequest): boolean {
  const header = req.headers['x-admin-token'] || req.query.token;
  const expected = process.env.ADMIN_API_TOKEN;
  return Boolean(expected && header === expected);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthorized(req)) { res.status(401).json({ error: 'Unauthorized' }); return; }
  const supabase = createServiceClient();
  if (!supabase) { res.status(500).json({ error: 'Supabase service key missing' }); return; }

  try {
    if (req.method === 'GET') {
      const status = (req.query.status as string) || 'pending';
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });
      if (error) { res.status(500).json({ error: error.message }); return; }
      res.status(200).json({ ok: true, items: data });
      return;
    }

    if (req.method === 'POST') {
      const { id, action } = (req.body ?? {}) as { id?: string; action?: 'approve' | 'reject' };
      if (!id || !action) { res.status(400).json({ error: 'id and action are required' }); return; }
      const updates: any = { status: action === 'approve' ? 'approved' : 'rejected' };
      if (action === 'approve') updates.approved_at = new Date().toISOString();
      if (action === 'reject') updates.rejected_at = new Date().toISOString();

      const { error } = await supabase.from('announcements').update(updates).eq('id', id);
      if (error) { res.status(500).json({ error: error.message }); return; }
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Unexpected error' });
  }
}

