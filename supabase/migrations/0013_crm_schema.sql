-- CRM core: contacts, leads, deals with basic RLS

create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  email text,
  created_by uuid,
  created_at timestamptz default now()
);
create index if not exists idx_crm_contacts_phone on public.crm_contacts(lower(coalesce(phone,'')));
create index if not exists idx_crm_contacts_email on public.crm_contacts(lower(coalesce(email,'')));

create table if not exists public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.crm_contacts(id) on delete set null,
  operator_id text,
  source text,
  tour_id text,
  date_from date,
  date_to date,
  pax_count int,
  comment text,
  status text not null default 'new' check (status in ('new','qualified','offer','booked','paid','closed')),
  created_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_crm_leads_status on public.crm_leads(status);
create index if not exists idx_crm_leads_operator on public.crm_leads(operator_id);
create index if not exists idx_crm_leads_created on public.crm_leads(created_at desc);

create table if not exists public.crm_deals (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.crm_leads(id) on delete set null,
  operator_id text,
  title text,
  total numeric(10,2),
  currency text default 'RUB',
  status text not null default 'offer' check (status in ('offer','booked','paid','closed','cancelled')),
  created_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_crm_deals_status on public.crm_deals(status);
create index if not exists idx_crm_deals_operator on public.crm_deals(operator_id);

-- Touch trigger
create or replace function public.touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_crm_leads_touch on public.crm_leads;
create trigger trg_crm_leads_touch before update on public.crm_leads for each row execute function public.touch_updated_at();

drop trigger if exists trg_crm_deals_touch on public.crm_deals;
create trigger trg_crm_deals_touch before update on public.crm_deals for each row execute function public.touch_updated_at();

-- RLS policies (basic): creator can access; admins (user_roles) can access all
alter table if exists public.crm_contacts enable row level security;
alter table if exists public.crm_leads enable row level security;
alter table if exists public.crm_deals enable row level security;

create or replace function public.is_admin(uid uuid)
returns boolean language sql stable as $$
  select exists (select 1 from public.user_roles where user_id = uid and role = 'admin')
$$;

drop policy if exists crm_contacts_rw on public.crm_contacts;
create policy crm_contacts_rw on public.crm_contacts
using (created_by is null or created_by = auth.uid() or public.is_admin(auth.uid()))
with check (created_by is null or created_by = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists crm_leads_rw on public.crm_leads;
create policy crm_leads_rw on public.crm_leads
using (created_by is null or created_by = auth.uid() or public.is_admin(auth.uid()))
with check (created_by is null or created_by = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists crm_deals_rw on public.crm_deals;
create policy crm_deals_rw on public.crm_deals
using (created_by is null or created_by = auth.uid() or public.is_admin(auth.uid()))
with check (created_by is null or created_by = auth.uid() or public.is_admin(auth.uid()));

