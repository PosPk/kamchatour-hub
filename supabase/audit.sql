-- AUDIT LOG: таблица + триггеры для критичных таблиц
create extension if not exists pgcrypto;

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id text not null,
  operation text not null check (operation in ('INSERT','UPDATE','DELETE')),
  old_data jsonb,
  new_data jsonb,
  user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

create or replace function public.audit_trigger()
returns trigger language plpgsql as $$
declare
  v_old jsonb;
  v_new jsonb;
  v_id text;
begin
  if (tg_op = 'DELETE') then
    v_old := to_jsonb(old);
    v_new := null;
    v_id := coalesce((old).id::text, (old).booking_id::text, (old).thread_id::text);
  elsif (tg_op = 'UPDATE') then
    v_old := to_jsonb(old);
    v_new := to_jsonb(new);
    v_id := coalesce((new).id::text, (new).booking_id::text, (new).thread_id::text);
  else
    v_old := null;
    v_new := to_jsonb(new);
    v_id := coalesce((new).id::text, (new).booking_id::text, (new).thread_id::text);
  end if;

  insert into public.audit_log(table_name, record_id, operation, old_data, new_data, user_id)
  values (tg_table_name, v_id, tg_op, v_old, v_new, auth.uid());
  return null;
end$$;

-- Навешиваем аудит на ключевые таблицы (добавьте по мере роста схемы)
do $$ begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='bookings') then
    drop trigger if exists trg_audit_bookings on public.bookings;
    create trigger trg_audit_bookings after insert or update or delete on public.bookings
    for each row execute function public.audit_trigger();
  end if;

  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='messages') then
    drop trigger if exists trg_audit_messages on public.messages;
    create trigger trg_audit_messages after insert or update or delete on public.messages
    for each row execute function public.audit_trigger();
  end if;

  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='eco_actions') then
    drop trigger if exists trg_audit_eco_actions on public.eco_actions;
    create trigger trg_audit_eco_actions after insert or update or delete on public.eco_actions
    for each row execute function public.audit_trigger();
  end if;
end $$;

