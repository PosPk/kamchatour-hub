import { NextResponse } from 'next/server';

export async function POST(req: any) {
  try {
    const { messages, model } = await req.json();
    const apiKey = process.env.GROQ_API_KEY as string | undefined;
    if (!apiKey) return NextResponse.json({ ok: false, error: 'GROQ_API_KEY missing' }, { status: 500 });

    const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'llama-3.1-70b-versatile',
        messages: Array.isArray(messages) ? messages : [{ role: 'user', content: String(messages || 'Hello') }],
        temperature: 0.3,
        stream: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ ok: false, error: err || 'groq error' }, { status: 500 });
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? '';
    return NextResponse.json({ ok: true, content, raw: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'ai chat failed' }, { status: 500 });
  }
}

