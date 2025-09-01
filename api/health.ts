import fs from 'fs';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    let version = '0.0.0';
    try {
      const pkg = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf8'));
      version = pkg.version || version;
    } catch {}
    const startedAt = Number(process.env.BOOT_TIME_MS || Date.now());
    const uptimeMs = Date.now() - startedAt;
    res.status(200).json({
      ok: true,
      service: 'kamchatour-hub',
      version,
      uptimeMs,
      env: {
        hasSupabase: Boolean(process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL),
        hasPayments: Boolean(process.env.CLOUDPAYMENTS_PUBLIC_ID || process.env.EXPO_PUBLIC_CLOUDPAYMENTS_PUBLIC_ID),
        aiProvider: process.env.AI_PROVIDER || 'openai',
      },
      now: new Date().toISOString(),
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'health failed' });
  }
}

