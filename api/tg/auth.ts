import crypto from 'node:crypto';

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

export const config = { runtime: 'nodejs' };

function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  header.split(';').forEach((p) => {
    const idx = p.indexOf('=');
    if (idx > -1) {
      const k = p.slice(0, idx).trim();
      const v = decodeURIComponent(p.slice(idx + 1).trim());
      out[k] = v;
    }
  });
  return out;
}

function setCookieHeader(name: string, value: string, maxAgeSeconds = 60 * 60 * 24 * 90): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Secure',
    `Max-Age=${maxAgeSeconds}`,
  ];
  return parts.join('; ');
}

function verifyWebApp(initData: string, botToken: string): { ok: boolean; user?: any } {
  if (!initData || !botToken) return { ok: false };
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash') || '';
  const pairs: string[] = [];
  urlParams.forEach((value, key) => {
    if (key === 'hash') return;
    pairs.push(`${key}=${value}`);
  });
  pairs.sort();
  const dataCheckString = pairs.join('\n');
  const secret = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');
  if (hmac !== hash) return { ok: false };
  const userRaw = urlParams.get('user');
  if (!userRaw) return { ok: false };
  try {
    const user = JSON.parse(userRaw);
    return { ok: true, user };
  } catch {
    return { ok: false };
  }
}

function signPayload(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
    const botToken = process.env.TG_BOT_TOKEN || '';
    const appSecret = process.env.APP_SECRET || process.env.TG_WEBHOOK_TOKEN || 'dev_secret';
    if (!botToken) return json({ ok: false, error: 'not_configured' }, 200);

    const contentType = req.headers.get('content-type') || '';
    let initData = '';
    if (contentType.includes('application/json')) {
      const j = await req.json();
      initData = (j?.initData || '').toString();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const form = await req.formData();
      initData = (form.get('initData') as string) || '';
    } else {
      const text = await req.text();
      try { initData = (JSON.parse(text)?.initData || '').toString(); } catch { /* ignore */ }
    }
    if (!initData) return json({ ok: false, error: 'initData_required' }, 400);

    const v = verifyWebApp(initData, botToken);
    if (!v.ok || !v.user) return json({ ok: false, error: 'invalid_signature' }, 200);

    const user = v.user;
    const session = {
      id: String(user.id || ''),
      username: user.username || '',
      name: [user.first_name, user.last_name].filter(Boolean).join(' ').trim(),
      photo_url: user.photo_url || '',
      role: 'traveler',
      ts: Date.now(),
    };
    const payload = Buffer.from(JSON.stringify(session), 'utf8').toString('base64url');
    const sig = signPayload(payload, appSecret);

    const headers: HeadersInit = {
      'Set-Cookie': [
        setCookieHeader('tg_session', payload),
        setCookieHeader('tg_sig', sig),
      ] as any,
      'Content-Type': 'application/json',
    };
    return new Response(JSON.stringify({ ok: true, user: session }), { status: 200, headers });
  } catch (e: any) {
    return json({ ok: false, error: 'internal_error', detail: String(e?.message || e) }, 200);
  }
}

