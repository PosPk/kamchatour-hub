import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServiceClient } from '../../lib/supabase';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'method_not_allowed' }); return; }
    const supabase = createServiceClient();
    if (!supabase) { res.status(200).json({ ok: true }); return; }
    const body: any = typeof req.body === 'object' && req.body || {};
    const events: any[] = Array.isArray(body?.events) ? body.events : [body];
    const normalized = events.map((e) => ({
      type: String(e?.type||'event'),
      ts: new Date().toISOString(),
      tour_id: e?.tour_id ? String(e.tour_id) : null,
      value: typeof e?.value === 'number' ? e.value : null,
      meta: e?.meta && typeof e.meta === 'object' ? e.meta : null,
      source: 'tg_web'
    }));
    // store into audit_log as generic
    await supabase.from('audit_log').insert(normalized.map(n => ({
      table_name: 'analytics',
      record_id: n.tour_id,
      operation: n.type,
      new_data: n,
    })));
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(200).json({ ok: false, error: String(e?.message || e) });
  }
}

