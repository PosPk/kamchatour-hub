import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method Not Allowed' }); return; }
  const supabase = createServiceClient();
  if (!supabase) { res.status(500).json({ error: 'Supabase service key missing' }); return; }

  try {
    const { id, reason } = (req.body ?? {}) as any;
    if (!id) { res.status(400).json({ error: 'id is required' }); return; }

    const { error } = await supabase.from('bookings').update({ status: 'cancel_requested', notes: reason ?? null, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) { res.status(500).json({ error: error.message }); return; }

    await supabase.from('booking_events').insert({ booking_id: id, actor: 'user', type: 'cancel_requested', data: reason ? { reason } : null });

    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Unexpected error' });
  }
}

