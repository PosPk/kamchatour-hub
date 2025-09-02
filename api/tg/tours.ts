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

