"use client";

import Link from "next/link";
import { SectionReveal } from "@/components/site/section-reveal";
import { useTierAvailability } from "@/hooks/use-tier-availability";
import type { Dict } from "@/lib/i18n";
import { TIERS, TIER_ORDER, formatEuro, type TierId } from "@/lib/tiers";

export function Tiers({
  dict,
  initialAvailability,
}: {
  dict: Dict;
  initialAvailability: Record<TierId, boolean>;
}) {
  const availability = useTierAvailability(initialAvailability);
  const visible = TIER_ORDER.filter((id) => availability[id]);

  return (
    <section className="py-24 lg:py-48">
      <div className="container-site">
        <SectionReveal>
          <p className="eyebrow">{dict.tiers.eyebrow}</p>
          <h2 className="mt-8 font-display text-4xl font-light tracking-[-0.02em] text-primary sm:text-[3.5rem] sm:leading-[1.05]">
            {dict.tiers.title}
          </h2>
          <p className="mt-4 text-base text-secondary">{dict.tiers.subtitle}</p>
        </SectionReveal>

        <div role="list" className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visible.map((id, i) => {
            const tier = TIERS[id];
            return (
              <SectionReveal key={id} delay={0.1 * i} className="h-full">
                <div
                  role="listitem"
                  className="group flex h-full min-h-[480px] flex-col rounded-sm border border-edge bg-bg-elevated p-8 transition-colors duration-300 hover:border-accent hover:bg-bg-overlay"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-tertiary">
                    {dict.tiers.names[id]}
                  </p>
                  <p className="mt-6 font-display text-5xl font-light tracking-[-0.03em] text-primary lg:text-[4rem] lg:leading-none">
                    {formatEuro(tier.amountCents, { compact: true })}
                  </p>
                  <p className="mt-6 flex-1 text-sm leading-[1.6] text-secondary">
                    {dict.tiers.descriptions[id]}
                  </p>
                  <Link
                    href={`/participate?tier=${id}`}
                    className="mt-8 inline-flex w-full items-center justify-center rounded-sm border border-primary bg-bg px-8 py-4 font-body text-sm font-medium uppercase tracking-[0.1em] text-primary transition-colors duration-300 hover:bg-primary hover:text-bg"
                  >
                    {dict.tiers.cta}
                  </Link>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
