import { NextResponse } from 'next/server';
import { createServiceClient } from '../../../../lib/supabase';

export async function POST(req: any) {
  try {
    const { trip_id, seats, ttl_minutes = 15, user_id } = await req.json();
    if (!trip_id || !Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const supabase = createServiceClient();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    const { data: seatRows, error: sErr } = await supabase
      .from('transfer_seats')
      .select('seat_id, status')
      .eq('trip_id', trip_id)
      .in('seat_id', seats);
    if (sErr) throw sErr;
    if ((seatRows || []).some((r: any) => r.status !== 'free')) {
      return NextResponse.json({ error: 'Some seats are not free' }, { status: 409 });
    }

    const expires = new Date(Date.now() + Number(ttl_minutes) * 60_000).toISOString();
    const { data: hold, error: hErr } = await supabase
      .from('transfer_holds')
      .insert({ trip_id, seat_ids: seats, user_id: user_id ?? null, expires_at: expires })
      .select('id, expires_at')
      .single();
    if (hErr) throw hErr;

    await supabase
      .from('transfer_seats')
      .update({ status: 'hold' })
      .eq('trip_id', trip_id)
      .in('seat_id', seats);

    return NextResponse.json({ hold_id: hold.id, expires_at: hold.expires_at });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Hold failed' }, { status: 500 });
  }
}

