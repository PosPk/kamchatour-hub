-- Atomic reserve function with TTL and cleanup for expired holds

create or replace function public.expire_transfer_holds()
returns void
language plpgsql
as $$
declare
  h record;
begin
  -- Iterate expired holds and free seats
  for h in
    select id, trip_id, seat_ids from public.transfer_holds
    where expires_at <= now()
  loop
    -- Free seats that are still on hold
    update public.transfer_seats s
      set status = 'free'
      where s.trip_id = h.trip_id
        and s.seat_id = any(h.seat_ids)
        and s.status = 'hold';
    -- Remove hold
    delete from public.transfer_holds where id = h.id;
  end loop;
end;
$$;

-- p_ttl_seconds default 300s
create or replace function public.reserve_seat(
  p_trip_id uuid,
  p_seat_ids text[],
  p_user_id uuid,
  p_ttl_seconds integer default 300
)
returns table(hold_id uuid, expires_at timestamptz)
language plpgsql
as $$
declare
  grabbed_count int;
  required_count int;
  v_expires timestamptz;
  v_hold_id uuid;
begin
  if p_trip_id is null or p_seat_ids is null or array_length(p_seat_ids, 1) is null then
    raise exception 'invalid_parameters';
  end if;

  -- Best-effort cleanup of expired holds before reserving
  perform public.expire_transfer_holds();

  required_count := array_length(p_seat_ids, 1);

  -- Try to flip all requested seats from free -> hold atomically
  update public.transfer_seats s
    set status = 'hold'
    where s.trip_id = p_trip_id
      and s.seat_id = any(p_seat_ids)
      and s.status = 'free'
  returning 1 into grabbed_count;

  -- grabbed_count will get only the last returned row; we need actual count
  get diagnostics grabbed_count = row_count;

  if grabbed_count <> required_count then
    -- Revert any partial holds we made in this statement
    update public.transfer_seats s
      set status = 'free'
      where s.trip_id = p_trip_id
        and s.seat_id = any(p_seat_ids)
        and s.status = 'hold';
    raise exception 'seat_conflict';
  end if;

  v_expires := now() + make_interval(secs => greatest(p_ttl_seconds, 30));

  insert into public.transfer_holds(trip_id, seat_ids, user_id, expires_at)
    values (p_trip_id, p_seat_ids, p_user_id, v_expires)
    returning id, expires_at into v_hold_id, v_expires;

  hold_id := v_hold_id;
  expires_at := v_expires;
  return next;
end;
$$;

-- Optional: index to accelerate seat state transitions
create index if not exists idx_transfer_seats_status on public.transfer_seats(trip_id, status);

