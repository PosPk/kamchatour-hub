import { NextRequest, NextResponse } from 'next/server'

const YA_ROUTES_URL = 'https://router.yandex.net/v2/route';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const apiKey = process.env.YANDEX_MAPS_API_KEY || process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'YANDEX_MAPS_API_KEY not configured' }, { status: 500 });
    }

    // Expect coords as ll strings "lon,lat" e.g., point=158.65,53.01
    const points = searchParams.getAll('point');
    if (points.length < 2) {
      return NextResponse.json({ error: 'at least two point parameters required' }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.set('apikey', apiKey);
    points.forEach(p => params.append('point', p));
    if (searchParams.get('type')) params.set('type', searchParams.get('type')!); // auto/pedestrian/etc

    const upstream = await fetch(`${YA_ROUTES_URL}?${params.toString()}`, {
      method: 'GET',
      headers: { 'accept': 'application/json' },
      next: { revalidate: 300 },
    });
    const data = await upstream.json();
    const res = NextResponse.json(data, { status: 200 });
    res.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=300');
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'routes failed' }, { status: 500 });
  }
}

