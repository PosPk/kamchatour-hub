import crypto from 'node:crypto';

export const config = { runtime: 'nodejs' };

function json(data: any, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } }); }

function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {}; if (!header) return out;
  header.split(';').forEach((p) => { const i = p.indexOf('='); if (i>-1){ out[p.slice(0,i).trim()] = decodeURIComponent(p.slice(i+1).trim()); } });
  return out;
}

function setCookieHeader(name: string, value: string, maxAgeSeconds = 60 * 60 * 24 * 90): string {
  const parts = [ `${name}=${encodeURIComponent(value)}`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Secure', `Max-Age=${maxAgeSeconds}` ];
  return parts.join('; ');
}

function signPayload(payload: string, secret: string): string { return crypto.createHmac('sha256', secret).update(payload).digest('hex'); }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
  const cookies = parseCookies(req.headers.get('cookie'));
  const payload = cookies['tg_session'];
  const sig = cookies['tg_sig'];
  const secret = process.env.APP_SECRET || process.env.TG_WEBHOOK_TOKEN || 'dev_secret';
  if (!payload || !sig || signPayload(payload, secret) !== sig) return json({ ok: false, error: 'not_authenticated' }, 200);
  let session: any;
  try { session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')); } catch { return json({ ok: false, error: 'bad_session' }, 200); }
  let body: any = {};
  try { body = await req.json(); } catch {}
  const role = String(body?.role || '').toLowerCase();
  const allowed = ['operator','traveler','rental','transfer','agent'];
  if (!allowed.includes(role)) return json({ ok: false, error: 'bad_role' }, 400);
  session.role = role === 'traveler' ? 'traveler' : role;
  const nextPayload = Buffer.from(JSON.stringify(session), 'utf8').toString('base64url');
  const nextSig = signPayload(nextPayload, secret);
  const headers: HeadersInit = { 'Set-Cookie': [ setCookieHeader('tg_session', nextPayload), setCookieHeader('tg_sig', nextSig) ] as any, 'Content-Type': 'application/json' };
  return new Response(JSON.stringify({ ok: true, user: session }), { status: 200, headers });
}

