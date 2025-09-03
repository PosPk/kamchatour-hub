import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = { runtime: 'nodejs' };

async function fetchPartnerTours(req: VercelRequest) {
  try {
    const origin = req.headers['x-forwarded-host'] ? `https://${req.headers['x-forwarded-host']}` : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
    const url = origin ? `${origin}/partner-tours.json` : 'https://kamchatour-hub.vercel.app/partner-tours.json';
    const r = await fetch(url, { cache: 'no-store' } as any);
    if (!r.ok) return [];
    const json = await r.json();
    return Array.isArray(json) ? json : [];
  } catch { return []; }
}

function simpleRecommend(tours: any[], query: string) {
  const q = (query || '').toLowerCase();
  if (!q) return tours.slice(0, 10);
  const tokens = q.split(/[,\s]+/).filter(Boolean);
  const score = (t: any) => {
    const hay = `${t.title||''} ${t.activity||''} ${t.region||''} ${t.description||''}`.toLowerCase();
    return tokens.reduce((acc, tok)=> acc + (hay.includes(tok) ? 1 : 0), 0);
  };
  return tours.map((t)=>({ t, s: score(t) })).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).map(x=>x.t).slice(0, 12);
}

function tryParseJson(text: string): any {
  try { return JSON.parse(text); } catch {}
  // try extract between code fences
  const m = text.match(/```json[\s\S]*?\n([\s\S]*?)```/i) || text.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (m) {
    try { return JSON.parse(m[1] || m[0]); } catch {}
  }
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'method_not_allowed' }); return; }
    const { query } = (typeof req.body === 'object' && req.body) ? req.body as any : { query: '' };

    const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com';
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
    const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    const baseTours = await fetchPartnerTours(req);

    if (!DEEPSEEK_API_KEY) {
      // fallback: simple local recommend
      const items = simpleRecommend(baseTours, String(query||''));
      res.status(200).json({ ok: true, source: 'fallback', items });
      return;
    }

    const system = 'You are a helpful assistant recommending tours in Kamchatka. Output ONLY valid JSON array of items with fields: id, title, activity, region, duration_days, price_from, image.';
    const user = `Preferences: ${query||''}. Use these example items as inspiration if needed (do not repeat unrelated): ${baseTours.slice(0,8).map(t=>({id:t.id,title:t.title,activity:t.activity,region:t.region,price_from:t.price_from})).map(x=>JSON.stringify(x)).join(', ')}`;

    const r = await fetch(`${DEEPSEEK_API_URL.replace(/\/$/,'')}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        temperature: 0.3,
        stream: false
      })
    } as any);
    if (!r.ok) {
      const items = simpleRecommend(baseTours, String(query||''));
      res.status(200).json({ ok: true, source: 'fallback_error', items });
      return;
    }
    const data: any = await r.json();
    const text = data?.choices?.[0]?.message?.content || '';
    const parsed = tryParseJson(text);
    if (Array.isArray(parsed)) {
      res.status(200).json({ ok: true, source: 'deepseek', items: parsed });
      return;
    }
    const items = simpleRecommend(baseTours, String(query||''));
    res.status(200).json({ ok: true, source: 'fallback_parse', items });
  } catch (e: any) {
    res.status(200).json({ ok: false, error: String(e?.message || e) });
  }
}

