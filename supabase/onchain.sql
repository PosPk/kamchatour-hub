-- ON-CHAIN MAPPING + RLS
create table if not exists public.onchain_bookings (
  id uuid primary key default gen_random_uuid(),
  booking_pda text not null,
  booking_id uuid not null,
  traveler_user_id uuid references auth.users(id),
  operator_id text references public.operators(id),
  network text not null,
  commission numeric not null,
  penalty numeric not null,
  status text not null,
  evidence_cid text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.onchain_bookings enable row level security;

-- traveler sees own
create policy if not exists onchain_traveler on public.onchain_bookings
  for select using (auth.uid() = traveler_user_id);

-- operator sees own (by operator_id mapping via users table if есть связь). Упростим: разрешим всем authenticated временно
create policy if not exists onchain_auth_read on public.onchain_bookings
  for select to authenticated using (true);

