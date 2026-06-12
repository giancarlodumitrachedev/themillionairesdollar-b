-- ============================================================
-- 003 — Fix infinite recursion in admin policies
-- ALREADY APPLIED to the live project as fix_admin_policy_recursion
-- (2026-06-12).
--
-- The original admin policies used
--   auth.email() IN (SELECT email FROM admin_whitelist)
-- and admin_whitelist's own SELECT policy was self-referential. Any anon
-- query touching a table that ALSO has an admin policy (site_settings,
-- press_coverage) raised "infinite recursion detected in policy".
-- A SECURITY DEFINER helper breaks the cycle.
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM admin_whitelist WHERE email = auth.email());
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "admin_read_whitelist" ON public.admin_whitelist;
CREATE POLICY "admin_read_whitelist" ON public.admin_whitelist
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "admin_full_access_participants" ON public.participants;
CREATE POLICY "admin_full_access_participants" ON public.participants
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_write_press" ON public.press_coverage;
CREATE POLICY "admin_write_press" ON public.press_coverage
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_write_settings" ON public.site_settings;
CREATE POLICY "admin_write_settings" ON public.site_settings
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_read_log" ON public.admin_log;
CREATE POLICY "admin_read_log" ON public.admin_log
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "admin_read_newsletter" ON public.newsletter_subscribers;
CREATE POLICY "admin_read_newsletter" ON public.newsletter_subscribers
  FOR SELECT USING (public.is_admin());
