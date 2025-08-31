// Simple serverless proxy to OpenAI Chat Completions
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });
      return;
    }
    const { messages, model = 'gpt-4o-mini', temperature = 0.5 } = req.body || {};
    if (!Array.isArray(messages)) {
      res.status(400).json({ error: 'messages array required' });
      return;
    }
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, temperature, stream: false }),
    });
    if (!r.ok) {
      const t = await r.text();
      res.status(502).json({ error: 'Upstream error', detail: t });
      return;
    }
    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content ?? '';
    res.status(200).json({ content: text, raw: data });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'AI proxy failed' });
  }
}

