import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: any, res: any) {
	if (req.method !== 'POST') { res.status(405).json({ error: 'Method Not Allowed' }); return; }
	try {
		const { trip_id, seats, ttl_sec = 300, user_id } = req.body || {};
		if (!trip_id || !Array.isArray(seats) || seats.length === 0) { res.status(400).json({ error: 'Invalid payload' }); return; }
		const supabase = createServiceClient();
		if (!supabase) { res.status(500).json({ error: 'Supabase not configured' }); return; }
		// Atomic RPC to reserve seats with TTL
		const { data, error } = await supabase
			.rpc('reserve_seat', {
				p_trip_id: trip_id,
				p_seat_ids: seats,
				p_user_id: user_id ?? null,
				p_ttl_seconds: ttl_sec
			});
		if (error) {
			const msg = String(error.message || '');
			if (msg.includes('seat_conflict')) { res.status(409).json({ error: 'Some seats are not free' }); return; }
			if (msg.includes('invalid_parameters')) { res.status(400).json({ error: 'Invalid payload' }); return; }
			throw error;
		}
		const row = Array.isArray(data) ? data[0] : data;
		res.status(200).json({ hold_id: row?.hold_id, expires_at: row?.expires_at });
	} catch (e: any) {
		res.status(500).json({ error: e?.message || 'Hold failed' });
	}
}

