import { NextResponse } from 'next/server';
import { createServiceClient } from '../../../../lib/supabase';

export async function POST(req: any) {
  try {
    const secretHeader = req.headers.get('x-telegram-bot-api-secret-token') as string | null;
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET as string | undefined;
    if (!expectedSecret || secretHeader !== expectedSecret) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const update = await req.json();
    const updateId = update?.update_id as number | undefined;
    const chatId = update?.message?.chat?.id || update?.callback_query?.message?.chat?.id;

    const supabase = createServiceClient();
    if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 500 });

    if (typeof updateId === 'number') {
      const { data: existing } = await supabase
        .from('tg_updates')
        .select('update_id')
        .eq('update_id', updateId)
        .limit(1)
        .maybeSingle();
      if (existing) return NextResponse.json({ ok: true, duplicate: true });
    }

    let text = '' as string;
    if (update?.message?.text) {
      const msg: string = String(update.message.text).trim();
      if (/^\/start/.test(msg)) text = 'Добро пожаловать! Воспользуйтесь /catalog или /help';
      else if (/^\/help/.test(msg)) text = 'Доступно: /start, /catalog, /status, /todo, /assign';
      else if (/^\/catalog/.test(msg)) text = 'Каталог доступен в приложении. Откройте витрину и выберите тур.';
      else text = 'Принято. Напишите /catalog чтобы увидеть предложения.';
    }

    if (typeof updateId === 'number') {
      await supabase.from('tg_updates').insert({ update_id: updateId, payload: update }).select('update_id').maybeSingle();
    }

    if (chatId) {
      const username = update?.message?.from?.username || update?.callback_query?.from?.username || null;
      const firstName = update?.message?.from?.first_name || update?.callback_query?.from?.first_name || null;
      await supabase
        .from('tg_users')
        .upsert({ telegram_id: String(chatId), username, first_name: firstName }, { onConflict: 'telegram_id' });
    }

    return NextResponse.json({ ok: true, sent: Boolean(text) });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'tg webhook failed' }, { status: 500 });
  }
}

