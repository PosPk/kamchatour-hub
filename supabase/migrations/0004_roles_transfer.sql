-- User roles
create table if not exists public.user_roles (
	user_id uuid not null,
	role text not null check (role in ('traveler','operator','guide','transfer','agent','admin')),
	primary key (user_id, role)
);

-- Transfer models
create table if not exists public.transfer_vehicles (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	type text not null check (type in ('bus','helicopter','boat','atv','snowcat')),
	seats integer not null check (seats > 0)
);

create table if not exists public.transfer_schedules (
	id uuid primary key default gen_random_uuid(),
	vehicle_id uuid not null references public.transfer_vehicles(id) on delete cascade,
	date timestamptz not null,
	total_seats integer not null check (total_seats > 0),
	available_seats integer not null check (available_seats >= 0)
);

create table if not exists public.transfer_bookings (
	id uuid primary key default gen_random_uuid(),
	schedule_id uuid not null references public.transfer_schedules(id) on delete cascade,
	user_id uuid,
	seats integer not null check (seats > 0),
	status text not null check (status in ('reserved','paid','cancelled')) default 'reserved',
	created_at timestamptz default now()
);

create index if not exists idx_transfer_schedules_date on public.transfer_schedules(date desc);
create index if not exists idx_transfer_bookings_schedule on public.transfer_bookings(schedule_id);

