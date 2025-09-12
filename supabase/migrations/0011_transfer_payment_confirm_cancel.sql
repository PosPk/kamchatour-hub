-- Atomic confirm/cancel functions to transition hold -> booking and seat states

create or replace function public.transfer_confirm_payment(
  p_hold_id uuid,
  p_amount numeric
)
returns uuid
language plpgsql
as $$
declare
  v_hold record;
  v_booking_id uuid;
begin
  -- Load hold and validate
  select * into v_hold from public.transfer_holds where id = p_hold_id for update;
  if not found then
    raise exception 'hold_not_found';
  end if;
  if v_hold.expires_at <= now() then
    -- Free seats and delete hold
    update public.transfer_seats s set status = 'free'
      where s.trip_id = v_hold.trip_id and s.seat_id = any(v_hold.seat_ids) and s.status = 'hold';
    delete from public.transfer_holds where id = p_hold_id;
    raise exception 'hold_expired';
  end if;

  -- Create booking
  insert into public.bookings(kind, title, user_id, status, total, hold_id)
    values ('transfer', 'Transfer booking', v_hold.user_id, 'paid', p_amount, p_hold_id)
    returning id into v_booking_id;

  -- Flip seats to booked
  update public.transfer_seats s set status = 'booked'
    where s.trip_id = v_hold.trip_id and s.seat_id = any(v_hold.seat_ids);

  -- Remove hold
  delete from public.transfer_holds where id = p_hold_id;

  return v_booking_id;
end;
$$;

create or replace function public.transfer_cancel_payment(
  p_hold_id uuid
)
returns void
language plpgsql
as $$
declare
  v_hold record;
begin
  select * into v_hold from public.transfer_holds where id = p_hold_id for update;
  if not found then
    return;
  end if;
  -- Free seats and delete hold
  update public.transfer_seats s set status = 'free'
    where s.trip_id = v_hold.trip_id and s.seat_id = any(v_hold.seat_ids) and s.status in ('hold');
  delete from public.transfer_holds where id = p_hold_id;
end;
$$;

