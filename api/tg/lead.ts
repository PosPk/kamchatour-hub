import { createClient } from '@supabase/supabase-js';

export const config = { runtime: 'nodejs' };

function json(data: any, status = 200, headers: HeadersInit = { 'Content-Type': 'application/json' }) {
  return new Response(JSON.stringify(data), { status, headers });
}

function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {}; if (!header) return out;
  header.split(';').forEach((p) => { const i = p.indexOf('='); if (i>-1){ out[p.slice(0,i).trim()] = decodeURIComponent(p.slice(i+1).trim()); } });
  return out;
}

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
    const SUPABASE_URL = process.env.SUPABASE_URL || '';
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return json({ ok: false, error: 'not_configured' }, 200);
    }
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    let body: any = {};
    const ctype = req.headers.get('content-type') || '';
    if (ctype.includes('application/json')) { body = await req.json(); }
    else if (ctype.includes('application/x-www-form-urlencoded')) { const fd = await req.formData(); body = Object.fromEntries(fd as any); }
    else { try { body = JSON.parse(await req.text()); } catch { body = {}; } }

    const name = String(body?.name || '').trim();
    const contact = String(body?.contact || '').trim();
    const payload = body?.payload || {};
    const tour_id = String(payload?.tour_id || body?.tour_id || '').trim();
    const message = String(payload?.msg || body?.msg || '').trim();
    if (!name || !contact) return json({ ok: false, error: 'validation' }, 400);

    const cookies = parseCookies(req.headers.get('cookie'));
    let user: any = undefined;
    try {
      const sess = cookies['tg_session'];
      if (sess) user = JSON.parse(Buffer.from(sess, 'base64url').toString('utf8'));
    } catch {}

    const row = {
      name,
      contact,
      message,
      tour_id: tour_id || null,
      source: 'tg_web',
      telegram_user_id: user?.id ? String(user.id) : null,
      telegram_username: user?.username || null,
      role: user?.role || null,
    } as const;

    const { data, error } = await sb.from('leads').insert(row).select().single();
    if (error) return json({ ok: false, error: error.message }, 200);

    return json({ ok: true, id: data?.id || null });
  } catch (e: any) {
    return json({ ok: false, error: 'internal_error', detail: String(e?.message || e) }, 200);
  }
}

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

