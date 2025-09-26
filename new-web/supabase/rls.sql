-- Enable RLS on sensitive tables
alter table public.bookings enable row level security;
alter table public.threads enable row level security;
alter table public.messages enable row level security;
alter table public.eco_actions enable row level security;
alter table public.feed_posts enable row level security;

-- Public catalogue (read‑only for anon, full for service/admin)
alter table public.operators enable row level security;
alter table public.tours enable row level security;

-- Policies: Operators/Tours (read for all; write by service role only)
create policy if not exists operators_read for select on public.operators to anon, authenticated using (true);
create policy if not exists tours_read for select on public.tours to anon, authenticated using (true);

-- Bookings: owner can select/insert/update; operator may see related by thread? keep owner only for now
create policy if not exists bookings_owner_select on public.bookings for select using (auth.uid() = user_id);
create policy if not exists bookings_owner_insert on public.bookings for insert with check (auth.uid() = user_id);
create policy if not exists bookings_owner_update on public.bookings for update using (auth.uid() = user_id);

-- Threads: user can see their threads
create policy if not exists threads_owner_select on public.threads for select using (auth.uid() = user_id);
create policy if not exists threads_owner_insert on public.threads for insert with check (auth.uid() = user_id);
create policy if not exists threads_owner_update on public.threads for update using (auth.uid() = user_id);

-- Messages: only participants (thread.user_id or operator staff via future role) — currently user only
create policy if not exists messages_owner_select on public.messages for select using (
  exists (select 1 from public.threads t where t.id = thread_id and t.user_id = auth.uid())
);
create policy if not exists messages_owner_insert on public.messages for insert with check (
  exists (select 1 from public.threads t where t.id = thread_id and t.user_id = auth.uid())
);

-- Eco actions: owner only
create policy if not exists eco_owner_select on public.eco_actions for select using (auth.uid() = user_id);
create policy if not exists eco_owner_insert on public.eco_actions for insert with check (auth.uid() = user_id);
create policy if not exists eco_owner_update on public.eco_actions for update using (auth.uid() = user_id);

-- Feed posts: public read, owner write
create policy if not exists feed_read on public.feed_posts for select using (true);
create policy if not exists feed_owner_insert on public.feed_posts for insert with check (auth.uid() = user_id);
create policy if not exists feed_owner_update on public.feed_posts for update using (auth.uid() = user_id);

