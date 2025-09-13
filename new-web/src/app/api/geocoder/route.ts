import { NextRequest, NextResponse } from 'next/server';

const YA_GEOCODER_URL = 'https://geocode-maps.yandex.ru/1.x/';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const apiKey = process.env.YANDEX_MAPS_API_KEY || process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;
    // If Yandex key is missing, fallback to OpenStreetMap Nominatim for demo
    if (!apiKey) {
      const q = searchParams.get('geocode') || searchParams.get('q') || '';
      const limit = searchParams.get('limit') || '5';
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=${encodeURIComponent(limit)}`;
      const upstream = await fetch(nominatimUrl, {
        headers: {
          'accept': 'application/json',
          'user-agent': 'TourHab/preview (contact: admin@tourhab.example)'
        },
        next: { revalidate: 600 },
      });
      const data = await upstream.json();
      const res = NextResponse.json({ provider: 'osm', results: data }, { status: 200 });
      res.headers.set('Cache-Control', 'public, max-age=60, s-maxage=600, stale-while-revalidate=300');
      return res;
    }
    const params = new URLSearchParams();
    params.set('format', 'json');
    params.set('apikey', apiKey);
    for (const [key, value] of searchParams.entries()) {
      if (key === 'apikey') continue;
      params.set(key, value);
    }

    const upstream = await fetch(`${YA_GEOCODER_URL}?${params.toString()}`, {
      method: 'GET',
      headers: { 'accept': 'application/json' },
      // Edge cache for 10 minutes
      next: { revalidate: 600 },
    });
    const data = await upstream.json();

    const res = NextResponse.json(data, { status: 200 });
    res.headers.set('Cache-Control', 'public, max-age=60, s-maxage=600, stale-while-revalidate=300');
    return res;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'geocode failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

