-- Example initial migration scaffold
-- Create payments table if not exists
create table if not exists public.payments (
	id uuid primary key default gen_random_uuid(),
	booking_id uuid,
	amount numeric(10,2),
	status text check (status in ('pending','succeeded','failed')),
	raw_data jsonb,
	created_at timestamptz default now(),
	updated_at timestamptz default now()
);

create index if not exists idx_payments_booking_id on public.payments(booking_id);

