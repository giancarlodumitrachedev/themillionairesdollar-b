"use client";

import { useEffect, useState } from "react";
import type { TierId } from "@/lib/tiers";

/**
 * Tier availability is computed server-side (revenue is not public).
 * The client starts from the server-rendered value and re-checks
 * whenever the tab regains focus.
 */
export function useTierAvailability(initial: Record<TierId, boolean>) {
  const [availability, setAvailability] = useState(initial);

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await fetch("/api/tiers", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { availability: Record<TierId, boolean> };
        setAvailability(data.availability);
      } catch {
        // keep the last known value
      }
    };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  return availability;
}
