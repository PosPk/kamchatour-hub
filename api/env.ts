export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    res.status(200).json({
      ok: true,
      supabase: Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
      payments: Boolean(process.env.CLOUDPAYMENTS_PUBLIC_ID || process.env.EXPO_PUBLIC_CLOUDPAYMENTS_PUBLIC_ID),
      cloudpaysSecret: Boolean(process.env.CLOUDPAYMENTS_API_SECRET || process.env.CLOUDPAYMENTS_SECRET),
      telegramBot: Boolean(process.env.TELEGRAM_BOT_TOKEN),
      ai: (process.env.AI_PROVIDER || 'openai'),
      bugsnag: Boolean(process.env.EXPO_PUBLIC_BUGSNAG_API_KEY),
      axiom: Boolean(process.env.AXIOM_TOKEN && process.env.AXIOM_DATASET),
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'env failed' });
  }
}

