import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServiceClient } from '../../../../lib/supabase';
import { serverLog } from '../../../../lib/logger';

export async function POST(req: any) {
  try {
    const signature = req.headers.get('x-signature') || undefined;
    const secret = process.env.CLOUDPAYMENTS_API_SECRET as string | undefined;
    const raw = await req.text();

    if (!secret || !signature) {
      try { await serverLog('cloudpays:webhook:auth_fail', {}, 'warn'); } catch {}
      return NextResponse.json({ success: false, error: 'No signature/secret' }, { status: 401 });
    }

    const hmac = crypto.createHmac('sha256', secret).update(raw, 'utf8').digest('base64');
    if (hmac !== signature) {
      try { await serverLog('cloudpays:webhook:bad_signature', { signature }, 'warn'); } catch {}
      return NextResponse.json({ success: false, error: 'Bad signature' }, { status: 401 });
    }

    let body: any = {};
    try { body = JSON.parse(raw || '{}'); } catch { body = {}; }
    try { await serverLog('cloudpays:webhook:receive', { body }); } catch {}

    const supabase = createServiceClient();
    if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });

    const bookingId = body?.AccountId as string | undefined;
    if (!bookingId) return NextResponse.json({ success: false, error: 'No booking id' }, { status: 400 });

    // Idempotency by CloudPayments TransactionId
    const actionId = body?.TransactionId || body?.Id || body?.InvoiceId;
    if (!actionId) {
      try { await serverLog('cloudpays:webhook:no_action_id', { bookingId }, 'warn'); } catch {}
      return NextResponse.json({ success: false, error: 'No transaction id' }, { status: 400 });
    }

    const status = body?.Status === 'Completed' ? 'paid' : 'payment_failed';

    const { data: existing } = await supabase
      .from('payments')
      .select('id')
      .eq('id', actionId)
      .limit(1)
      .maybeSingle();
    if (existing) {
      try { await serverLog('cloudpays:webhook:duplicate', { actionId }, 'info'); } catch {}
      return NextResponse.json({ success: true, duplicate: true });
    }

    const { error: pErr } = await supabase
      .from('payments')
      .upsert({ id: actionId, booking_id: bookingId, status, provider: 'cloudpayments', payload: body }, { onConflict: 'id' });
    if (pErr) throw pErr;

    const { error } = await supabase
      .from('bookings')
      .update({ status, payment_data: body, payment_id: actionId })
      .eq('id', bookingId);
    if (error) throw error;

    try { await serverLog('cloudpays:webhook:updated', { bookingId, status, actionId }); } catch {}
    return NextResponse.json({ success: true });
  } catch (e: any) {
    try { await serverLog('cloudpays:webhook:error', { error: e?.message }, 'error'); } catch {}
    return NextResponse.json({ success: false, error: 'Webhook failed' }, { status: 500 });
  }
}

