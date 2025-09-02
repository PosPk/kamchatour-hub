-- Leads table for Telegram showcase (simple, non-PII beyond contact)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  tour_id text,
  name text not null,
  contact text not null, -- phone/email/telegram
  tg_user_id text,
  tg_chat_id text,
  payload jsonb,
  created_at timestamptz default now()
);

alter table public.leads enable row level security;

-- Allow anonymous inserts (showcase). Consider tightening with a nonce/signature in production.
create policy if not exists leads_insert_any on public.leads for insert with check (true);

-- Only service role can select (no end-user reads)
create policy if not exists leads_no_select on public.leads for select using (false);

