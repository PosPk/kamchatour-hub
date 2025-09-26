let level: 'L1'|'L2'|'L3' = 'L1';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    res.status(200).json({ level });
    return;
  }
  if (req.method === 'POST') {
    try {
      const { level: lv } = req.body || {};
      if (!['L1','L2','L3'].includes(lv)) {
        res.status(400).json({ ok: false });
        return;
      }
      level = lv;
      res.status(200).json({ ok: true });
    } catch {
      res.status(400).json({ ok: false });
    }
    return;
  }
  res.status(405).json({ ok: false });
}

