import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method Not Allowed' }); return; }
  const supabase = createServiceClient();
  if (!supabase) { res.status(500).json({ error: 'Supabase service key missing' }); return; }

  try {
    const { tour_id, operator_id, date_from, date_to, party_size, contact, tg_user_id, payload } = (req.body ?? {}) as any;
    if (!tour_id || !contact) { res.status(400).json({ error: 'tour_id and contact are required' }); return; }

    const insert = {
      tour_id,
      operator_id: operator_id ?? null,
      date_from: date_from ?? null,
      date_to: date_to ?? null,
      party_size: party_size ?? null,
      contact,
      tg_user_id: tg_user_id ?? null,
      payload: payload ?? null,
      status: 'prebook_pending',
    };

    const { data, error } = await supabase.from('bookings').insert(insert).select('id').single();
    if (error) { res.status(500).json({ error: error.message }); return; }

    await supabase.from('booking_events').insert({
      booking_id: data.id,
      actor: 'user',
      type: 'prebook_created',
      data: insert as any,
    });

    res.status(200).json({ ok: true, id: data.id });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Unexpected error' });
  }
}

