"use client";

import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { countryName } from "@/lib/countries";
import type { Dict } from "@/lib/i18n";
import { interpolate } from "@/lib/i18n";
import type { PublicTile } from "@/lib/supabase/database.types";
import { formatDate, formatTileNumber } from "@/lib/utils";

export function TileModal({
  tile,
  onClose,
  dict,
  locale,
}: {
  tile: PublicTile | null;
  onClose: () => void;
  dict: Dict;
  locale: string;
}) {
  return (
    <Modal open={tile !== null} onClose={onClose} labelledBy="tile-modal-title">
      {tile && (
        <div>
          <p className="font-mono text-xs text-tertiary">{formatTileNumber(tile.tile_number)}</p>
          <h2 id="tile-modal-title" className="mt-4 font-display text-3xl font-light text-primary">
            {tile.display_name}
          </h2>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-tertiary">
            {[tile.city, countryName(tile.country_code) ?? tile.country_code]
              .filter(Boolean)
              .join(", ")}
            {tile.year_became_millionaire ? ` — ${tile.year_became_millionaire}` : ""}
          </p>
          {tile.personal_message && (
            <blockquote className="mt-6 border-l border-accent pl-4 font-display text-xl font-light italic text-primary">
              {tile.personal_message}
            </blockquote>
          )}
          {tile.created_at && (
            <p className="mt-6 text-sm text-secondary">
              {interpolate(dict.wall.joined, { date: formatDate(tile.created_at, locale) })}
            </p>
          )}
          {tile.id && (
            <Link href={`/tile/${tile.id}`} className="link-inline mt-6 inline-block text-sm">
              {`${formatTileNumber(tile.tile_number)} →`}
            </Link>
          )}
        </div>
      )}
    </Modal>
  );
}
