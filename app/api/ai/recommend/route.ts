import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(new URL('/partner-tours.json', base));
    const items: any[] = await res.json();
    const q = String(query || '').toLowerCase();
    const ranked = items
      .map((x) => ({ x, score: q ? ((`${x.title} ${x.description} ${x.activity} ${x.region}` || '').toLowerCase().includes(q) ? 1 : 0) : 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(({ x }) => ({ id: x.id, title: x.title, image: x.image, activity: x.activity, region: x.region, price_from: x.price_from }));
    return NextResponse.json({ items: ranked });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

