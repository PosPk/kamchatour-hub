import { NextResponse } from 'next/server';

export async function GET() {
  const mask = (v?: string) => (v ? Boolean(v) : false);
  return NextResponse.json(
    {
      supabase: mask(process.env.SUPABASE_URL) && mask(process.env.SUPABASE_ANON_KEY),
      payments: mask(process.env.CLOUDPAYMENTS_PUBLIC_ID),
      telegramBot: mask(process.env.TELEGRAM_BOT_TOKEN),
      ai: mask(process.env.OPENAI_API_KEY) || mask(process.env.GROQ_API_KEY),
      axiom: mask(process.env.AXIOM_TOKEN),
      maps: mask(process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY),
      metrika: mask(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID),
      disk: mask(process.env.YANDEX_DISK_OAUTH_TOKEN),
    },
    { status: 200 },
  );
}

