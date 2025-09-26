import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase();
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(new URL('/partner-tours.json', base));
    const items: any[] = await res.json();
    const filtered = items.filter((x) => {
      const hay = `${x.title || ''} ${x.description || ''} ${x.activity || ''} ${x.region || ''}`.toLowerCase();
      return !q || hay.includes(q);
    });
    return NextResponse.json({ items: filtered });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

