-- P0: Align bookings/payments schema with app code, idempotency and basic indexes

-- Bookings table (generic)
create table if not exists public.bookings (
	id uuid primary key default gen_random_uuid(),
	kind text not null default 'tours' check (kind in ('tours','activities','transfer')),
	title text,
	user_id uuid,
	status text not null default 'created' check (status in ('created','paid','payment_failed','cancelled')),
	total numeric(10,2),
	payment_id text,
	payment_data jsonb,
	created_at timestamptz default now(),
	updated_at timestamptz default now()
);
create index if not exists idx_bookings_user on public.bookings(user_id);
create index if not exists idx_bookings_status on public.bookings(status);

-- Payments table (provider-agnostic)
create table if not exists public.payments (
	id text primary key, -- provider transaction id or action_id
	booking_id uuid references public.bookings(id) on delete set null,
	provider text not null,
	status text not null check (status in ('pending','paid','payment_failed')),
	amount numeric(10,2),
	payload jsonb,
	created_at timestamptz default now(),
	updated_at timestamptz default now()
);
create index if not exists idx_payments_booking on public.payments(booking_id);

-- Minimal trigger to keep updated_at fresh
create or replace function public.touch_updated_at() returns trigger as $$
begin
	new.updated_at = now();
	return new;
end;
$$ language plpgsql;

drop trigger if exists trg_bookings_touch on public.bookings;
create trigger trg_bookings_touch before update on public.bookings for each row execute function public.touch_updated_at();

drop trigger if exists trg_payments_touch on public.payments;
create trigger trg_payments_touch before update on public.payments for each row execute function public.touch_updated_at();

