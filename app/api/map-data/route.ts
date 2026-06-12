import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

/**
 * GeoJSON of all public tiles with coordinates. Coordinates are already
 * jittered ±5km at insert time. Edge-cached for 5 minutes.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ type: "FeatureCollection", features: [] });
  }

  const supabase = createSupabaseClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const features: GeoJSON.Feature[] = [];
  const PAGE = 1000;
  for (let page = 0; page < 60; page++) {
    const { data } = await supabase
      .from("public_tiles")
      .select("tile_number, display_name, country_code, year_became_millionaire, tier, latitude, longitude")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("tile_number", { ascending: true })
      .range(page * PAGE, page * PAGE + PAGE - 1);

    if (!data || data.length === 0) break;
    for (const row of data) {
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [Number(row.longitude), Number(row.latitude)],
        },
        properties: {
          tile_number: row.tile_number,
          name: row.display_name,
          country: row.country_code,
          year: row.year_became_millionaire,
          tier: row.tier,
        },
      });
    }
    if (data.length < PAGE) break;
  }

  return NextResponse.json(
    { type: "FeatureCollection", features },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
