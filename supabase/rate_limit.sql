-- RATE LIMIT: попытки аутентификации/чувствительные действия
create table if not exists public.auth_attempts (
  id uuid primary key default gen_random_uuid(),
  user_identifier text not null, -- email/IP
  action text not null,          -- 'login'
  created_at timestamptz default now()
);

create index if not exists auth_attempts_idx on public.auth_attempts (user_identifier, action, created_at);

create or replace function public.check_rate_limit(p_ident text, p_action text, p_limit int, p_interval_mins int)
returns boolean language sql as $$
  select count(*) < p_limit from public.auth_attempts
  where user_identifier = p_ident
    and action = p_action
    and created_at > now() - make_interval(mins => p_interval_mins);
$$;

-- Пример использования: перед созданием новой записи попытки
-- select public.check_rate_limit('user@example.com','login',5,1);
-- insert into public.auth_attempts(user_identifier, action) values ('user@example.com','login');

