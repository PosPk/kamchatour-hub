import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

function verifyInitData(initData: string, botToken: string): boolean {
  try {
    const url = new URLSearchParams(initData);
    const hash = url.get('hash') || '';
    url.delete('hash');
    const data = Array.from(url.entries())
      .map(([k, v]) => `${k}=${v}`)
      .sort()
      .join('\n');
    const secret = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const candidate = crypto.createHmac('sha256', secret).update(data).digest('hex');
    return candidate === hash;
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'Method Not Allowed' }); return; }
  const token = process.env.TG_BOT_TOKEN || '';
  if (!token) { res.status(500).json({ ok: false, error: 'TG_BOT_TOKEN not set' }); return; }
  const { initData } = (req.body ?? {}) as { initData?: string };
  if (!initData) { res.status(400).json({ ok: false, error: 'initData required' }); return; }
  const ok = verifyInitData(initData, token);
  res.status(200).json({ ok });
}

