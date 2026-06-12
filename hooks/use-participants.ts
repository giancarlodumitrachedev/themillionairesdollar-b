"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PublicTile } from "@/lib/supabase/database.types";
import type { TierId } from "@/lib/tiers";

export interface WallFilters {
  country: string | null;
  tiers: TierId[];
  yearFrom: number | null;
  yearTo: number | null;
  order: "newest" | "oldest" | "random";
}

export const DEFAULT_FILTERS: WallFilters = {
  country: null,
  tiers: [],
  yearFrom: null,
  yearTo: null,
  order: "newest",
};

const PAGE_SIZE = 200;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/**
 * Paginated wall feed against the public_tiles view, with filters,
 * infinite loading and live prepend of new tiles (driven by counter updates).
 */
export function useParticipants(filters: WallFilters, initial: PublicTile[] = []) {
  const [tiles, setTiles] = useState<PublicTile[]>(initial);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const pageRef = useRef(0);
  const filtersRef = useRef(filters);
  const requestSeq = useRef(0);

  const fetchPage = useCallback(async (f: WallFilters, page: number): Promise<PublicTile[]> => {
    // Misconfigured environment (missing NEXT_PUBLIC_SUPABASE_*) → empty wall, no crash.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return [];
    }
    const supabase = createClient();
    let query = supabase.from("public_tiles").select("*");

    if (f.country) query = query.eq("country_code", f.country);
    if (f.tiers.length > 0) query = query.in("tier", f.tiers);
    if (f.yearFrom != null) query = query.gte("year_became_millionaire", f.yearFrom);
    if (f.yearTo != null) query = query.lte("year_became_millionaire", f.yearTo);

    if (f.order === "oldest") {
      query = query.order("tile_number", { ascending: true });
    } else if (f.order === "random") {
      // Stable pagination, shuffled per page client-side.
      query = query.order("id", { ascending: true });
    } else {
      query = query.order("tile_number", { ascending: false });
    }

    const from = page * PAGE_SIZE;
    const { data } = await query.range(from, from + PAGE_SIZE - 1);
    const rows = data ?? [];
    return f.order === "random" ? shuffle(rows) : rows;
  }, []);

  // Reset and reload when filters change.
  useEffect(() => {
    filtersRef.current = filters;
    pageRef.current = 0;
    setDone(false);
    setLoading(true);
    const seq = ++requestSeq.current;
    fetchPage(filters, 0).then((rows) => {
      if (seq !== requestSeq.current) return;
      setTiles(rows);
      setDone(rows.length < PAGE_SIZE);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.country,
    filters.order,
    filters.yearFrom,
    filters.yearTo,
    filters.tiers.join(","),
    fetchPage,
  ]);

  const loadMore = useCallback(() => {
    if (loading || done) return;
    setLoading(true);
    const nextPage = pageRef.current + 1;
    const seq = ++requestSeq.current;
    fetchPage(filtersRef.current, nextPage).then((rows) => {
      if (seq !== requestSeq.current) return;
      pageRef.current = nextPage;
      setTiles((prev) => {
        const seen = new Set(prev.map((t) => t.id));
        return [...prev, ...rows.filter((r) => !seen.has(r.id))];
      });
      setDone(rows.length < PAGE_SIZE);
      setLoading(false);
    });
  }, [loading, done, fetchPage]);

  // Live: when the public counter moves, pull the newest tile and prepend it.
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    const channel = supabase
      .channel("wall-feed")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "counters", filter: "id=eq.participants_total" },
        async () => {
          if (filtersRef.current.order !== "newest") return;
          const { data } = await supabase
            .from("public_tiles")
            .select("*")
            .order("tile_number", { ascending: false })
            .limit(1);
          const newest = data?.[0];
          if (!newest) return;
          setTiles((prev) =>
            prev.some((t) => t.id === newest.id) ? prev : [newest, ...prev]
          );
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { tiles, loading, done, loadMore };
}
