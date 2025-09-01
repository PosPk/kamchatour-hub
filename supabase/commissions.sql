-- COMMISSIONS: гибкая модель тарифов и история изменений

-- Таблица операторов: дополнительные поля для комиссий
alter table if exists public.operators
  add column if not exists commission_type text default 'percentage',
  add column if not exists custom_commission_rate numeric,
  add column if not exists commission_override boolean default false;

-- Тарифные уровни комиссий
create table if not exists public.commission_tiers (
  id serial primary key,
  operator_status text not null,
  rate numeric not null,
  min_booking_amount numeric default 0,
  max_booking_amount numeric,
  valid_from date not null,
  valid_until date,
  is_active boolean default true
);

-- История изменений комиссий
create table if not exists public.commission_history (
  id serial primary key,
  operator_id text references public.operators(id) on delete set null,
  old_rate numeric,
  new_rate numeric,
  changed_by uuid references auth.users(id),
  changed_at timestamptz default now()
);

-- Базовые ставки (пример) — адаптируйте под реальность
insert into public.commission_tiers(operator_status, rate, min_booking_amount, valid_from, is_active)
select * from (values
  ('A', 10, 100, now()::date, true),
  ('B', 7, 50, now()::date, true),
  ('C', 5, 0, now()::date, true)
) as v(status, rate, min_amt, vfrom, active)
on conflict do nothing;

