-- Core transfer schema: routes, stops, trips, seats, holds, tickets

create table if not exists public.transfer_routes (
	id uuid primary key default gen_random_uuid(),
	code text unique,
	name text not null
);

create table if not exists public.transfer_stops (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	lat double precision,
	lng double precision
);

create table if not exists public.transfer_route_stops (
	route_id uuid not null references public.transfer_routes(id) on delete cascade,
	stop_id uuid not null references public.transfer_stops(id) on delete restrict,
	seq integer not null,
	primary key(route_id, stop_id)
);

-- Trips (instances) with seat map snapshot
create table if not exists public.transfer_trips (
	id uuid primary key default gen_random_uuid(),
	route_id uuid not null references public.transfer_routes(id) on delete restrict,
	vehicle_id uuid references public.transfer_vehicles(id) on delete set null,
	depart_at timestamptz not null,
	arrive_eta timestamptz,
	seat_map_snapshot jsonb not null,
	price_rules_json jsonb,
	status text not null default 'scheduled' check (status in ('scheduled','boarding','departed','cancelled'))
);

-- Seats state per trip
create table if not exists public.transfer_seats (
	trip_id uuid not null references public.transfer_trips(id) on delete cascade,
	seat_id text not null,
	class text default 'standard',
	status text not null default 'free' check (status in ('free','hold','booked','blocked')),
	primary key (trip_id, seat_id)
);
create index if not exists idx_transfer_seats_trip on public.transfer_seats(trip_id);

-- Holds with TTL
create table if not exists public.transfer_holds (
	id uuid primary key default gen_random_uuid(),
	trip_id uuid not null references public.transfer_trips(id) on delete cascade,
	seat_ids text[] not null,
	user_id uuid,
	expires_at timestamptz not null,
	created_at timestamptz default now()
);
create index if not exists idx_transfer_holds_trip_expires on public.transfer_holds(trip_id, expires_at);

-- Tickets and bookings (linking to existing transfer_bookings)
alter table if exists public.transfer_bookings
	add column if not exists trip_id uuid,
	add column if not exists seats text[];

create table if not exists public.transfer_tickets (
	id uuid primary key default gen_random_uuid(),
	booking_id uuid not null references public.transfer_bookings(id) on delete cascade,
	qr text not null,
	passenger_name text,
	baggage jsonb,
	created_at timestamptz default now()
);

