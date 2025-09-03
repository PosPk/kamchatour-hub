import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = { runtime: 'nodejs' };

const ALLOWED = ['L1','L2','L3'] as const;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const level = (req.cookies?.['op_level'] as string) || 'L1';
      res.status(200).json({ ok: true, level: ALLOWED.includes(level as any) ? level : 'L1' });
      return;
    }
    if (req.method === 'POST') {
      const body: any = typeof req.body === 'object' && req.body !== null ? req.body : {};
      const next = String(body?.level || '').toUpperCase();
      if (!ALLOWED.includes(next as any)) { res.status(400).json({ ok: false, error: 'bad_level' }); return; }
      res.setHeader('Set-Cookie', `op_level=${encodeURIComponent(next)}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${60*60*24*180}`);
      res.status(200).json({ ok: true, level: next });
      return;
    }
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
  } catch (e: any) {
    res.status(200).json({ ok: false, error: 'internal_error', detail: String(e?.message || e) });
  }
}

