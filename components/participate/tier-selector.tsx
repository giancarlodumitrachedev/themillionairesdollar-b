"use client";

import type { Dict } from "@/lib/i18n";
import { TIERS, TIER_ORDER, formatEuro, type TierId } from "@/lib/tiers";
import { cn } from "@/lib/utils";

export function TierSelector({
  dict,
  availability,
  selected,
  onSelect,
}: {
  dict: Dict;
  availability: Record<TierId, boolean>;
  selected: TierId | null;
  onSelect: (id: TierId) => void;
}) {
  const visible = TIER_ORDER.filter((id) => availability[id]);

  return (
    <div role="radiogroup" aria-label={dict.participate.step1} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {visible.map((id) => {
        const active = selected === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(id)}
            className={cn(
              "flex flex-col rounded-sm border bg-bg-elevated p-8 text-left transition-colors duration-300",
              active ? "border-accent-bright bg-bg-overlay" : "border-edge hover:border-accent"
            )}
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-tertiary">
              {dict.tiers.names[id]}
            </span>
            <span className="mt-4 font-display text-4xl font-light tracking-[-0.03em] text-primary">
              {formatEuro(TIERS[id].amountCents, { compact: true })}
            </span>
            <span className="mt-4 text-sm leading-[1.6] text-secondary">
              {dict.tiers.descriptions[id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
