import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: any, res: any) {
	if (req.method !== 'POST') { res.status(405).json({ error: 'Method Not Allowed' }); return; }
	try {
		const { trip_id, seats, ttl_minutes = 15, user_id } = req.body || {};
		if (!trip_id || !Array.isArray(seats) || seats.length === 0) { res.status(400).json({ error: 'Invalid payload' }); return; }
		const supabase = createServiceClient();
		if (!supabase) { res.status(500).json({ error: 'Supabase not configured' }); return; }
		// Basic availability check
		const { data: seatRows, error: sErr } = await supabase
			.from('transfer_seats')
			.select('seat_id, status')
			.eq('trip_id', trip_id)
			.in('seat_id', seats);
		if (sErr) throw sErr;
		if ((seatRows || []).some(r => r.status !== 'free')) { res.status(409).json({ error: 'Some seats are not free' }); return; }
		// Create hold
		const expires = new Date(Date.now() + ttl_minutes * 60_000).toISOString();
		const { data: hold, error: hErr } = await supabase
			.from('transfer_holds')
			.insert({ trip_id, seat_ids: seats, user_id: user_id ?? null, expires_at: expires })
			.select('id, expires_at')
			.single();
		if (hErr) throw hErr;
		// Mark seats as hold
		await supabase
			.from('transfer_seats')
			.update({ status: 'hold' })
			.eq('trip_id', trip_id)
			.in('seat_id', seats);
		res.status(200).json({ hold_id: hold.id, expires_at: hold.expires_at });
	} catch (e: any) {
		res.status(500).json({ error: e?.message || 'Hold failed' });
	}
}

