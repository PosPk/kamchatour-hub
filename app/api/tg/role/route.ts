import { NextRequest, NextResponse } from 'next/server';

let roleState: 'traveler'|'operator'|'rental'|'transfer'|'agent' = 'traveler';

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();
    if (!role) return NextResponse.json({ ok: false }, { status: 400 });
    roleState = role;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

