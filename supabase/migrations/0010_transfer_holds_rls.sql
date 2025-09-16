-- Enable RLS and basic policies for transfer_holds

alter table if exists public.transfer_holds enable row level security;

drop policy if exists transfer_holds_select_own on public.transfer_holds;
create policy transfer_holds_select_own on public.transfer_holds
for select using (user_id is null or auth.uid() = user_id);

drop policy if exists transfer_holds_insert_self on public.transfer_holds;
create policy transfer_holds_insert_self on public.transfer_holds
for insert with check (user_id is null or auth.uid() = user_id);

drop policy if exists transfer_holds_delete_own on public.transfer_holds;
create policy transfer_holds_delete_own on public.transfer_holds
for delete using (user_id is null or auth.uid() = user_id);

