import { selectProvider, shouldUseEnsemble } from '../../lib/ai/policy';
// Orchestrator endpoint to route tasks to best provider or ensemble
// Usage: POST { task: 'recommend'|'chat'|'extract'|'categorize', payload: any, n?: number }
// Response: provider result or ensemble consensus

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method Not Allowed' }); return; }
  try {
    const body = req.body || {};
    const task = String(body.task || '').toLowerCase();
    const n = Math.min(20, Math.max(1, Number(body.n || 8) || 8));
    const payload = body.payload || {};

    // Safety: minimal guard
    const text = JSON.stringify(payload).slice(0, 4000);
    if (!text || /<script|drop\s+table/i.test(text)) { res.status(400).json({ error: 'invalid_payload' }); return; }

    if (task === 'recommend') {
      // Safety check: user query
      const base0 = req.headers['x-forwarded-host'] ? `https://${req.headers['x-forwarded-host']}` : (process.env.NEXT_PUBLIC_BASE_URL || '');
      try { const s = await fetch(`${base0}/api/ai/safety`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ text: String(payload.query||'') }) }); const sj = s.ok? await s.json():{ safe:true }; if (sj && sj.safe === false) { res.status(400).json({ error: 'unsafe' }); return; } } catch(_) {}
      if (shouldUseEnsemble(task, payload)) {
        const u = `${base0}/api/ai/ensemble?query=${encodeURIComponent(String(payload.query || ''))}&n=${n}`;
        const r = await fetch(u);
        const j = r.ok ? await r.json() : { items: [] };
        res.status(200).json(j);
        return;
      } else {
        const r = await fetch(`${base0}/api/ai/recommend`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: String(payload.query || ''), n }) });
        const j = r.ok ? await r.json() : { items: [] };
        res.status(200).json(j);
        return;
      }
    }
    if (task === 'chat') {
      const provider = selectProvider(task, payload);
      const base0 = req.headers['x-forwarded-host'] ? `https://${req.headers['x-forwarded-host']}` : (process.env.NEXT_PUBLIC_BASE_URL || '');
      // Safety on last assistant output is handled by Anthropic in chat.ts if needed; here we check user content quickly
      try { const s = await fetch(`${base0}/api/ai/safety`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ text: String((payload.messages||[]).map((m:any)=>m?.content||'').join('\n').slice(0,4000)) }) }); const sj = s.ok? await s.json():{ safe:true }; if (sj && sj.safe === false) { res.status(400).json({ error: 'unsafe' }); return; } } catch(_) {}
      const r = await fetch(`${base0}/api/ai/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider, messages: payload.messages || [], model: payload.model, temperature: payload.temperature ?? 0.3 }) });
      const j = r.ok ? await r.json() : { content: '' };
      res.status(200).json(j);
      return;
    }
    if (task === 'categorize' || task === 'extract') {
      // Use ensemble to increase robustness
      const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/ai/ensemble?query=${encodeURIComponent(String(payload.query || ''))}&n=${n}`);
      const j = r.ok ? await r.json() : { items: [] };
      res.status(200).json(j);
      return;
    }
    res.status(400).json({ error: 'unknown_task' });
  } catch (e: any) {
    res.status(200).json({ error: 'router_failed' });
  }
}

