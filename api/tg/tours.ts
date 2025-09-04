import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServiceClient } from '../../lib/supabase';

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

function pickCoordinates(t: any) {
  const lat = t.lat ?? t.latitude ?? t?.coordinates?.lat ?? t?.coordinates?.latitude;
  const lon = t.lon ?? t.lng ?? t.longitude ?? t?.coordinates?.lon ?? t?.coordinates?.lng ?? t?.coordinates?.longitude;
  if (typeof lat === 'number' && typeof lon === 'number') {
    return { lat, lon };
  }
  return null;
}

// Approximate centroids for common Kamchatka regions used in tours
const regionToCoords: Record<string, { lat: number; lon: number }> = {
  'Авачинская бухта': { lat: 52.9630, lon: 158.2463 },
  'Авачинский': { lat: 53.2567, lon: 158.8367 },
  'Мутновский': { lat: 52.4498, lon: 158.1991 },
  'Курильское озеро': { lat: 51.4567, lon: 157.3320 },
  'Южная Камчатка': { lat: 52.7000, lon: 158.6000 },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const originHeader = (req.headers['x-forwarded-host'] as string) || (process.env.VERCEL_URL ? `${process.env.VERCEL_URL}` : '');
    const origin = originHeader ? `https://${originHeader}` : undefined;

    const supabase = createServiceClient();
    if (supabase) {
      let query = supabase
        .from('tours')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(200);

      const q = String(req.query.q || '').trim();
      if (q) {
        const pattern = `%${q}%`;
        // @ts-ignore OR filter across common text fields
        query = query.or(`title.ilike.${pattern},description.ilike.${pattern},region.ilike.${pattern},activity.ilike.${pattern}`);
      }

      const { data, error } = await query;
      if (!error && data) {
        const items = (data || []).map((t: any) => {
          let coords = pickCoordinates(t);
          if (!coords && t.region && typeof t.region === 'string') {
            const key = t.region.trim();
            if (regionToCoords[key]) coords = regionToCoords[key];
          }
          return {
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
            image: t.image || t.image_url || null,
            lat: coords?.lat ?? null,
            lon: coords?.lon ?? null,
          };
        });
        res.status(200).json({ ok: true, items });
        return;
      }
    }

    // Fallback to bundled JSON
    const items = (await fetchPartnerTours(origin)).map((t: any) => {
      let coords = pickCoordinates(t);
      if (!coords && t.region && typeof t.region === 'string') {
        const key = t.region.trim();
        if (regionToCoords[key]) coords = regionToCoords[key];
      }
      return {
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
        image: t.image || t.image_url || null,
        lat: coords?.lat ?? null,
        lon: coords?.lon ?? null,
      };
    });
    res.status(200).json({ ok: true, items });
  } catch (e: any) {
    res.status(200).json({ ok: false, error: String(e?.message || e) });
  }
}

