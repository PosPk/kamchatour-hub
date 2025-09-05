import { NextRequest, NextResponse } from 'next/server';

let level: 'L1'|'L2'|'L3' = 'L1';

export async function GET() {
  return NextResponse.json({ level });
}

export async function POST(req: NextRequest) {
  try {
    const { level: lv } = await req.json();
    if (!['L1','L2','L3'].includes(lv)) return NextResponse.json({ ok: false }, { status: 400 });
    level = lv;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

