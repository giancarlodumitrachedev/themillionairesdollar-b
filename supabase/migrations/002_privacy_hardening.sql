-- ============================================================
-- 002 — Privacy hardening + webhook idempotency
-- ALREADY APPLIED to the live project as
-- privacy_hardening_and_webhook_idempotency (2026-06-12).
-- ============================================================

-- 1) public_tiles: never expose the full display_name when the participant
--    chose initials-only. Initials are computed in SQL.
CREATE OR REPLACE VIEW public.public_tiles AS
SELECT
  id,
  tile_number,
  tier,
  CASE
    WHEN display_as = 'initials' THEN (
      SELECT string_agg(upper(substr(w.word, 1, 1)), '.' ORDER BY w.ord) || '.'
      FROM regexp_split_to_table(trim(display_name), '\s+') WITH ORDINALITY AS w(word, ord)
      WHERE w.word <> ''
    )
    ELSE display_name
  END AS display_name,
  display_as,
  country_code,
  city,
  latitude,
  longitude,
  year_became_millionaire,
  personal_message,
  is_highlighted,
  created_at
FROM participants
WHERE is_public = true;

-- 2) Counters: anon may read the public participant counter only;
--    total revenue stays server-side (it gates tier unlocks).
DROP POLICY IF EXISTS "public_read_counters" ON public.counters;
CREATE POLICY "public_read_participants_counter" ON public.counters
  FOR SELECT USING (id = 'participants_total');

-- 3) Site settings: anon may read tier overrides only.
DROP POLICY IF EXISTS "public_read_settings" ON public.site_settings;
CREATE POLICY "public_read_tier_overrides" ON public.site_settings
  FOR SELECT USING (key = 'tier_overrides');

-- 4) Stripe webhook idempotency: one participant per payment intent.
CREATE UNIQUE INDEX IF NOT EXISTS idx_participants_payment_intent
  ON public.participants (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;
