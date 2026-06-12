import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { Tile } from "@/components/wall/tile";
import { countryName } from "@/lib/countries";
import { getDict, interpolate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getTileById } from "@/lib/public-data";
import { formatDate, formatTileNumber } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tile = await getTileById(id);
  if (!tile) return { title: "Tile not found" };

  const n = formatTileNumber(tile.tile_number);
  return {
    title: `${n} — ${tile.display_name}`,
    description: `${tile.display_name} declared they exist. Tile ${n} on the Wall.`,
    openGraph: {
      title: `${n} — The Millionaire's Dollar`,
      description: `${tile.display_name} declared they exist.`,
    },
  };
}

export default async function TilePage({ params }: Props) {
  const { id } = await params;
  const [locale, tile] = await Promise.all([getLocale(), getTileById(id)]);
  const dict = getDict(locale);

  if (!tile) notFound();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-5 py-32">
      <div className="w-full max-w-[400px]">
        <Tile tile={tile} size="lg" />
      </div>

      <div className="mt-12 text-center">
        <p className="font-mono text-xs text-tertiary">{formatTileNumber(tile.tile_number)}</p>
        <h1 className="mt-3 font-display text-4xl font-light tracking-[-0.02em] text-primary">
          {tile.display_name}
        </h1>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-tertiary">
          {[tile.city, countryName(tile.country_code) ?? tile.country_code]
            .filter(Boolean)
            .join(", ")}
          {tile.year_became_millionaire ? ` — ${tile.year_became_millionaire}` : ""}
        </p>
        {tile.personal_message && (
          <blockquote className="mx-auto mt-8 max-w-sm font-display text-2xl font-light italic leading-[1.3] text-primary">
            “{tile.personal_message}”
          </blockquote>
        )}
        {tile.created_at && (
          <p className="mt-8 text-sm text-secondary">
            {interpolate(dict.tile.joined, { date: formatDate(tile.created_at, locale) })}
          </p>
        )}
        <div className="mt-12">
          <ButtonLink href="/participate">{dict.tile.cta}</ButtonLink>
        </div>
      </div>
    </div>
  );
}
