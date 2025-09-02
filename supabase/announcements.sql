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

