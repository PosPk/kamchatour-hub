import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: any, res: any) {
	if (req.method !== 'POST') { res.status(405).json({ error: 'Method Not Allowed' }); return; }
	try {
		const { hold_id, customer } = req.body || {};
		if (!hold_id) { res.status(400).json({ error: 'Invalid payload' }); return; }
		const supabase = createServiceClient();
		if (!supabase) { res.status(500).json({ error: 'Supabase not configured' }); return; }
		// Fetch hold
		const { data: hold, error: hErr } = await supabase
			.from('transfer_holds')
			.select('*')
			.eq('id', hold_id)
			.single();
		if (hErr || !hold) { res.status(404).json({ error: 'Hold not found' }); return; }
		if (new Date(hold.expires_at).getTime() < Date.now()) { res.status(410).json({ error: 'Hold expired' }); return; }
		// Create booking (reserved)
		const { data: booking, error: bErr } = await supabase
			.from('transfer_bookings')
			.insert({ trip_id: hold.trip_id, user_id: hold.user_id ?? null, seats: hold.seat_ids, status: 'reserved' })
			.select('id')
			.single();
		if (bErr) throw bErr;
		// Mark seats as booked
		await supabase
			.from('transfer_seats')
			.update({ status: 'booked' })
			.eq('trip_id', hold.trip_id)
			.in('seat_id', hold.seat_ids);
		res.status(200).json({ booking_id: booking.id });
	} catch (e: any) {
		res.status(500).json({ error: e?.message || 'Booking failed' });
	}
}

