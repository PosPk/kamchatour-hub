import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = { runtime: 'nodejs' };

function getHeader(req: VercelRequest, name: string): string | undefined {
  // Vercel/Node lowercases header names
  return (req.headers[name.toLowerCase()] as string | undefined) || undefined;
}

async function tgCall(token: string, method: string, body: any) {
  const url = `https://api.telegram.org/bot${token}/${method}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  } as any);
  return r.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'Method Not Allowed' }); return; }
  const botToken = process.env.TG_BOT_TOKEN || '';
  const secretExpected = process.env.TG_WEBHOOK_TOKEN || '';
  if (!botToken) { res.status(200).json({ ok: false, error: 'not_configured' }); return; }

  try {
    const headerSecret = getHeader(req, 'x-telegram-bot-api-secret-token') || '';
    const queryToken = (req.query.token as string) || '';
    if (secretExpected && headerSecret !== secretExpected && queryToken !== secretExpected) {
      res.status(401).json({ ok: false, error: 'unauthorized' }); return;
    }

    const update = req.body || {};
    const message = (update.message || update.edited_message || update.callback_query?.message) || {};
    const chatId = message?.chat?.id;
    const text: string = (update.message?.text || '').trim();
    const data: string = (update.callback_query?.data || '').trim();

    if (!chatId) { res.status(200).json({ ok: true }); return; }

    if (update.callback_query) {
      // Acknowledge callback to stop loading state
      await tgCall(botToken, 'answerCallbackQuery', { callback_query_id: update.callback_query.id });
    }

    let replyText = 'Добро пожаловать в Kamchatour! Выберите действие:';
    if (text.startsWith('/start')) {
      replyText = 'Привет! Открой мини‑приложение или выбери раздел ниже.';
    } else if (data === 'lead') {
      replyText = 'Оставьте заявку в мини‑приложении, и мы свяжемся с вами.';
    }

    const base = 'https://kamchatour-hub.vercel.app';
    const reply_markup = {
      inline_keyboard: [
        [{ text: 'Открыть мини‑приложение', web_app: { url: `${base}/mini` } }],
        [
          { text: 'Каталог туров', web_app: { url: `${base}/mini` } },
          { text: 'Карта', web_app: { url: `${base}/mini?route=map` } },
        ],
        [
          { text: 'Оставить заявку', web_app: { url: `${base}/tg/lead.html` } },
        ],
      ],
    };

    await tgCall(botToken, 'sendMessage', {
      chat_id: chatId,
      text: replyText,
      reply_markup,
    });

    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(200).json({ ok: false, error: e?.message || 'error' });
  }
}

