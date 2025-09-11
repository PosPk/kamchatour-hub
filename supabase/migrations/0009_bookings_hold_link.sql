-- Link bookings to transfer holds for atomic payment confirmation

alter table if exists public.bookings
  add column if not exists hold_id uuid references public.transfer_holds(id) on delete set null;

create index if not exists idx_bookings_hold on public.bookings(hold_id);

