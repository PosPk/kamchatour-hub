import { NextResponse } from 'next/server';

export async function GET() {
  const enabled = (process.env.CLOUDPAYMENTS_PUBLIC_ID ? true : false);
  const publicId = process.env.CLOUDPAYMENTS_PUBLIC_ID || '';
  const commission = Number(process.env.CLOUDPAYMENTS_COMMISSION || 0);
  const level = (process.env.OP_LEVEL_DEFAULT as 'L1'|'L2'|'L3') || 'L1';
  return NextResponse.json({ enabled, publicId, commission, level });
}

