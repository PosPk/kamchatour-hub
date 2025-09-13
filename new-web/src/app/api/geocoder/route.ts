import { NextRequest, NextResponse } from 'next/server';

const YA_GEOCODER_URL = 'https://geocode-maps.yandex.ru/1.x/';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const apiKey = process.env.YANDEX_MAPS_API_KEY || process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'YANDEX_MAPS_API_KEY not configured' }, { status: 500 });
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
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'geocode failed' }, { status: 500 });
  }
}

