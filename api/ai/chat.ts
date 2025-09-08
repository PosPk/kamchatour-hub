// Simple serverless proxy to OpenAI Chat Completions
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
    const { messages, model = provider === 'groq' ? 'llama-3.1-8b-instant' : provider === 'deepseek' ? 'deepseek-chat' : provider === 'anthropic' ? 'claude-3-5-sonnet-20241022' : provider === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini', temperature = 0.5 } = req.body || {};
    if (!Array.isArray(messages)) {
      res.status(400).json({ error: 'messages array required' });
      return;
    }
    if (provider === 'anthropic') {
      const key = process.env.ANTHROPIC_API_KEY as string | undefined;
      if (!key) { res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured' }); return; }
      const system = (Array.isArray(messages)? messages: []).filter((m:any)=>m?.role==='system').map((m:any)=>String(m.content||'')).join('\n');
      const userAssistant = (Array.isArray(messages)? messages: []).filter((m:any)=>m?.role==='user' || m?.role==='assistant').map((m:any)=>({ role: m.role, content: String(m.content||'') }));
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model, max_tokens: 800, temperature, system: system || undefined, messages: userAssistant }),
      });
      if (!r.ok) { const t = await r.text(); res.status(502).json({ error: 'Upstream error', detail: t }); return; }
      const data = await r.json();
      const text = data?.content?.[0]?.text ?? '';
      res.status(200).json({ content: text, raw: data });
      return;
    }
    if (provider === 'gemini') {
      const key = (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) as string | undefined;
      if (!key) { res.status(500).json({ error: 'GOOGLE_API_KEY (or GEMINI_API_KEY) is not configured' }); return; }
      const system = (Array.isArray(messages)? messages: []).filter((m:any)=>m?.role==='system').map((m:any)=>String(m.content||'')).join('\n');
      const conv = (Array.isArray(messages)? messages: []).filter((m:any)=>m?.role==='user' || m?.role==='assistant').map((m:any)=>({ role: m.role==='assistant' ? 'model' : 'user', parts: [{ text: String(m.content||'') }] }));
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemInstruction: system? { role: 'system', parts: [{ text: system }] } : undefined, contents: conv, generationConfig: { temperature } }),
      });
      if (!r.ok) { const t = await r.text(); res.status(502).json({ error: 'Upstream error', detail: t }); return; }
      const data = await r.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const text = parts.map((p:any)=>p?.text).filter(Boolean).join('\n') || '';
      res.status(200).json({ content: text, raw: data });
      return;
    }
    // OpenAI-compatible providers (OpenAI, Groq, DeepSeek)
    let url = 'https://api.openai.com/v1/chat/completions';
    let key = process.env.OPENAI_API_KEY as string | undefined;
    if (provider === 'groq') { url = 'https://api.groq.com/openai/v1/chat/completions'; key = process.env.GROQ_API_KEY as string | undefined; }
    else if (provider === 'deepseek') { url = 'https://api.deepseek.com/v1/chat/completions'; key = process.env.DEEPSEEK_API_KEY as string | undefined; }
    if (!key) { res.status(500).json({ error: provider === 'groq' ? 'GROQ_API_KEY is not configured' : provider === 'deepseek' ? 'DEEPSEEK_API_KEY is not configured' : 'OPENAI_API_KEY is not configured' }); return; }
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify({ model, messages, temperature, stream: false }) });
    if (!r.ok) { const t = await r.text(); res.status(502).json({ error: 'Upstream error', detail: t }); return; }
    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content ?? '';
    res.status(200).json({ content: text, raw: data });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'AI proxy failed' });
  }
}

