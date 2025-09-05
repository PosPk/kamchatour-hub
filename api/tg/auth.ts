import crypto from 'crypto';

function parseInitData(data: string): Record<string, string> {
  const obj: Record<string, string> = {};
  (data || '').split('&').forEach((kv) => {
    const [k, v] = kv.split('=');
    if (k) obj[decodeURIComponent(k)] = decodeURIComponent(v || '');
  });
  return obj;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    const { initData } = req.body || {};
    if (!initData) {
      res.status(400).json({ ok: false, error: 'initData required' });
      return;
    }
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string | undefined;
    if (!BOT_TOKEN) {
      res.status(500).json({ ok: false, error: 'Bot token missing' });
      return;
    }
    const data = parseInitData(initData);
    const hash = data['hash'];
    if (!hash) {
      res.status(400).json({ ok: false, error: 'hash missing' });
      return;
    }
    const authDate = Number(data['auth_date'] || '0');
    const now = Math.floor(Date.now() / 1000);
    const maxAge = 60 * 10; // 10 minutes
    if (!Number.isFinite(authDate) || now - authDate > maxAge) {
      res.status(401).json({ ok: false, error: 'initData expired' });
      return;
    }
    const check = Object.keys(data)
      .filter((k) => k !== 'hash')
      .sort()
      .map((k) => `${k}=${data[k]}`)
      .join('\n');
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const computed = crypto.createHmac('sha256', secretKey).update(check).digest('hex');
    if (computed !== hash) {
      res.status(401).json({ ok: false, error: 'bad signature' });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: 'bad request' });
  }
}

