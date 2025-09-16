import { NextResponse } from 'next/server';
import crypto from 'crypto';

function parseInitData(data: string): Record<string, string> {
  const obj: Record<string, string> = {};
  (data || '').split('&').forEach((kv) => {
    const [k, v] = kv.split('=');
    if (k) obj[decodeURIComponent(k)] = decodeURIComponent(v || '');
  });
  return obj;
}

export async function POST(req: any) {
  try {
    const { initData } = await req.json();
    if (!initData) return NextResponse.json({ ok: false, error: 'initData required' }, { status: 400 });

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string | undefined;
    if (!BOT_TOKEN) return NextResponse.json({ ok: false, error: 'Bot token missing' }, { status: 500 });

    const data = parseInitData(String(initData));
    const hash = data['hash'];
    if (!hash) return NextResponse.json({ ok: false, error: 'hash missing' }, { status: 400 });

    const authDate = Number(data['auth_date'] || '0');
    const now = Math.floor(Date.now() / 1000);
    const maxAge = 60 * 10; // 10 minutes
    if (!isFinite(authDate) || now - authDate > maxAge) {
      return NextResponse.json({ ok: false, error: 'initData expired' }, { status: 401 });
    }

    const checkString = Object.keys(data)
      .filter((k) => k !== 'hash')
      .sort()
      .map((k) => `${k}=${data[k]}`)
      .join('\n');
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const computed = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');
    if (computed !== hash) return NextResponse.json({ ok: false, error: 'bad signature' }, { status: 401 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

