import fs from 'fs';
import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    const supa = createServiceClient();
    if (supa) {
      const { data, error } = await supa.from('tours').select('*').limit(500);
      if (!error && data) {
        res.status(200).json({ items: data });
        return;
      }
    }
    const raw = fs.readFileSync(process.cwd() + '/public/partner-tours.json', 'utf8');
    const items = JSON.parse(raw);
    res.status(200).json({ items });
  } catch (e: any) {
    res.status(200).json({ items: [] });
  }
}

