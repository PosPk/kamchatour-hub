import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'Method Not Allowed' }); return; }
  const botToken = process.env.TG_BOT_TOKEN || '';
  const secret = process.env.TG_WEBHOOK_TOKEN || '';
  if (!botToken) { res.status(200).json({ ok: false, error: 'not_configured' }); return; }
  try {
    const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://kamchatour-hub.vercel.app';
    const webhookUrl = `${base}/api/tg/webhook`;
    const body = { url: webhookUrl, secret_token: secret || undefined, drop_pending_updates: true, allowed_updates: ['message','callback_query'] };
    const r = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    } as any);
    const j = await r.json();
    res.status(200).json({ ok: true, result: j });
  } catch (e: any) {
    res.status(200).json({ ok: false, error: e?.message || 'error' });
  }
}

