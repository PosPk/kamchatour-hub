// Iterative AI prompt chaining endpoint using DeepSeek with a safe fallback
// Usage:
//   POST /api/ai/loop { prompt: string, steps?: number, system?: string, temperature?: number }
//   GET  /api/ai/loop?prompt=...&steps=3
// Response:
//   { steps: Array<{ index:number, input:string, output:any }>, final: any }

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

function buildSystemPrompt(custom?: string) {
  const base =
    'Ты ассистент Kamchatour. Отвечай строго валидным JSON без текста вне JSON. Схема: { "mode": "continue"|"final", "next_prompt": "string?", "result": any?, "note": "string?" }.';
  return custom ? `${base} ${custom}` : base;
}

async function callDeepseek(messages: ChatMessage[], temperature: number) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;
  const r = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: 'deepseek-chat', temperature, max_tokens: 800, stream: false, messages }),
  });
  if (!r.ok) return null;
  const data = await r.json();
  const content = data?.choices?.[0]?.message?.content || '';
  try {
    return JSON.parse(content);
  } catch {
    const m = content.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try { return JSON.parse(m[0]); } catch { return null; }
  }
}

export default async function handler(req: any, res: any) {
  const method = String(req.method || 'GET').toUpperCase();
  if (method !== 'GET' && method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const params = method === 'GET' ? (req.query || {}) : (req.body || {});
    const firstPrompt = String(params.prompt || '').slice(0, 2000);
    const maxSteps = Math.min(5, Math.max(1, Number(params.steps || 3) || 3));
    const temperature = Math.min(1, Math.max(0, Number(params.temperature || 0.3) || 0.3));
    const systemNote = buildSystemPrompt(String(params.system || ''));

    if (!firstPrompt) {
      res.status(400).json({ error: 'prompt is required' });
      return;
    }

    const steps: Array<{ index: number; input: string; output: any }> = [];
    let messages: ChatMessage[] = [
      { role: 'system', content: systemNote },
      { role: 'user', content: firstPrompt },
    ];

    let currentPrompt = firstPrompt;
    let final: any = null;

    for (let i = 0; i < maxSteps; i++) {
      const ai = await callDeepseek(messages, temperature);
      const output = ai || { mode: 'final', result: { echo: currentPrompt }, note: 'fallback' };
      steps.push({ index: i + 1, input: currentPrompt, output });

      const mode = String(output?.mode || '').toLowerCase();
      if (mode === 'continue' && output?.next_prompt) {
        currentPrompt = String(output.next_prompt);
        messages = [
          { role: 'system', content: systemNote },
          { role: 'user', content: currentPrompt },
        ];
        continue;
      } else {
        final = output?.result ?? output;
        break;
      }
    }

    res.status(200).json({ steps, final });
  } catch (e: any) {
    res.status(200).json({ steps: [], final: null, error: 'loop_failed' });
  }
}

