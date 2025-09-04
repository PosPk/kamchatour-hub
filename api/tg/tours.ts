import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = { runtime: 'nodejs' };

async function fetchPartnerTours(origin?: string) {
  try {
    const url = origin ? `${origin}/partner-tours.json` : 'https://kamchatour-hub.vercel.app/partner-tours.json';
    const r = await fetch(url as any, { cache: 'no-store' } as any);
    if (!r.ok) return [];
    const json = await r.json();
    return Array.isArray(json) ? json : [];
  } catch { return []; }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || '';
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const originHeader = (req.headers['x-forwarded-host'] as string) || (process.env.VERCEL_URL ? `${process.env.VERCEL_URL}` : '');
    const origin = originHeader ? `https://${originHeader}` : undefined;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      // fallback to bundled JSON
      const items = await fetchPartnerTours(origin);
      res.status(200).json({ ok: true, source: 'fallback', items });
      return;
    }

    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    let q = sb.from('tours').select('*').limit(200);

    const search = String(req.query.q || '').trim();
    if (search) {
      // simple ilike on title/description/activity/region if columns exist
      q = q.or(`title.ilike.%${search}%,description.ilike.%${search}%,activity.ilike.%${search}%,region.ilike.%${search}%`);
    }

    const { data, error } = await q;
    if (error) {
      const items = await fetchPartnerTours(origin);
      res.status(200).json({ ok: true, source: 'fallback_error', items });
      return;
    }
    res.status(200).json({ ok: true, source: 'supabase', items: data || [] });
  } catch (e: any) {
    res.status(200).json({ ok: false, error: String(e?.message || e) });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServiceClient } from '../../lib/supabase';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const supabase = createServiceClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('tours')
        .select('id, title, title_i18n, region, activity, price_from, duration_days, rating, description, description_i18n')
        .order('updated_at', { ascending: false })
        .limit(100);
      if (error) throw new Error(error.message);
      res.status(200).json({ ok: true, items: (data || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        title_i18n: t.title_i18n || null,
        region: t.region || null,
        activity: t.activity || null,
        price_from: t.price_from || null,
        duration_days: t.duration_days || null,
        rating: t.rating || null,
        description: t.description || null,
        description_i18n: t.description_i18n || null,
        image: null,
      })) });
      return;
    }
  } catch (_e) {
    // fall through to static fallback
  }
  res.status(200).json({ ok: true, items: [] });
}

