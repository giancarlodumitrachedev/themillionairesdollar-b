"use client";

import dynamic from "next/dynamic";
import { useRealtimeCounter } from "@/hooks/use-realtime-counter";
import type { Dict, Locale } from "@/lib/i18n";
import { formatCount } from "@/lib/utils";

const WorldMap = dynamic(() => import("@/components/map/world-map").then((m) => m.WorldMap), {
  ssr: false,
  loading: () => <div className="skeleton h-full w-full" aria-hidden="true" />,
});

export function FullMap({
  dict,
  locale,
  initialCount,
}: {
  dict: Dict;
  locale: Locale;
  initialCount: number;
}) {
  const { count } = useRealtimeCounter(initialCount);

  return (
    <div className="relative h-svh w-full pt-16 sm:pt-20">
      <div className="absolute inset-x-0 top-16 z-10 flex justify-center sm:top-20">
        <p className="mt-3 bg-bg/80 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-secondary">
          {formatCount(count, locale)} {dict.map.declarations}
        </p>
      </div>
      <WorldMap dict={dict} variant="full" />
    </div>
  );
}
