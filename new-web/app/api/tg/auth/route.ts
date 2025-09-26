import { NextRequest, NextResponse } from 'next/server';

// NOTE: MVP: stub accept, real app must validate Telegram initData HMAC
export async function POST(req: NextRequest) {
  try {
    const { initData } = await req.json();
    if (!initData) return NextResponse.json({ ok: false }, { status: 400 });
    // TODO: validate per Telegram docs using bot token
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

