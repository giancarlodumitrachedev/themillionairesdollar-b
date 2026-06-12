"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SectionReveal } from "@/components/site/section-reveal";
import { Tile } from "@/components/wall/tile";
import { TileModal } from "@/components/wall/tile-modal";
import { createClient } from "@/lib/supabase/client";
import type { Dict, Locale } from "@/lib/i18n";
import { interpolate } from "@/lib/i18n";
import type { PublicTile } from "@/lib/supabase/database.types";
import { formatCount } from "@/lib/utils";

export function WallPreview({
  initialTiles,
  totalCount,
  dict,
  locale,
}: {
  initialTiles: PublicTile[];
  totalCount: number;
  dict: Dict;
  locale: Locale;
}) {
  const [tiles, setTiles] = useState(initialTiles);
  const [selected, setSelected] = useState<PublicTile | null>(null);
  const reduced = useReducedMotion();

  // New paying participant → prepend their tile with a scale-in (PRD §7.5).
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    const channel = supabase
      .channel("wall-preview")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "counters", filter: "id=eq.participants_total" },
        async () => {
          const { data } = await supabase
            .from("public_tiles")
            .select("*")
            .order("tile_number", { ascending: false })
            .limit(1);
          const newest = data?.[0];
          if (!newest) return;
          setTiles((prev) =>
            prev.some((t) => t.id === newest.id) ? prev : [newest, ...prev.slice(0, 49)]
          );
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="py-24">
      <div className="container-site">
        <SectionReveal>
          <p className="eyebrow">{dict.wall.eyebrow}</p>
          <h2 className="mt-8 font-display text-4xl font-light tracking-[-0.02em] text-primary sm:text-[3.5rem] sm:leading-[1.05]">
            {dict.wall.title}
          </h2>
          <p className="mt-4 text-base text-secondary">{dict.wall.subtitle}</p>
        </SectionReveal>
      </div>

      <div className="mt-12 px-1 sm:px-2">
        {tiles.length === 0 ? (
          <p className="container-site py-16 text-center font-display text-xl font-light italic text-tertiary">
            {dict.wall.empty}
          </p>
        ) : (
          <ul
            className="grid gap-1 sm:gap-1.5 lg:gap-2"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100px, 30vw), 1fr))" }}
          >
            {tiles.map((tile, i) => (
              <motion.li
                key={tile.id}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduced ? 0 : 0.6, delay: Math.min(i * 0.015, 0.5) }}
                className="list-none"
              >
                <Tile tile={tile} onClick={() => setSelected(tile)} />
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      <div className="container-site mt-12">
        <Link href="/wall" className="link-inline text-sm">
          {interpolate(dict.wall.viewAll, { count: formatCount(totalCount, locale) })}
        </Link>
      </div>

      <TileModal tile={selected} onClose={() => setSelected(null)} dict={dict} locale={locale} />
    </section>
  );
}
