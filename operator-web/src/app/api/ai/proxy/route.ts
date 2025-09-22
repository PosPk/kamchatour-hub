export async function POST(request: Request) {
  try {
    const aiSecret = process.env.AI_API_SECRET || '';
    const url = new URL(request.url);
    const origin = url.origin;

    const body = await request.text();
    const upstream = await fetch(`${origin}/api/ai/generate`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(aiSecret ? { 'x-ai-secret': aiSecret } : {}),
      },
      body,
      // Important for Vercel/Next edge compat
      // @ts-ignore
      cache: 'no-store',
    });

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') || 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: String(error) }), { status: 500 });
  }
}

