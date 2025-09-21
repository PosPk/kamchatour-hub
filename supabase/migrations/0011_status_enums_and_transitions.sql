-- Status enums and guarded transitions for bookings/payments (P0)
-- Safe to run multiple times if types already exist

do $$ begin
  create type public.booking_status as enum ('new','hold','paid','confirmed','canceled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('initiated','authorized','captured','refunded','voided','failed');
exception when duplicate_object then null; end $$;

-- Align table columns to enums when possible
do $$ begin
  if exists(select 1 from information_schema.columns where table_schema='public' and table_name='bookings' and column_name='status') then
    alter table public.bookings alter column status type public.booking_status using status::public.booking_status;
  end if;
end $$;

do $$ begin
  if exists(select 1 from information_schema.columns where table_schema='public' and table_name='payments' and column_name='status') then
    alter table public.payments alter column status type public.payment_status using status::public.payment_status;
  end if;
end $$;

-- Transition guards
create or replace function public.booking_set_status(p_id uuid, p_next public.booking_status)
returns public.booking_status
language plpgsql
security definer
as $$
declare
  v_prev public.booking_status;
begin
  select status into v_prev from public.bookings where id = p_id for update;
  if v_prev is null then
    raise exception 'booking % not found', p_id;
  end if;
  -- allowed transitions
  if (v_prev = 'new' and p_next in ('hold','canceled'))
     or (v_prev = 'hold' and p_next in ('paid','canceled'))
     or (v_prev = 'paid' and p_next in ('confirmed','canceled'))
     or (v_prev = 'confirmed' and p_next in ('canceled'))
  then
    update public.bookings set status = p_next, updated_at = now() where id = p_id;
    return p_next;
  else
    raise exception 'illegal booking status transition: % -> %', v_prev, p_next;
  end if;
end;$$;

create or replace function public.payment_set_status(p_id text, p_next public.payment_status)
returns public.payment_status
language plpgsql
security definer
as $$
declare
  v_prev public.payment_status;
begin
  select status into v_prev from public.payments where id = p_id for update;
  if v_prev is null then
    raise exception 'payment % not found', p_id;
  end if;
  if (v_prev = 'initiated' and p_next in ('authorized','failed','voided'))
     or (v_prev = 'authorized' and p_next in ('captured','voided','failed'))
     or (v_prev = 'captured' and p_next in ('refunded'))
  then
    update public.payments set status = p_next, updated_at = now() where id = p_id;
    return p_next;
  else
    raise exception 'illegal payment status transition: % -> %', v_prev, p_next;
  end if;
end;$$;

-- Minimal RLS adjustments (no-op here, keep existing policies). Full RLS review in separate migration.

