-- P0: Consolidated RLS hardening (idempotent)

-- Enable RLS where applicable
alter table if exists public.leads enable row level security;
alter table if exists public.bookings enable row level security;
alter table if exists public.messages enable row level security;
alter table if exists public.tours enable row level security;
alter table if exists public.operators enable row level security;

-- Private tables: users manage only their own (bookings/messages)
create policy if not exists p0_bookings_owner_all on public.bookings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Messages: owner via thread membership (kept restrictive)
create policy if not exists p0_messages_owner_all on public.messages
  for all using (
    exists (
      select 1 from public.threads t
      where t.id = thread_id and t.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.threads t
      where t.id = thread_id and t.user_id = auth.uid()
    )
  );

-- Leads: no public reads; inserts allowed (WebApp), reads by service role only
-- Keep select closed (privacy); service role bypasses RLS
create policy if not exists p0_leads_insert_any on public.leads for insert with check (true);
create policy if not exists p0_leads_no_select on public.leads for select using (false);

-- Public catalog: readable by all (anon)
create policy if not exists p0_tours_read on public.tours for select to anon, authenticated using (true);
create policy if not exists p0_operators_read on public.operators for select to anon, authenticated using (true);

-- Optional: allow authenticated inserts (kept disabled by default in app)
create policy if not exists p0_tours_insert_auth on public.tours for insert to authenticated with check (auth.role() = 'authenticated');
create policy if not exists p0_operators_insert_auth on public.operators for insert to authenticated with check (auth.role() = 'authenticated');

