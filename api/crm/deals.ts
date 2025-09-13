import { createServiceClient } from '../../lib/supabase';

type NextReq = any;
type NextRes = any;

const ALLOWED_STATUSES = ['offer', 'booked', 'paid', 'closed', 'cancelled'] as const;

export default async function handler(req: NextReq, res: NextRes) {
  const supabase = createServiceClient();
  if (!supabase) { res.status(500).json({ error: 'Supabase not configured' }); return; }

  if (req.method === 'POST') {
    try {
      const { lead_id, operator_id, title, total, currency = 'RUB', status = 'offer', created_by } = req.body || {};
      if (!lead_id || !title) { res.status(400).json({ error: 'lead_id and title required' }); return; }
      if (!ALLOWED_STATUSES.includes(status)) { res.status(400).json({ error: 'invalid status' }); return; }

      const payload: any = {
        lead_id,
        operator_id: operator_id ?? null,
        title,
        total: total ?? null,
        currency: currency ?? 'RUB',
        status,
        created_by: created_by ?? null,
      };

      const { data, error } = await supabase
        .from('crm_deals')
        .insert(payload)
        .select('id')
        .single();
      if (error) throw error;
      res.status(201).json({ id: data.id });
    } catch (e: any) {
      res.status(500).json({ error: e?.message || 'Deal create failed' });
    }
    return;
  }

  if (req.method === 'GET') {
    try {
      const { status, operator_id, lead_id, limit = 50 } = req.query || {};
      let q = supabase
        .from('crm_deals')
        .select('id, title, total, currency, status, created_at, lead_id, operator_id')
        .order('created_at', { ascending: false })
        .limit(Number(limit));
      if (status) q = q.eq('status', status as string);
      if (operator_id) q = q.eq('operator_id', operator_id as string);
      if (lead_id) q = q.eq('lead_id', lead_id as string);
      const { data, error } = await q;
      if (error) throw error;
      res.status(200).json({ deals: data });
    } catch (e: any) {
      res.status(500).json({ error: e?.message || 'Deal list failed' });
    }
    return;
  }

  if (req.method === 'PATCH') {
    try {
      const { id } = req.query || {};
      if (!id) { res.status(400).json({ error: 'id required' }); return; }

      const { title, total, currency, status } = req.body || {};
      const update: any = {};
      if (title !== undefined) update.title = title;
      if (total !== undefined) update.total = total;
      if (currency !== undefined) update.currency = currency;
      if (status !== undefined) {
        if (!ALLOWED_STATUSES.includes(status)) { res.status(400).json({ error: 'invalid status' }); return; }
        update.status = status;
      }
      if (Object.keys(update).length === 0) { res.status(400).json({ error: 'no fields to update' }); return; }

      const { data, error } = await supabase
        .from('crm_deals')
        .update(update)
        .eq('id', id as string)
        .select('id, status')
        .single();
      if (error) throw error;
      res.status(200).json({ id: data.id, status: data.status });
    } catch (e: any) {
      res.status(500).json({ error: e?.message || 'Deal update failed' });
    }
    return;
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}

