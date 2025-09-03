import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  try {
    const secretHeader = req.headers['x-telegram-bot-api-secret-token'] as string | undefined;
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET as string | undefined;
    if (!expectedSecret || secretHeader !== expectedSecret) {
      res.status(401).json({ ok: false, error: 'Unauthorized' });
      return;
    }

    const update = req.body || {};
    const updateId = update?.update_id as number | undefined;
    const chatId = update?.message?.chat?.id || update?.callback_query?.message?.chat?.id;

    const supabase = createServiceClient();
    if (!supabase) {
      res.status(500).json({ ok: false, error: 'Supabase not configured' });
      return;
    }

    // Idempotency: skip if this update_id already processed
    if (typeof updateId === 'number') {
      const { data: existing } = await supabase
        .from('tg_updates')
        .select('update_id')
        .eq('update_id', updateId)
        .limit(1)
        .maybeSingle();
      if (existing) {
        res.status(200).json({ ok: true, duplicate: true });
        return;
      }
    }

    // Simple echo/help for smoke; extend to real commands later
    let text = '' as string;
    if (update?.message?.text) {
      const msg: string = String(update.message.text).trim();
      if (/^\/start/.test(msg)) text = 'Добро пожаловать! Воспользуйтесь /catalog или /help';
      else if (/^\/help/.test(msg)) text = 'Доступно: /start, /catalog';
      else if (/^\/catalog/.test(msg)) text = 'Каталог доступен в приложении. Откройте витрину и выберите тур.';
      else text = 'Принято. Напишите /catalog чтобы увидеть предложения.';
    }

    // Store update for idempotency/audit
    if (typeof updateId === 'number') {
      await supabase.from('tg_updates').insert({ update_id: updateId, payload: update }).select('update_id').maybeSingle();
    }

    // Optional: map telegram chat to user for future personalization
    if (chatId) {
      const username = update?.message?.from?.username || update?.callback_query?.from?.username || null;
      const firstName = update?.message?.from?.first_name || update?.callback_query?.from?.first_name || null;
      await supabase
        .from('tg_users')
        .upsert({ telegram_id: String(chatId), username, first_name: firstName }, { onConflict: 'telegram_id' });
    }

    // Respond to Telegram ASAP (HTTP 200) with no body required
    res.status(200).json({ ok: true, sent: Boolean(text) });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'tg webhook failed' });
  }
}

