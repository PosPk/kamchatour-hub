export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    const { initData } = req.body || {};
    if (!initData) {
      res.status(400).json({ ok: false, error: 'initData required' });
      return;
    }
    // TODO: validate HMAC per Telegram docs
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: 'bad request' });
  }
}

