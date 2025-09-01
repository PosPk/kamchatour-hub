-- PAYMENTS: идемпотентность и блокировки
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id text references public.bookings(id) on delete cascade,
  amount int not null,
  currency text default 'RUB',
  status text not null check (status in ('pending','succeeded','failed','refunded')),
  idempotency_key text not null,
  provider text,
  payload jsonb,
  created_at timestamptz default now()
);

create unique index if not exists payments_idempotency_key_uidx on public.payments(idempotency_key);

-- Функция для безопасного создания платежа с advisory lock
create or replace function public.create_payment_safe(p_booking text, p_amount int, p_currency text, p_key text, p_provider text, p_payload jsonb)
returns public.payments language plpgsql as $$
declare v_payment public.payments;
begin
  perform pg_advisory_xact_lock(hashtext('payment_' || p_key));
  select * into v_payment from public.payments where idempotency_key = p_key;
  if found then return v_payment; end if;
  insert into public.payments(booking_id, amount, currency, status, idempotency_key, provider, payload)
  values (p_booking, p_amount, coalesce(p_currency,'RUB'), 'pending', p_key, p_provider, p_payload)
  returning * into v_payment;
  return v_payment;
end$$;

