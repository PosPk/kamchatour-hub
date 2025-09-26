// Safety / moderation endpoint
// POST { text: string }
// -> { safe: boolean, reason?: string }

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const text = String(req.body?.text || '').slice(0, 10000);
    if (!text) {
      res.status(200).json({ safe: true });
      return;
    }

    // Fast local heuristics
    const redFlags = [
      /<script/i,
      /onerror\s*=/i,
      /drop\s+table/i,
      /union\s+select/i,
      /\b(eval|exec|system)\s*\(/i,
      /\b(?:kill|dox|swat)\b/i,
    ];
    const hit = redFlags.find((r) => r.test(text));
    if (hit) {
      res.status(200).json({ safe: false, reason: `heuristic:${String(hit)}` });
      return;
    }

    // Optional Anthropic moderation
    const key = process.env.ANTHROPIC_API_KEY as string | undefined;
    if (key) {
      const prompt = `Верни только JSON: { "safe": boolean, "reason"?: string }\nОцени безопасность текста: допускается ли показывать пользователю?\nТекст:\n"""\n${text}\n"""`;
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({ model: 'claude-3-5-sonnet-20241022', max_tokens: 200, temperature: 0, system: 'Только валидный JSON.', messages: [{ role: 'user', content: prompt }] }),
      });
      if (r.ok) {
        const data = await r.json();
        const content = data?.content?.[0]?.text || '';
        try {
          const parsed = JSON.parse(content);
          res.status(200).json({ safe: !!parsed?.safe, reason: parsed?.reason });
          return;
        } catch {
          // fallthrough
        }
      }
    }

    // Default allow if no issues detected
    res.status(200).json({ safe: true });
  } catch (e: any) {
    res.status(200).json({ safe: true });
  }
}

