import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      supabase: Boolean((process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) || (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)),
      payments: Boolean(process.env.CLOUDPAYMENTS_PUBLIC_ID),
      cloudpaysSecret: Boolean(process.env.CLOUDPAYMENTS_API_SECRET),
      telegramBot: Boolean(process.env.TELEGRAM_BOT_TOKEN),
      ai: process.env.AI_PROVIDER || 'openai',
      bugsnag: Boolean(process.env.EXPO_PUBLIC_BUGSNAG_API_KEY),
      axiom: Boolean(process.env.AXIOM_TOKEN && process.env.AXIOM_DATASET),
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'env failed' }, { status: 500 });
  }
}

