-- ============================================================
-- 001 — Initial schema
-- NOTE: this migration is ALREADY APPLIED to the live Supabase
-- project "TheMillionairesDollar" (mnsjtkzlrentyzqbzhsb) as
-- version 20260603135906_initial_schema. It is mirrored here so
-- the repository documents the full database state.
-- ============================================================

-- Main participants table
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Participation data
  tile_number SERIAL UNIQUE NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('existence', 'verified', 'founding', 'permanent', 'patron', 'curators_circle')),
  amount_paid_cents INTEGER NOT NULL,

  -- Personal data (encrypted at rest by Supabase)
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  display_as TEXT NOT NULL CHECK (display_as IN ('initials', 'full_name')),

  -- Localization
  country_code TEXT NOT NULL,
  city TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),

  -- Project data
  year_became_millionaire INTEGER CHECK (year_became_millionaire IS NULL OR (year_became_millionaire >= 1900 AND year_became_millionaire <= 2100)),
  personal_message TEXT CHECK (personal_message IS NULL OR char_length(personal_message) <= 60),

  -- High-tier data (nullable)
  linkedin_url TEXT,
  business_email TEXT,
  source_of_wealth TEXT,
  phone_number TEXT,

  -- GDPR consents
  consent_participation BOOLEAN NOT NULL DEFAULT true,
  consent_future_contact BOOLEAN NOT NULL DEFAULT false,
  consent_newsletter BOOLEAN NOT NULL DEFAULT false,

  -- Status
  is_public BOOLEAN NOT NULL DEFAULT true,
  removal_requested_at TIMESTAMPTZ,

  -- Vetting (high tiers only)
  vetting_status TEXT NOT NULL DEFAULT 'none' CHECK (vetting_status IN ('none', 'pending', 'in_progress', 'approved', 'rejected')),
  vetting_notes JSONB NOT NULL DEFAULT '{}',

  -- Stripe references
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,

  -- Internal flags
  is_seed_participant BOOLEAN NOT NULL DEFAULT false,
  is_highlighted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_participants_tier ON participants(tier);
CREATE INDEX idx_participants_country ON participants(country_code);
CREATE INDEX idx_participants_year ON participants(year_became_millionaire);
CREATE INDEX idx_participants_public ON participants(is_public) WHERE is_public = true;
CREATE INDEX idx_participants_created ON participants(created_at DESC);

-- Press coverage
CREATE TABLE press_coverage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_name TEXT NOT NULL,
  publication_logo_url TEXT,
  article_url TEXT NOT NULL,
  article_title TEXT NOT NULL,
  quote TEXT,
  published_at DATE,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin action log
CREATE TABLE admin_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Newsletter subscribers (paying or not)
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  source TEXT,
  participant_id UUID REFERENCES participants(id)
);

-- Admin whitelist
CREATE TABLE admin_whitelist (
  email TEXT PRIMARY KEY
);

-- Key/value settings (e.g. tier_overrides)
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO site_settings (key, value) VALUES ('tier_overrides', '{}');

-- Public counters, updated by trigger, broadcast via Realtime
CREATE TABLE counters (
  id TEXT PRIMARY KEY,
  value BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO counters (id, value) VALUES ('participants_total', 0), ('revenue_total_cents', 0);

-- Public views (no PII)
CREATE VIEW public_tiles AS
SELECT id, tile_number, tier, display_name, display_as, country_code, city,
       latitude, longitude, year_became_millionaire, personal_message,
       is_highlighted, created_at
FROM participants
WHERE is_public = true;

CREATE MATERIALIZED VIEW public_stats AS
WITH base AS (
  SELECT country_code, created_at FROM participants WHERE is_public = true
), per_country AS (
  SELECT country_code, COUNT(*)::integer AS c FROM base GROUP BY country_code
)
SELECT
  (SELECT COUNT(*) FROM base)::integer AS total_participants,
  (SELECT COUNT(*) FROM base WHERE created_at > now() - INTERVAL '24 hours')::integer AS last_24h,
  (SELECT COUNT(*) FROM base WHERE created_at > now() - INTERVAL '7 days')::integer AS last_week,
  (SELECT COUNT(*) FROM per_country)::integer AS countries,
  COALESCE((SELECT jsonb_object_agg(country_code, c) FROM per_country), '{}'::jsonb) AS by_country;

CREATE OR REPLACE FUNCTION refresh_public_stats()
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path TO 'public'
AS $$ REFRESH MATERIALIZED VIEW CONCURRENTLY public_stats; $$;

-- Counter trigger
CREATE OR REPLACE FUNCTION refresh_participants_counter()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  UPDATE counters SET value = (SELECT COUNT(*) FROM participants WHERE is_public = true),
    updated_at = now() WHERE id = 'participants_total';
  UPDATE counters SET value = COALESCE((SELECT SUM(amount_paid_cents) FROM participants WHERE is_public = true), 0),
    updated_at = now() WHERE id = 'revenue_total_cents';
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_participants_counter
AFTER INSERT OR UPDATE OR DELETE ON participants
FOR EACH STATEMENT EXECUTE FUNCTION refresh_participants_counter();

-- Realtime broadcast for the public counter
ALTER PUBLICATION supabase_realtime ADD TABLE counters;

-- Row Level Security
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_coverage ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE counters ENABLE ROW LEVEL SECURITY;

-- participants: NO public select policy — public reads go through the
-- public_tiles / public_stats views, which expose no PII.
CREATE POLICY "admin_full_access_participants" ON participants
  FOR ALL
  USING (auth.email() IN (SELECT email FROM admin_whitelist))
  WITH CHECK (auth.email() IN (SELECT email FROM admin_whitelist));

CREATE POLICY "public_read_press" ON press_coverage FOR SELECT USING (true);
CREATE POLICY "admin_write_press" ON press_coverage
  FOR ALL
  USING (auth.email() IN (SELECT email FROM admin_whitelist))
  WITH CHECK (auth.email() IN (SELECT email FROM admin_whitelist));

CREATE POLICY "admin_read_log" ON admin_log
  FOR SELECT USING (auth.email() IN (SELECT email FROM admin_whitelist));

CREATE POLICY "admin_read_newsletter" ON newsletter_subscribers
  FOR SELECT USING (auth.email() IN (SELECT email FROM admin_whitelist));

CREATE POLICY "admin_read_whitelist" ON admin_whitelist
  FOR SELECT USING (auth.email() IN (SELECT email FROM admin_whitelist));

CREATE POLICY "public_read_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "admin_write_settings" ON site_settings
  FOR ALL
  USING (auth.email() IN (SELECT email FROM admin_whitelist))
  WITH CHECK (auth.email() IN (SELECT email FROM admin_whitelist));

CREATE POLICY "public_read_counters" ON counters FOR SELECT USING (true);
