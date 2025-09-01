export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    res.status(200).json({
      ok: true,
      aiProvider: process.env.AI_PROVIDER || 'openai',
      features: {
        voiceSearch: true,
        aiAssist: true,
        tickets: true,
        payments: Boolean(process.env.CLOUDPAYMENTS_PUBLIC_ID || process.env.EXPO_PUBLIC_CLOUDPAYMENTS_PUBLIC_ID),
        supabase: Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL),
      },
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'config failed' });
  }
}

