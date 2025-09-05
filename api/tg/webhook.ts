import crypto from 'crypto';
import { createServiceClient } from '../../lib/supabase';
import { serverLog } from '../../lib/logger';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  const secret = process.env.TELEGRAM_WEBHOOK_SECRET as string | undefined;
  const header = (req.headers['x-telegram-secret'] || req.headers['x-telegram-signature']) as string | undefined;
  const raw = typeof req.rawBody === 'string' ? req.rawBody : typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});

  try {
    const body = typeof req.body === 'object' ? req.body : JSON.parse(raw || '{}');
    const updateId = body?.update_id as number | undefined;

    // Auth check: allow if secret disabled for local/dev, otherwise require match or HMAC
    if (secret) {
      const hmac = crypto.createHmac('sha256', secret).update(raw, 'utf8').digest('hex');
      const ok = header && (header === secret || header === hmac);
      if (!ok) {
        try { await serverLog('tg:webhook:auth_fail', { headerPresent: !!header }, 'warn'); } catch {}
        res.status(401).json({ ok: false });
        return;
      }
    }

    const supabase = createServiceClient();
    if (!supabase) {
      res.status(200).json({ ok: true });
      return;
    }

    // Idempotency by update_id
    if (typeof updateId === 'number') {
      const { data: existing } = await supabase.from('tg_updates').select('id').eq('id', String(updateId)).maybeSingle();
      if (existing) {
        try { await serverLog('tg:webhook:duplicate', { updateId }); } catch {}
        res.status(200).json({ ok: true, duplicate: true });
        return;
      }
      try {
        await supabase.from('tg_updates').insert({ id: String(updateId), payload: body }).select().single();
      } catch {}
    }

    // Minimal echo handler for smoke
    const chatId = body?.message?.chat?.id || body?.callback_query?.message?.chat?.id;
    const text = body?.message?.text || body?.callback_query?.data || '/start';
    try { await serverLog('tg:webhook:received', { updateId, text }); } catch {}

    // Best-effort reply using Telegram Bot API if token is present
    const token = process.env.TELEGRAM_BOT_TOKEN as string | undefined;
    if (token && chatId) {
      const reply = text?.startsWith('/start') ? 'Kamchatka Hub: привет!' : `Echo: ${text}`;
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: reply })
      }).catch(() => {});
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    try { await serverLog('tg:webhook:error', { error: (error as any)?.message }, 'error'); } catch {}
    res.status(200).json({ ok: true });
  }
}

