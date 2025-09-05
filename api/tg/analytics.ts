export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    console.log('tg_analytics', req.body);
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ ok: false });
  }
}

