// Ensemble recommendations: consult multiple AI providers and pick consensus
// Usage: GET/POST { query: string, n?: number }
// Response: { items: Array<{ id: string, title: string, image?: string|null, activity?: string|null, region?: string|null, price_from?: number|null }>, sources: string[] }

import fs from 'node:fs/promises';
import path from 'node:path';

type Candidate = {
  id: string;
  title: string;
  description?: string;
  image?: string | null;
  images?: string[];
  activity?: string | null;
  region?: string | null;
  price_from?: number | null;
  duration_days?: number | null;
};

type Item = { id: string; title: string; image?: string | null; activity?: string | null; region?: string | null; price_from?: number | null };

async function readCandidates(): Promise<Candidate[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'partner-tours.json');
    const raw = await fs.readFile(filePath, 'utf8');
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr as Candidate[];
    return [];
  } catch {
    return [];
  }
}

function buildMessages(query: string, candidates: Candidate[], n: number) {
  const schema = 'Отвечай строго валидным JSON: { "items": [ { "id":"string","title":"string","image":"string?","activity":"string?","region":"string?","price_from":number? } ] }';
  const system = { role: 'system', content: `${schema}. Используй только id из кандидатов. Верни top ${n}. Ничего вне JSON не добавляй.` } as const;
  const minimal = candidates.map((c) => ({ id: c.id, title: c.title, image: c.image || null, activity: c.activity || null, region: c.region || null, price_from: c.price_from ?? null, duration_days: c.duration_days ?? null }));
  const user = { role: 'user', content: `Запрос: "${query}"
Кандидаты (JSON): ${JSON.stringify(minimal).slice(0, 200000)}` } as const;
  return [system, user];
}

async function callProvider(url: string, key: string, model: string, messages: any[], temperature = 0.3) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages, temperature, stream: false, max_tokens: 800 }),
  });
  if (!r.ok) return null;
  const data = await r.json();
  const content = data?.choices?.[0]?.message?.content || '';
  try { return JSON.parse(content); } catch { const m = content.match(/\{[\s\S]*\}/); return m ? JSON.parse(m[0]) : null; }
}

export default async function handler(req: any, res: any) {
  const method = String(req.method || 'GET').toUpperCase();
  if (method !== 'GET' && method !== 'POST') { res.status(405).json({ error: 'Method Not Allowed' }); return; }
  try {
    const params = method === 'GET' ? (req.query || {}) : (req.body || {});
    const query = String(params.query || params.q || '').slice(0, 500);
    const n = Math.min(20, Math.max(1, Number(params.n || 8) || 8));
    const candidates = await readCandidates();
    if (!query || candidates.length === 0) { res.status(200).json({ items: [], sources: [] }); return; }

    const messages = buildMessages(query, candidates, n);
    const ids = new Set(candidates.map((c) => c.id));

    const calls: Array<Promise<any>> = [];
    const sources: string[] = [];

    if (process.env.DEEPSEEK_API_KEY) {
      calls.push(callProvider('https://api.deepseek.com/v1/chat/completions', process.env.DEEPSEEK_API_KEY, 'deepseek-chat', messages));
      sources.push('deepseek');
    }
    if (process.env.OPENAI_API_KEY) {
      calls.push(callProvider('https://api.openai.com/v1/chat/completions', process.env.OPENAI_API_KEY, 'gpt-4o-mini', messages));
      sources.push('openai');
    }
    if (process.env.GROQ_API_KEY) {
      calls.push(callProvider('https://api.groq.com/openai/v1/chat/completions', process.env.GROQ_API_KEY, 'llama-3.1-8b-instant', messages));
      sources.push('groq');
    }
    if (process.env.ANTHROPIC_API_KEY) {
      // anthropic has different API; simple adapter
      const anthropicMessages = messages.map((m:any)=>m.role==='assistant'? { role:'assistant', content: m.content }: m.role==='system'? m: { role:'user', content: m.content });
      const p = (async()=>{
        const r = await fetch('https://api.anthropic.com/v1/messages', { method:'POST', headers:{ 'Content-Type':'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY as string, 'anthropic-version':'2023-06-01' }, body: JSON.stringify({ model:'claude-3-5-sonnet-20241022', max_tokens:800, temperature:0.3, system: (messages.find((m:any)=>m.role==='system')?.content)||undefined, messages: anthropicMessages.filter((m:any)=>m.role!=='system') }) });
        if(!r.ok) return null; const data=await r.json(); const content = data?.content?.[0]?.text || '';
        try{ return JSON.parse(content); }catch{ const m=content.match(/\{[\s\S]*\}/); return m? JSON.parse(m[0]) : null; }
      })();
      calls.push(p);
      sources.push('anthropic');
    }
    if (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) {
      const key = (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) as string;
      const conv = messages.filter((m:any)=>m.role==='user' || m.role==='assistant').map((m:any)=>({ role: m.role==='assistant'?'model':'user', parts:[{ text:String(m.content||'')}] }));
      const p = (async()=>{
        const sys = messages.find((m:any)=>m.role==='system');
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(key)}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ systemInstruction: sys? { role:'system', parts:[{ text: String(sys.content||'') }]}: undefined, contents: conv, generationConfig:{ temperature:0.3 } }) });
        if(!r.ok) return null; const data=await r.json(); const parts=data?.candidates?.[0]?.content?.parts||[]; const text=parts.map((p:any)=>p?.text).filter(Boolean).join('\n')||''; try{ return JSON.parse(text);}catch{ const m=text.match(/\{[\s\S]*\}/); return m? JSON.parse(m[0]):null; }
      })();
      calls.push(p);
      sources.push('gemini');
    }

    const results = await Promise.allSettled(calls);
    const lists: Item[][] = results.map((r) => {
      const val = (r.status === 'fulfilled') ? (r.value || null) : null;
      const arr = Array.isArray(val?.items) ? val.items : [];
      return arr.filter((x: any) => x && typeof x.id === 'string' && ids.has(x.id)).slice(0, n);
    });

    // Consensus by frequency, then average rank
    const score = new Map<string, { freq: number; rankSum: number; sample: Item }>();
    lists.forEach((lst) => {
      lst.forEach((x: any, idx: number) => {
        const key = String(x.id);
        const prev = score.get(key) || { freq: 0, rankSum: 0, sample: x };
        prev.freq += 1;
        prev.rankSum += (idx + 1);
        prev.sample = prev.sample || x;
        score.set(key, prev);
      });
    });

    let items: Item[] = Array.from(score.entries())
      .sort((a, b) => {
        const [fa, fb] = [b[1].freq, a[1].freq];
        if (fa !== fb) return fa - fb; // higher freq first
        return a[1].rankSum - b[1].rankSum; // lower rank sum first
      })
      .slice(0, n)
      .map(([id, v]) => {
        const c = candidates.find((cc) => cc.id === id);
        const s = v.sample as any;
        return {
          id,
          title: String(s?.title || c?.title || ''),
          image: s?.image ?? (c?.image || null),
          activity: s?.activity ?? (c?.activity || null),
          region: s?.region ?? (c?.region || null),
          price_from: typeof s?.price_from === 'number' ? s.price_from : (c?.price_from ?? null),
        } as Item;
      });

    // Fallback if all providers failed
    if (items.length === 0) {
      items = candidates.slice(0, n).map((c) => ({ id: c.id, title: c.title, image: c.image || null, activity: c.activity || null, region: c.region || null, price_from: c.price_from ?? null }));
    }

    res.status(200).json({ items, sources });
  } catch (e: any) {
    res.status(200).json({ items: [], sources: [] });
  }
}

