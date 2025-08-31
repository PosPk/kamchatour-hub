import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: any, res: any) {
	if (req.method !== 'GET') { res.status(405).json({ error: 'Method Not Allowed' }); return; }
	try {
		const { date, route_id } = req.query || {};
		const supabase = createServiceClient();
		if (!supabase) { res.status(500).json({ error: 'Supabase not configured' }); return; }
		let q = supabase
			.from('transfer_trips')
			.select('id, route_id, vehicle_id, depart_at, arrive_eta, status')
			.gte('depart_at', new Date(date || Date.now()).toISOString().slice(0,10) + 'T00:00:00Z')
			.lte('depart_at', new Date(date || Date.now()).toISOString().slice(0,10) + 'T23:59:59Z')
			.order('depart_at');
		if (route_id) q = q.eq('route_id', route_id);
		const { data, error } = await q;
		if (error) throw error;
		res.status(200).json({ trips: data });
	} catch (e: any) {
		res.status(500).json({ error: e?.message || 'Search failed' });
	}
}

