import { roleState as sharedRole } from './me';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false });
    return;
  }
  try {
    const { role } = req.body || {};
    if (!role || !['traveler','operator','rental','transfer','agent'].includes(role)) {
      res.status(400).json({ ok: false });
      return;
    }
    (global as any).__roleState = role;
    res.status(200).json({ ok: true });
  } catch {
    res.status(400).json({ ok: false });
  }
}

