import { NextResponse } from 'next/server';

export async function POST(req: any) {
  try {
    const sendSecretHeader = req.headers.get('x-tg-send-secret') as string | null;
    const expectedSecret = process.env.TELEGRAM_SEND_SECRET as string | undefined;
    const botToken = process.env.TELEGRAM_BOT_TOKEN as string | undefined;

    if (!expectedSecret || !botToken) {
      return NextResponse.json({ ok: false, error: 'Server not configured' }, { status: 500 });
    }
    if (!sendSecretHeader || sendSecretHeader !== expectedSecret) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { chat_id, text, parse_mode } = await req.json();
    if (!chat_id || !text) {
      return NextResponse.json({ ok: false, error: 'chat_id and text required' }, { status: 400 });
    }

    const api = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const body = new URLSearchParams();
    body.set('chat_id', String(chat_id));
    body.set('text', String(text));
    if (parse_mode) body.set('parse_mode', String(parse_mode));

    const tgRes = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const tgJson = await tgRes.json().catch(() => ({}));
    if (!tgRes.ok || !tgJson?.ok) {
      return NextResponse.json({ ok: false, error: tgJson?.description || 'send failed' }, { status: 502 });
    }
    return NextResponse.json({ ok: true, result: tgJson?.result || null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'send failed' }, { status: 500 });
  }
}

