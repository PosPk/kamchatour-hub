// Eval harness for recommendations
// POST { query: string, expectedIds: string[] }
// -> { pass: boolean, precision: number, recall: number, details: any }

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method Not Allowed' }); return; }
  try {
    const query = String(req.body?.query || '').slice(0, 500);
    const expected: string[] = Array.isArray(req.body?.expectedIds) ? req.body.expectedIds.map((x:any)=>String(x)) : [];
    if (!query || expected.length === 0) { res.status(400).json({ error: 'bad_input' }); return; }

    const base = req.headers['x-forwarded-host'] ? `https://${req.headers['x-forwarded-host']}` : (process.env.NEXT_PUBLIC_BASE_URL || '');
    const url = `${base}/api/ai/ensemble?query=${encodeURIComponent(query)}&n=${Math.max(8, expected.length)}`;
    const r = await fetch(url, { method: 'GET' });
    if (!r.ok) { res.status(502).json({ error: 'ensemble_failed' }); return; }
    const data = await r.json();
    const items: any[] = Array.isArray(data?.items) ? data.items : [];
    const got = new Set(items.map((x:any)=>String(x?.id||'')));
    const exp = new Set(expected);
    let tp = 0; let fp = 0; let fn = 0;
    got.forEach(id => { if (exp.has(id)) tp += 1; else fp += 1; });
    exp.forEach(id => { if (!got.has(id)) fn += 1; });
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const pass = precision >= 0.6 && recall >= 0.6;
    res.status(200).json({ pass, precision, recall, details: { tp, fp, fn, got: Array.from(got), expected: Array.from(exp) } });
  } catch (e: any) {
    res.status(200).json({ pass: false, precision: 0, recall: 0, details: { error: 'eval_failed' } });
  }
}

