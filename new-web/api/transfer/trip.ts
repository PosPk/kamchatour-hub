import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method Not Allowed' }); return; }
  try {
    const { id } = req.query || {};
    if (!id) { res.status(400).json({ error: 'trip id required' }); return; }
    const supabase = createServiceClient();
    if (!supabase) { res.status(500).json({ error: 'Supabase not configured' }); return; }
    const { data: trip, error: tErr } = await supabase
      .from('transfer_trips')
      .select('id, route_id, vehicle_id, depart_at, arrive_eta, status, seat_map_snapshot')
      .eq('id', id)
      .single();
    if (tErr || !trip) { res.status(404).json({ error: 'Trip not found' }); return; }
    const { data: seats, error: sErr } = await supabase
      .from('transfer_seats')
      .select('seat_id, status, class')
      .eq('trip_id', id);
    if (sErr) { res.status(500).json({ error: 'Seats load failed', detail: sErr.message }); return; }
    res.status(200).json({ trip, seats });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Trip load failed' });
  }
}

