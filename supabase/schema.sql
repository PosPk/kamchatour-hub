-- Enable useful extensions
create extension if not exists pgcrypto;

-- Operators (public catalogue)
create table if not exists public.operators (
  id text primary key,
  name text not null,
  website text,
  phone text,
  regions text[],
  activities text[],
  verified boolean default false,
  partner_level text,
  score int,
  description text,
  logo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tours (public catalogue)
create table if not exists public.tours (
  id text primary key,
  operator_id text references public.operators(id) on delete cascade,
  title text not null,
  title_i18n jsonb,
  region text,
  activity text,
  price_from int,
  duration_days int,
  rating numeric,
  description text,
  description_i18n jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Bookings (sensitive)
create table if not exists public.bookings (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  operator_id text references public.operators(id),
  tour_id text references public.tours(id),
  slot_id text,
  date_from timestamptz,
  date_to timestamptz,
  voucher_code text,
  status text check (status in ('pending','confirmed','cancelled','completed')) default 'pending',
  total int,
  currency text default 'RUB',
  policy jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Threads (messages envelope)
create table if not exists public.threads (
  id text primary key,
  operator_id text,
  user_id uuid not null references auth.users(id) on delete cascade,
  last_message text,
  updated_at timestamptz default now()
);

-- Messages (sensitive)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id text not null references public.threads(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  created_at timestamptz default now()
);

-- Eco Actions
create table if not exists public.eco_actions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  points int not null,
  evidence_url text,
  location jsonb,
  verified boolean default false,
  created_at timestamptz default now()
);

-- Feed Posts (UGC)
create table if not exists public.feed_posts (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  image_url text not null,
  caption text,
  tags text[],
  likes int default 0,
  created_at timestamptz default now()
);

