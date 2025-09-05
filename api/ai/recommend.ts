import fs from 'fs';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    const { query } = req.body || {};
    const q = String(query || '').toLowerCase();
    const raw = fs.readFileSync(process.cwd() + '/public/partner-tours.json', 'utf8');
    const items: any[] = JSON.parse(raw);
    const ranked = items
      .map((x) => ({ x, score: q ? ((`${x.title} ${x.description} ${x.activity} ${x.region}` || '').toLowerCase().includes(q) ? 1 : 0) : 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(({ x }) => ({ id: x.id, title: x.title, image: x.image, activity: x.activity, region: x.region, price_from: x.price_from }));
    res.status(200).json({ items: ranked });
  } catch (e: any) {
    res.status(200).json({ items: [] });
  }
}

