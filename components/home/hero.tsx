"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRealtimeCounter } from "@/hooks/use-realtime-counter";
import type { Dict, Locale } from "@/lib/i18n";
import { formatCount } from "@/lib/utils";

function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/** Hero counter: counts 0 → value in 2000ms on mount, then tracks realtime updates. */
export function Hero({ initialCount, dict, locale }: { initialCount: number; dict: Dict; locale: Locale }) {
  const { count, flash } = useRealtimeCounter(initialCount);
  const reduced = useReducedMotion();
  const [displayed, setDisplayed] = useState(reduced ? count : 0);
  const animatedOnce = useRef(false);

  useEffect(() => {
    if (reduced) {
      setDisplayed(count);
      return;
    }
    if (!animatedOnce.current) {
      animatedOnce.current = true;
      const target = count;
      const start = performance.now();
      const duration = 2000;
      let raf = 0;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setDisplayed(Math.round(easeOutExpo(t) * target));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }
    setDisplayed(count);
  }, [count, reduced]);

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center bg-bg px-5 pt-20 sm:pt-20">
      <div className="flex flex-col items-center text-center">
        <p
          aria-live="polite"
          className={`font-display text-[6rem] font-light leading-[0.95] tracking-[-0.03em] lining-nums transition-colors duration-300 sm:text-[8rem] lg:text-[12rem] ${
            flash ? "text-accent-bright" : "text-primary"
          }`}
        >
          {formatCount(displayed, locale)}
        </p>
        <p className="mt-6 font-body text-xs font-medium uppercase tracking-[0.2em] text-secondary sm:text-sm">
          {dict.hero.label}
        </p>

        <div className="mt-12 sm:mt-20">
          <p className="font-display text-lg font-light italic text-primary sm:text-2xl">
            {dict.hero.subline1}
          </p>
          <p className="mt-2 font-display text-lg font-light italic text-secondary sm:text-2xl">
            {dict.hero.subline2}
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="scroll-indicator-line" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-tertiary">
          {dict.hero.scroll}
        </span>
      </div>
    </section>
  );
}
