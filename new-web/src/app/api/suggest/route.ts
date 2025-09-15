import { NextRequest, NextResponse } from 'next/server'

const YA_SUGGEST_URL = 'https://suggest-maps.yandex.ru/v1/';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const apiKey = process.env.YANDEX_MAPS_API_KEY || process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'YANDEX_MAPS_API_KEY not configured' }, { status: 500 });
    }

    const params = new URLSearchParams();
    params.set('apikey', apiKey);
    params.set('lang', searchParams.get('lang') || 'ru_RU');
    params.set('text', searchParams.get('text') || searchParams.get('q') || '');
    if (searchParams.get('results')) params.set('results', searchParams.get('results')!);
    if (searchParams.get('ll')) params.set('ll', searchParams.get('ll')!);
    if (searchParams.get('spn')) params.set('spn', searchParams.get('spn')!);

    const upstream = await fetch(`${YA_SUGGEST_URL}?${params.toString()}`, {
      method: 'GET',
      headers: { 'accept': 'application/json' },
      next: { revalidate: 300 },
    });
    const data = await upstream.json();
    const res = NextResponse.json(data, { status: 200 });
    res.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=300');
    return res;
  } catch {
    return NextResponse.json({ error: 'suggest failed' }, { status: 500 });
  }
}

