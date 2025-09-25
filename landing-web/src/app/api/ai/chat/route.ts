import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const SITEMAP = `Страницы сайта (маршруты):
— Хаб: /
— Безопасность: /hub/safety (SOS, МЧС, сейсмика)
— Размещение (онбординг в кабинете): /stays/onboarding (operator-web)
— Сувениры (витрина будет): /hub/souvenirs
— Туристам (моб. страница, в работе): /tourists (если включена)
— Партнёры: /partners, Поиск: /search
— VIP витрины: /premium (Commerce), /premium2 (Adventure)
Подсказки: «Открой безопасность», «Покажи сувениры», «Где зарегистрировать группу МЧС?»`;
    const system = {
      role: 'system',
      content:
        'Ты — AI.Kam, администратор экосистемы Kamchatour. Помогаешь туристам и партнёрам: туры, безопасность, календарь, рефералы, экобаллы. Отвечай кратко и по делу. Если просят перейти, предлагай прямые ссылки по карте сайта. ' + SITEMAP,
    };

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (OPENROUTER_API_KEY) {
      const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [system, ...messages],
        }),
      });
      if (!resp.ok) {
        const text = await resp.text();
        return NextResponse.json({ error: 'upstream_error', detail: text }, { status: 502 });
      }
      const data = await resp.json();
      const content = data?.choices?.[0]?.message?.content ?? 'Готово.';
      return NextResponse.json({ content });
    }

    // Demo fallback (no key)
    const last = messages[messages.length - 1]?.content || '';
    const demo =
      'KAMAI (демо): я зафиксировал ваш запрос. На проде тут будет полноценный ИИ (OpenRouter). Вопрос: ' +
      (typeof last === 'string' ? last.slice(0, 240) : '');
    return NextResponse.json({ content: demo });
  } catch (e: any) {
    return NextResponse.json({ error: 'bad_request', detail: String(e?.message || e) }, { status: 400 });
  }
}

