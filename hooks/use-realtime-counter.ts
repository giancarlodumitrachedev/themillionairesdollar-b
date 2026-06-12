"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Live participant counter: starts from the server-rendered value and
 * subscribes to UPDATEs on counters.participants_total via Supabase Realtime.
 * `flash` flips to true for 300ms whenever the value increases.
 */
export function useRealtimeCounter(initial: number) {
  const [count, setCount] = useState(initial);
  const [flash, setFlash] = useState(false);
  const prev = useRef(initial);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    const channel = supabase
      .channel("public-counter")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "counters",
          filter: "id=eq.participants_total",
        },
        (payload) => {
          const next = Number((payload.new as { value?: number }).value ?? 0);
          if (next > prev.current) {
            setFlash(true);
            setTimeout(() => setFlash(false), 300);
          }
          prev.current = next;
          setCount(next);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { count, flash };
}
