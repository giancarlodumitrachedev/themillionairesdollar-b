-- ============================================================
-- 004 — public_stats grants + automatic refresh
-- ALREADY APPLIED to the live project as
-- public_stats_grants_and_auto_refresh (2026-06-12).
--
-- public_stats is a MATERIALIZED view. It lacked SELECT grants for the
-- public API roles, and nothing refreshed it. Fix both: grant reads and
-- refresh it from the same statement trigger that maintains the counters,
-- so stats are always exact in real time (no cron needed at this scale).
-- ============================================================

GRANT SELECT ON public.public_stats TO anon, authenticated, service_role;

-- Unique index enables REFRESH ... CONCURRENTLY for a future pg_cron job
-- (single-row aggregate, so any column is unique).
CREATE UNIQUE INDEX IF NOT EXISTS public_stats_singleton
  ON public.public_stats (total_participants);

-- Non-concurrent refresh inside the trigger: CONCURRENTLY is not allowed
-- in a transaction, and triggers always run in one. The exclusive lock is
-- negligible at this scale; revisit past ~100K rows (switch to pg_cron +
-- refresh_public_stats(), which uses CONCURRENTLY).
CREATE OR REPLACE FUNCTION public.refresh_participants_counter()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE counters SET value = (SELECT count(*) FROM participants WHERE is_public = true),
    updated_at = now() WHERE id = 'participants_total';
  UPDATE counters SET value = coalesce((SELECT sum(amount_paid_cents) FROM participants WHERE is_public = true), 0),
    updated_at = now() WHERE id = 'revenue_total_cents';
  REFRESH MATERIALIZED VIEW public_stats;
  RETURN NULL;
END;
$$;
