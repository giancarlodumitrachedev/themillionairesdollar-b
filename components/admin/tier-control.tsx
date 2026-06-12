"use client";

import { useTransition } from "react";
import { setTierOverride } from "@/app/(admin)/admin/(dashboard)/actions";
import type { TierId, TierOverride } from "@/lib/tiers";

const OPTIONS: TierOverride[] = ["auto", "enabled", "disabled"];

export function TierControl({ tier, current }: { tier: TierId; current: TierOverride }) {
  const [pending, startTransition] = useTransition();

  return (
    <div role="radiogroup" aria-label={`${tier} override`} className="flex gap-1.5">
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={current === option}
          disabled={pending || current === option}
          onClick={() => startTransition(() => setTierOverride(tier, option))}
          className={`rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors duration-200 disabled:cursor-default ${
            current === option
              ? "border-accent text-accent-bright"
              : "border-edge text-tertiary hover:text-secondary"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
