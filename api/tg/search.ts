import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServiceClient } from '../../lib/supabase';
import fs from 'node:fs';
import path from 'node:path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const q = String((req.query.q as string) || '').trim();
    const supabase = createServiceClient();
    if (supabase) {
      let query = supabase
        .from('tours')
        .select('id, title, title_i18n, region, activity, price_from, duration_days, rating, description, description_i18n')
        .order('updated_at', { ascending: false })
        .limit(200);
      if (q) {
        // OR filter across fields
        const pattern = `%${q}%`;
        // @ts-ignore - supabase or filter
        query = query.or(`title.ilike.${pattern},description.ilike.${pattern},region.ilike.${pattern},activity.ilike.${pattern}`);
      }
      const { data, error } = await query;
      if (!error && data) {
        res.status(200).json({ ok: true, items: data });
        return;
      }
    }

    // Fallback to static JSON
    const file = path.resolve(process.cwd(), 'public', 'partner-tours.json');
    const raw = fs.readFileSync(file, 'utf8');
    const items = JSON.parse(raw);
    const filtered = q
      ? items.filter((x: any) =>
          [x.title, x.description, x.region, x.activity]
            .filter(Boolean)
            .some((v: string) => String(v).toLowerCase().includes(q.toLowerCase()))
        )
      : items;
    res.status(200).json({ ok: true, items: filtered.slice(0, 200) });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'search failed' });
  }
}

