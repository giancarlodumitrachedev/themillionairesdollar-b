import type { Metadata } from "next";
import { TileGrid } from "@/components/wall/tile-grid";
import { getDict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getPublicStats } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "The Wall",
  description: "Every tile is a person who declared they exist.",
};

export default async function WallPage() {
  const locale = await getLocale();
  const dict = getDict(locale);
  const stats = await getPublicStats();

  const countries = Object.keys(
    (stats.by_country as Record<string, number> | null) ?? {}
  ).sort();

  return (
    <TileGrid
      dict={dict}
      locale={locale}
      initialCount={stats.total_participants ?? 0}
      countries={countries}
    />
  );
}
