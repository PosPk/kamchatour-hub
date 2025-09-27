import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'missing_groq_env' }, { status: 500 });
    const body = await req.json();
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: body?.model || 'llama-3.1-70b-versatile',
        temperature: body?.temperature ?? 0.2,
        max_tokens: body?.max_tokens ?? 1200,
        messages: body?.messages || [],
      }),
    });
    const data = await resp.json();
    if (!resp.ok) return NextResponse.json(data, { status: resp.status });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'groq_failed' }, { status: 500 });
  }
}

