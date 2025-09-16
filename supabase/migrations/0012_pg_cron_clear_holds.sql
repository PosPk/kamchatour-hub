-- Schedule periodic cleanup of expired holds via pg_cron (if available)

do $$ begin
  perform 1 from pg_extension where extname = 'pg_cron';
  if found then
    perform cron.schedule('clear-expired-transfer-holds', '* * * * *', $$select public.expire_transfer_holds();$$);
  end if;
end $$;

