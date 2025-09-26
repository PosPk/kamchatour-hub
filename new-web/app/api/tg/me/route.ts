import { NextResponse } from 'next/server';

export async function GET() {
  // MVP anonymous profile
  return NextResponse.json({ ok: true, user: { name: 'Пользователь', username: '', role: 'traveler' } });
}

