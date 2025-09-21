import { NextResponse } from 'next/server';
import { createServiceClient } from '../../../../lib/supabase';

export async function GET(req: any) {
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get('date') || '';
    const route_id = url.searchParams.get('route_id') || undefined;
    const supabase = createServiceClient();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    const day = (date ? new Date(date) : new Date());
    const from = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 0, 0, 0)).toISOString();
    const to = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 23, 59, 59)).toISOString();

    let q: any = supabase
      .from('transfer_trips')
      .select('id, route_id, vehicle_id, depart_at, arrive_eta, status')
      .gte('depart_at', from)
      .lte('depart_at', to)
      .order('depart_at');
    if (route_id) q = q.eq('route_id', route_id);
    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json({ trips: data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Search failed' }, { status: 500 });
  }
}

