"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SectionReveal } from "@/components/site/section-reveal";
import type { Dict } from "@/lib/i18n";

const WorldMap = dynamic(() => import("@/components/map/world-map").then((m) => m.WorldMap), {
  ssr: false,
  loading: () => <div className="skeleton aspect-[4/3] w-full sm:aspect-video" aria-hidden="true" />,
});

/** Mapbox SDK loads only once this section approaches the viewport (PRD §3.4 performance). */
export function MapPreview({ dict }: { dict: Dict }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24" ref={ref}>
      <div className="container-site">
        <SectionReveal>
          <p className="eyebrow">{dict.map.eyebrow}</p>
          <h2 className="mt-8 font-display text-4xl font-light tracking-[-0.02em] text-primary sm:text-[3.5rem] sm:leading-[1.05]">
            {dict.map.title}
          </h2>
          <p className="mt-4 text-base text-secondary">{dict.map.subtitle}</p>
        </SectionReveal>

        <div className="mt-12">
          {visible ? (
            <WorldMap dict={dict} variant="preview" />
          ) : (
            <div className="skeleton aspect-[4/3] w-full sm:aspect-video" aria-hidden="true" />
          )}
        </div>

        <div className="mt-12">
          <Link href="/map" className="link-inline text-sm">
            {dict.map.explore}
          </Link>
        </div>
      </div>
    </section>
  );
}
