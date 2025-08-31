export interface TripSummary { id: string; route_id: string; vehicle_id?: string; depart_at: string; arrive_eta?: string; status: string }
export interface SeatRow { seat_id: string; status: 'free' | 'hold' | 'booked' | 'blocked'; class?: string }

export async function searchTrips(dateISO?: string, route_id?: string): Promise<TripSummary[]> {
  const qs = new URLSearchParams();
  if (dateISO) qs.set('date', dateISO);
  if (route_id) qs.set('route_id', route_id);
  const r = await fetch('/api/transfer/search?' + qs.toString());
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || 'search failed');
  return j.trips as TripSummary[];
}

export async function getTrip(id: string): Promise<{ trip: any; seats: SeatRow[] }> {
  const r = await fetch('/api/transfer/trip?id=' + encodeURIComponent(id));
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || 'trip load failed');
  return j as { trip: any; seats: SeatRow[] };
}

export async function holdSeats(trip_id: string, seats: string[], ttl_minutes = 15): Promise<{ hold_id: string; expires_at: string }> {
  const r = await fetch('/api/transfer/hold', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trip_id, seats, ttl_minutes }) });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || 'hold failed');
  return j as { hold_id: string; expires_at: string };
}

export async function bookHold(hold_id: string): Promise<{ booking_id: string }> {
  const r = await fetch('/api/transfer/book', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hold_id }) });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || 'booking failed');
  return j as { booking_id: string };
}

