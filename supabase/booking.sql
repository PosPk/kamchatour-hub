-- Booking lifecycle for Telegram prebooking and app bookings

-- States cover Telegram prebooking through completion
create type booking_status as enum (
  'prebook_pending',    -- пользователь оставил предбронь, ждёт подтверждения оператора
  'prebook_rejected',   -- оператор отклонил
  'prebook_confirmed',  -- оператор подтвердил (ожидаем поездку)
  'cancel_requested',   -- пользователь запросил отмену, решаем по политике
  'cancelled',          -- отменено
  'completed'           -- завершено
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- identities
  user_id uuid references auth.users(id),        -- может быть null для Telegram lead prebook (гость)
  tg_user_id text,

  operator_id text references public.operators(id),
  tour_id text references public.tours(id),

  -- requested details
  date_from timestamptz,
  date_to timestamptz,
  party_size int,
  contact text,
  payload jsonb,

  status booking_status not null default 'prebook_pending',
  policy jsonb,                      -- сохранённая политика отмены на момент заявки
  policy_version text,
  notes text,

  -- post-trip
  voucher_code text,
  completion_rating int
);

create table if not exists public.booking_events (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  created_at timestamptz default now(),
  actor text,          -- 'user' | 'operator' | 'system'
  type text,           -- 'prebook_created' | 'prebook_confirmed' | 'prebook_rejected' | 'cancel_requested' | 'cancelled' | 'completed'
  data jsonb
);

-- RLS: owner can read/update own; operator visibility TBD (later via role claims)
alter table public.bookings enable row level security;
alter table public.booking_events enable row level security;

create policy if not exists bookings_owner_read on public.bookings
  for select using (auth.uid() = user_id);
create policy if not exists bookings_owner_update on public.bookings
  for update using (auth.uid() = user_id);
create policy if not exists booking_events_owner_read on public.booking_events
  for select using (exists(select 1 from public.bookings b where b.id = booking_id and b.user_id = auth.uid()));

-- Inserts come from server API (service role), not from public clients

