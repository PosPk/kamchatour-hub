-- Minimal passengers table linked to generic bookings

create table if not exists public.booking_passengers (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  full_name text not null,
  birth_date date,
  document jsonb,
  contact jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_booking_passengers_booking on public.booking_passengers(booking_id);

