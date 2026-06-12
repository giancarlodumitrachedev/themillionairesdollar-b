"use client";

import { countryName } from "@/lib/countries";
import type { PublicTile } from "@/lib/supabase/database.types";
import { cn, formatTileNumber } from "@/lib/utils";

/**
 * One tile on the Wall. Tier variants (PRD §3.3):
 * existence = standard · verified = gold check · founding = accent border ·
 * permanent = faint gold gradient bg · patron = double border.
 */
export function Tile({
  tile,
  onClick,
  size = "md",
}: {
  tile: PublicTile;
  onClick?: () => void;
  size?: "md" | "lg";
}) {
  const tier = tile.tier ?? "existence";
  const isPatron = tier === "patron" || tier === "curators_circle";
  const name = tile.display_name ?? "—";
  const isInitials = tile.display_as === "initials" || name.length <= 8;

  const inner = (
    <span
      className={cn(
        "flex h-full w-full flex-col justify-between rounded-sm border p-3 text-left transition-all duration-300 sm:p-4",
        tier === "founding" || isPatron ? "border-accent" : "border-edge",
        tier === "permanent" ? "tile-permanent" : "bg-bg-elevated",
        onClick && "group-hover:border-accent group-hover:bg-bg-overlay"
      )}
    >
      <span className="flex items-start justify-between">
        <span className="font-mono text-[10px] text-tertiary">
          {formatTileNumber(tile.tile_number)}
        </span>
        {tier === "verified" && (
          <span aria-label="Verified" title="Verified" className="font-mono text-[10px] text-accent-bright">
            ✓
          </span>
        )}
      </span>
      <span
        className={cn(
          "block truncate font-display font-normal leading-none text-primary",
          isInitials
            ? size === "lg"
              ? "text-4xl"
              : "text-xl sm:text-[1.75rem]"
            : size === "lg"
              ? "text-2xl"
              : "text-sm sm:text-base"
        )}
      >
        {name}
      </span>
      <span className="block">
        <span className="block truncate font-mono text-[9px] uppercase tracking-[0.05em] text-tertiary">
          {[tile.city, countryName(tile.country_code) ?? tile.country_code]
            .filter(Boolean)
            .join(", ")}
        </span>
        {tile.year_became_millionaire && (
          <span className="block font-mono text-[9px] text-tertiary">
            {tile.year_became_millionaire}
          </span>
        )}
      </span>
    </span>
  );

  const wrapperClass = cn(
    "group block aspect-square w-full rounded-sm",
    isPatron && "border border-accent p-0.5",
    onClick && "cursor-pointer transition-transform duration-300 hover:scale-105 motion-reduce:hover:scale-100"
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={wrapperClass}
        aria-label={`${formatTileNumber(tile.tile_number)} — ${name}`}
      >
        {inner}
      </button>
    );
  }
  return <div className={wrapperClass}>{inner}</div>;
}
