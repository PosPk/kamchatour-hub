import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In MVP, read from public JSON
    const res = await fetch(new URL('/partner-tours.json', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
    if (!res.ok) throw new Error('failed');
    const items = await res.json();
    return NextResponse.json({ items });
  } catch {
    // Fallback to static embed (same file path when running in prod)
    try {
      const res = await fetch('http://localhost:3000/partner-tours.json');
      const items = await res.json();
      return NextResponse.json({ items });
    } catch {
      return NextResponse.json({ items: [] });
    }
  }
}

