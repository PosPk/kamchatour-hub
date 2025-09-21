import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const aiProvider = process.env.AI_PROVIDER || 'openai';
    const payments = Boolean(process.env.CLOUDPAYMENTS_PUBLIC_ID);
    const supabase = Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
    return NextResponse.json({ ok: true, aiProvider, features: { payments, supabase, aiAssist: true, voiceSearch: true, tickets: true } });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'config failed' }, { status: 500 });
  }
}

