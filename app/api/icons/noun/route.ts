import { NextRequest, NextResponse } from 'next/server';

const map: Record<string, string> = {
  'вулканы': 'https://img.icons8.com/ios-filled/50/mountain.png',
  'рыбалка': 'https://img.icons8.com/ios-filled/50/fishing.png',
  'киты': 'https://img.icons8.com/ios-filled/50/whale.png',
  'хайкинг': 'https://img.icons8.com/ios-filled/50/trekking.png',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase();
  const url = map[q];
  return NextResponse.json({ icon: url ? { preview: url } : undefined });
}

