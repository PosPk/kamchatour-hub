import fs from 'fs';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    const raw = fs.readFileSync(process.cwd() + '/public/partner-tours.json', 'utf8');
    const items = JSON.parse(raw);
    res.status(200).json({ items });
  } catch (e: any) {
    res.status(200).json({ items: [] });
  }
}

