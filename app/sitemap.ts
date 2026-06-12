import type { MetadataRoute } from "next";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/wall`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/map`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/participate`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/manifesto`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/press`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return staticPages;

  try {
    const supabase = createSupabaseClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data } = await supabase
      .from("public_tiles")
      .select("id, created_at")
      .order("tile_number", { ascending: false })
      .limit(5000);

    const tilePages: MetadataRoute.Sitemap = (data ?? []).map((tile) => ({
      url: `${base}/tile/${tile.id}`,
      lastModified: tile.created_at ?? undefined,
      changeFrequency: "yearly",
      priority: 0.4,
    }));
    return [...staticPages, ...tilePages];
  } catch {
    return staticPages;
  }
}
