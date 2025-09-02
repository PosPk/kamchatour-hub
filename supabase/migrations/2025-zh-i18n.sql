-- Ensure i18n columns exist for tours
alter table if exists public.tours
  add column if not exists title_i18n jsonb,
  add column if not exists description_i18n jsonb;

