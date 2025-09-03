import crypto from 'node:crypto';

export const config = { runtime: 'nodejs' };

function json(data: any, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } }); }

function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {}; if (!header) return out;
  header.split(';').forEach((p) => { const i = p.indexOf('='); if (i>-1){ out[p.slice(0,i).trim()] = decodeURIComponent(p.slice(i+1).trim()); } });
  return out;
}

function verifySig(payload: string, sig: string, secret: string): boolean {
  const h = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return h === sig;
}

export default async function handler(req: Request): Promise<Response> {
  const cookies = parseCookies(req.headers.get('cookie'));
  const payload = cookies['tg_session'];
  const sig = cookies['tg_sig'];
  const secret = process.env.APP_SECRET || process.env.TG_WEBHOOK_TOKEN || 'dev_secret';
  if (!payload || !sig || !verifySig(payload, sig, secret)) { return json({ ok: false, error: 'not_authenticated' }, 200); }
  try {
    const buf = Buffer.from(payload, 'base64url');
    const session = JSON.parse(buf.toString('utf8'));
    return json({ ok: true, user: session }, 200);
  } catch {
    return json({ ok: false, error: 'bad_session' }, 200);
  }
}

