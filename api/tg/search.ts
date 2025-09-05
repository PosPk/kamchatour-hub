import fs from 'fs';
import { searchTours } from '../../lib/tours';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    const q = String(req.query?.q || '').toLowerCase();
    const dbItems = await searchTours({ q });
    if (Array.isArray(dbItems) && dbItems.length) {
      res.status(200).json({ items: dbItems });
      return;
    }
    const raw = fs.readFileSync(process.cwd() + '/public/partner-tours.json', 'utf8');
    const items: any[] = JSON.parse(raw);
    const filtered = items.filter((x) => {
      const hay = `${x.title || ''} ${x.description || ''} ${x.activity || ''} ${x.region || ''}`.toLowerCase();
      return !q || hay.includes(q);
    });
    res.status(200).json({ items: filtered });
  } catch (e: any) {
    res.status(200).json({ items: [] });
  }
}

