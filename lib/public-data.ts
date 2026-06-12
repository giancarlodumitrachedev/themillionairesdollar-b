import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database, PublicStats, PublicTile, PressCoverage } from "./supabase/database.types";
import { computeAvailability, type TierId, type TierOverrides } from "./tiers";

/**
 * Read-only anon client for public data in server components.
 * No cookies involved → usable in cached/static contexts.
 */
function anonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const EMPTY_STATS: PublicStats = {
  total_participants: 0,
  last_24h: 0,
  last_week: 0,
  countries: 0,
  by_country: {},
};

export async function getPublicStats(): Promise<PublicStats> {
  const supabase = anonClient();
  if (!supabase) return EMPTY_STATS;
  const { data } = await supabase.from("public_stats").select("*").single();
  return data ?? EMPTY_STATS;
}

export async function getTilesPreview(limit = 50): Promise<PublicTile[]> {
  const supabase = anonClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("public_tiles")
    .select("*")
    .order("is_highlighted", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getTileById(id: string): Promise<PublicTile | null> {
  const supabase = anonClient();
  if (!supabase) return null;
  const { data } = await supabase.from("public_tiles").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getPressCoverage(): Promise<PressCoverage[]> {
  const supabase = anonClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("press_coverage")
    .select("*")
    .order("display_order", { ascending: true })
    .order("published_at", { ascending: false });
  return data ?? [];
}

export interface TierAvailabilityResult {
  availability: Record<TierId, boolean>;
}

/**
 * Tier gates depend on total revenue, which is intentionally NOT public.
 * Read it with the service role when available; with only the anon key
 * (e.g. local dev without secrets) every threshold tier stays closed.
 */
export async function getTierAvailability(): Promise<TierAvailabilityResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let revenueCents = 0;
  let overrides: TierOverrides = {};

  if (url && serviceKey) {
    const supabase = createSupabaseClient<Database>(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const [{ data: counter }, { data: setting }] = await Promise.all([
      supabase.from("counters").select("value").eq("id", "revenue_total_cents").maybeSingle(),
      supabase.from("site_settings").select("value").eq("key", "tier_overrides").maybeSingle(),
    ]);
    revenueCents = counter?.value ?? 0;
    overrides = (setting?.value as TierOverrides) ?? {};
  } else {
    const supabase = anonClient();
    if (supabase) {
      const { data: setting } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "tier_overrides")
        .maybeSingle();
      overrides = (setting?.value as TierOverrides) ?? {};
    }
  }

  return { availability: computeAvailability(revenueCents, overrides) };
}
