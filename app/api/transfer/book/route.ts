import { NextResponse } from 'next/server';
import { createServiceClient } from '../../../../lib/supabase';

export async function POST(req: any) {
  try {
    const { hold_id, customer } = await req.json();
    if (!hold_id) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    const supabase = createServiceClient();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    const { data: hold, error: hErr } = await supabase
      .from('transfer_holds')
      .select('*')
      .eq('id', hold_id)
      .single();
    if (hErr || !hold) return NextResponse.json({ error: 'Hold not found' }, { status: 404 });
    if (new Date(hold.expires_at).getTime() < Date.now()) return NextResponse.json({ error: 'Hold expired' }, { status: 410 });

    const { data: booking, error: bErr } = await supabase
      .from('transfer_bookings')
      .insert({ trip_id: hold.trip_id, user_id: hold.user_id ?? null, seats: hold.seat_ids, status: 'reserved' })
      .select('id')
      .single();
    if (bErr) throw bErr;

    await supabase
      .from('transfer_seats')
      .update({ status: 'booked' })
      .eq('trip_id', hold.trip_id)
      .in('seat_id', hold.seat_ids);

    return NextResponse.json({ booking_id: booking.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Booking failed' }, { status: 500 });
  }
}

