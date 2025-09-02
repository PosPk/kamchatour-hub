import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServiceClient } from '../../lib/supabase';

function isAuthorized(req: VercelRequest) {
  const token = req.headers['x-admin-token'] || req.query.token;
  return Boolean(process.env.ADMIN_API_TOKEN && token === process.env.ADMIN_API_TOKEN);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthorized(req)) { res.status(401).json({ error: 'Unauthorized' }); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method Not Allowed' }); return; }
  const supabase = createServiceClient();
  if (!supabase) { res.status(500).json({ error: 'Supabase service key missing' }); return; }

  try {
    const body = (req.body ?? {}) as any;
    const items = Array.isArray(body?.items) ? body.items : [];
    if (!items.length) { res.status(400).json({ error: 'items[] required' }); return; }

    const rows = items.map((x:any)=>({
      id: String(x.id),
      operator_id: x.operator_id ?? null,
      title: x.title,
      region: x.region ?? null,
      activity: x.activity ?? null,
      price_from: x.price_from ?? null,
      duration_days: x.duration_days ?? null,
      rating: x.rating ?? null,
      description: x.description ?? null,
    }));

    const { error } = await supabase.from('tours').upsert(rows, { onConflict: 'id' });
    if (error) { res.status(500).json({ error: error.message }); return; }

    res.status(200).json({ ok: true, count: rows.length });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Unexpected error' });
  }
}

