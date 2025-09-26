// AI recommendations endpoint using DeepSeek with safe fallback
// Accepts: GET/POST { query: string, n?: number }
// Returns: { items: Array<{ id: string, title: string, image?: string|null, activity?: string|null, region?: string|null, price_from?: number|null }> }

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

type RecommendItem = {
  id: string;
  title: string;
  image?: string | null;
  activity?: string | null;
  region?: string | null;
  price_from?: number | null;
};

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

function naiveRank(query: string, candidates: Candidate[], n: number): RecommendItem[] {
  const q = (query || '').toLowerCase().trim();
  const scored = candidates.map((c) => {
    const hay = `${c.title || ''} ${c.activity || ''} ${c.region || ''} ${c.description || ''}`.toLowerCase();
    const score = q ? (hay.includes(q) ? 2 : q.split(/\s+/).filter(Boolean).reduce((s, w) => s + (hay.includes(w) ? 1 : 0), 0)) : 0;
    return { c, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, n))
    .map(({ c }) => ({ id: c.id, title: c.title, image: c.image || null, activity: c.activity || null, region: c.region || null, price_from: c.price_from ?? null }));
}

function buildDeepseekMessages(query: string, candidates: Candidate[], n: number) {
  const schemaNote = 'Отвечай строго валидным JSON: { "items": [ { "id":"string","title":"string","image":"string?","activity":"string?","region":"string?","price_from":number? } ] }';
  const system = [
    {
      role: 'system',
      content: `${schemaNote}. Используй только id из кандидатов. Верни top ${n}. Ничего вне JSON не добавляй.`,
    },
  ];
  const minimal = candidates.map((c) => ({ id: c.id, title: c.title, image: c.image || null, activity: c.activity || null, region: c.region || null, price_from: c.price_from ?? null, duration_days: c.duration_days ?? null }));
  const user = [
    {
      role: 'user',
      content: `Запрос: "${query}"\nКандидаты (JSON): ${JSON.stringify(minimal).slice(0, 200000)}`,
    },
  ];
  return [...system, ...user];
}

async function callDeepseek(messages: any[], n: number): Promise<any | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;
  const r = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: 'deepseek-chat', temperature: 0.3, max_tokens: 800, stream: false, messages }),
  });
  if (!r.ok) return null;
  const data = await r.json();
  const content = data?.choices?.[0]?.message?.content || '';
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try { return JSON.parse(match[0]); } catch { return null; }
  }
}

export default async function handler(req: any, res: any) {
  const method = String(req.method || 'GET').toUpperCase();
  if (method !== 'GET' && method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const qQuery = method === 'GET' ? (req.query?.q || req.query?.query) : (req.body?.query);
    const query = String(qQuery || '').slice(0, 500);
    const nRaw = method === 'GET' ? (req.query?.n) : (req.body?.n);
    const n = Math.min(20, Math.max(1, Number(nRaw || 8) || 8));
    const candidates = await readCandidates();
    if (candidates.length === 0) {
      res.status(200).json({ items: [] });
      return;
    }

    let items: RecommendItem[] | null = null;
    if (process.env.DEEPSEEK_API_KEY) {
      const messages = buildDeepseekMessages(query, candidates, n);
      const ai = await callDeepseek(messages as any[], n);
      const ids = new Set(candidates.map((c) => c.id));
      const rawItems = Array.isArray(ai?.items) ? ai.items : [];
      const filtered = rawItems
        .filter((x: any) => x && typeof x.id === 'string' && ids.has(x.id))
        .slice(0, n)
        .map((x: any) => ({
          id: String(x.id),
          title: String(x.title || candidates.find((c) => c.id === x.id)?.title || ''),
          image: x.image ?? (candidates.find((c) => c.id === x.id)?.image || null),
          activity: x.activity ?? (candidates.find((c) => c.id === x.id)?.activity || null),
          region: x.region ?? (candidates.find((c) => c.id === x.id)?.region || null),
          price_from: typeof x.price_from === 'number' ? x.price_from : (candidates.find((c) => c.id === x.id)?.price_from ?? null),
        }));
      if (filtered.length > 0) items = filtered;
    }

    if (!items) {
      items = naiveRank(query, candidates, n);
    }

    res.status(200).json({ items });
  } catch (e: any) {
    res.status(200).json({ items: [] });
  }
}

