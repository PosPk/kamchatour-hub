import { serverLog } from '../../lib/logger';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false });
    return;
  }
  try {
    const { tour_id, name, phone, note } = req.body || {};
    if (!tour_id || !name || !phone) { res.status(400).json({ ok: false, error: 'bad input' }); return; }
    try { await serverLog('lead:new', { tour_id, name, phone, note }); } catch {}
    // TODO: persist to DB or send to CRM/Telegram bot
    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
}

