-- Announcements (from Telegram or other sources) with moderation
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  source text,
  source_id text,
  operator_id text references public.operators(id) on delete set null,
  title text,
  text text,
  media jsonb,
  status text check (status in ('pending','approved','rejected')) default 'pending',
  created_at timestamptz default now(),
  approved_at timestamptz,
  rejected_at timestamptz,
  approved_by uuid
);

alter table public.announcements enable row level security;

-- Public can read only approved announcements
create policy if not exists announcements_public_read on public.announcements
  for select to anon, authenticated using (status = 'approved');

-- Admin/service role bypasses RLS; no public insert/update policies intentionally

-- Leads created from Telegram WebApp submissions
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  tour_id text,
  tg_user_id text,
  tg_chat_id text,
  payload jsonb,
  created_at timestamptz default now()
);

alter table public.leads enable row level security;

-- No public read; inserts are via server (service role bypasses RLS)
-- You can later add per-user policies if needed

-- Announcements (модерация постов из Telegram)
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  source text not null,                -- 'telegram:channel' / 'telegram:bot'
  source_id text,                      -- message_id / chat_id
  operator_id text references public.operators(id),
  title text,
  text text,
  media jsonb,                         -- массив ссылок/файлов
  status text not null default 'pending', -- pending/approved/rejected
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.announcements enable row level security;

-- Inserts от бота/вебхука (анон допускаем; лучше ограничить по подписи)
create policy if not exists ann_insert_any on public.announcements for insert with check (true);

-- Только сервисные роли могут читать/модерировать
create policy if not exists ann_no_select on public.announcements for select using (false);
create policy if not exists ann_no_update on public.announcements for update using (false);

