import crypto from 'node:crypto';

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

function verifySignature(reqBody: any, secret: string): boolean {
  const payload = Object.keys(reqBody)
    .sort()
    .map((k) => `${k}=${reqBody[k]}`)
    .join('&');
  const digest = crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('base64');
  return (reqBody?.Signature || reqBody?.Token || '') === digest;
}

export const config = { runtime: 'nodejs' };

export default async function handler(req: Request): Promise<Response> {
  try {
    const secret = process.env.CP_API_SECRET || '';
    if (!secret) return json({ success: false, error: 'not_configured' }, 200);

    const text = await req.text();
    let body: any = {};
    try { body = JSON.parse(text); } catch { body = Object.fromEntries(new URLSearchParams(text) as any); }

    const ok = verifySignature(body, secret);
    if (!ok) return json({ success: false, error: 'bad_signature' }, 200);

    const event = (body?.Status || body?.Event || '').toLowerCase();
    // TODO: upsert into payments table with idempotency key (InvoiceId/TransactionId)
    switch (event) {
      case 'completed':
      case 'success':
      case 'confirmed':
        return json({ code: 0, success: true });
      default:
        return json({ code: 0, success: true });
    }
  } catch (e: any) {
    return json({ success: false, error: e?.message || 'error' }, 200);
  }
}

