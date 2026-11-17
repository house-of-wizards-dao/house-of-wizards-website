-- pg_net creates its functions in net, but its extension metadata should live
-- outside the exposed public schema. It is not relocatable, so recreate the
-- extension installed by this feature. The Vault token and cron job persist.
drop extension pg_net;
create extension pg_net with schema extensions;
