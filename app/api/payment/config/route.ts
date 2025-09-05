import { NextResponse } from 'next/server';

export async function GET() {
  const enabled = process.env.CP_ENABLED === '1' || false;
  const publicId = process.env.CP_PUBLIC_ID || '';
  const commission = Number(process.env.CP_COMMISSION || 0);
  const level = (process.env.OP_LEVEL_DEFAULT as 'L1'|'L2'|'L3') || 'L1';
  return NextResponse.json({ enabled, publicId, commission, level });
}

