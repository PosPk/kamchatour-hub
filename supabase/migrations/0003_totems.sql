-- Totems balances and transactions
create table if not exists public.user_totems (
	user_id uuid primary key,
	bear integer not null default 0 check (bear >= 0),
	volcano integer not null default 0 check (volcano >= 0),
	salmon integer not null default 0 check (salmon >= 0),
	updated_at timestamptz default now()
);

create table if not exists public.totem_transactions (
	id bigserial primary key,
	user_id uuid not null,
	totem_type text not null check (totem_type in ('bear','volcano','salmon')),
	amount integer not null,
	reason text not null,
	action_id uuid unique,
	created_at timestamptz default now()
);

create index if not exists idx_totem_transactions_user_id on public.totem_transactions(user_id);
create index if not exists idx_totem_transactions_created_at on public.totem_transactions(created_at desc);

-- RPC: increment_totem with daily limit + idempotency
create or replace function public.increment_totem(
	user_uuid uuid,
	totem_name text,
	points_amount integer,
	reason_text text,
	action_id uuid default null
) returns jsonb
language plpgsql
security definer
as $$
declare
	daily_limit integer := 1000;
	current_daily_total integer;
	new_balances public.user_totems;
begin
	if totem_name not in ('bear','volcano','salmon') then
		return jsonb_build_object('success', false, 'error', 'Invalid totem type');
	end if;

	if action_id is not null and exists (
		select 1 from public.totem_transactions where action_id = increment_totem.action_id
	) then
		return jsonb_build_object('success', true, 'idempotent', true);
	end if;

	perform pg_advisory_xact_lock(hashtext('totem_' || user_uuid::text));

	select coalesce(sum(amount), 0) into current_daily_total
	from public.totem_transactions
	where user_id = user_uuid and created_at >= (now() at time zone 'UTC')::date;

	if current_daily_total + points_amount > daily_limit then
		return jsonb_build_object('success', false, 'error', 'Daily limit exceeded', 'limit', daily_limit, 'current', current_daily_total);
	end if;

	insert into public.user_totems (user_id, bear, volcano, salmon)
	values (
		user_uuid,
		case when totem_name = 'bear' then points_amount else 0 end,
		case when totem_name = 'volcano' then points_amount else 0 end,
		case when totem_name = 'salmon' then points_amount else 0 end
	)
	on conflict (user_id) do update set
		bear = public.user_totems.bear + excluded.bear,
		volcano = public.user_totems.volcano + excluded.volcano,
		salmon = public.user_totems.salmon + excluded.salmon,
		updated_at = now()
	returning * into new_balances;

	insert into public.totem_transactions (user_id, totem_type, amount, reason, action_id)
	values (user_uuid, totem_name, points_amount, reason_text, action_id);

	return jsonb_build_object('success', true, 'balances', jsonb_build_object('bear', new_balances.bear, 'volcano', new_balances.volcano, 'salmon', new_balances.salmon));
end;
$$;

