import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

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
    const SUPABASE_URL = process.env.SUPABASE_URL || '';
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
      const payment = {
        transaction_id: String(body?.TransactionId||''),
        invoice_id: String(body?.InvoiceId||''),
        amount: Number(body?.Amount||0),
        currency: String(body?.Currency||'RUB'),
        status: event,
        account_id: String(body?.AccountId||'tg_web'),
        tour_id: String((body?.Data&&body.Data.tour_id)||''),
        raw: body
      } as any;
      // idempotent upsert by transaction_id or invoice_id
      if (payment.transaction_id) {
        await sb.from('payments').upsert(payment, { onConflict: 'transaction_id' });
      } else if (payment.invoice_id) {
        await sb.from('payments').upsert(payment, { onConflict: 'invoice_id' });
      } else {
        await sb.from('payments').insert(payment);
      }
      // Optionally update orders
      if (payment.tour_id && payment.status === 'completed') {
        await sb.from('orders').upsert({
          tour_id: payment.tour_id,
          invoice_id: payment.invoice_id,
          amount: payment.amount,
          currency: payment.currency,
          status: 'paid'
        }, { onConflict: 'invoice_id' });
      }
    }
    return json({ code: 0, success: true });
  } catch (e: any) {
    return json({ success: false, error: e?.message || 'error' }, 200);
  }
}

