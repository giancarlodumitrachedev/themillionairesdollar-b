import { Curators } from "@/components/home/curators";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { MapPreview } from "@/components/home/map-preview";
import { Press } from "@/components/home/press";
import { Question } from "@/components/home/question";
import { Tiers } from "@/components/home/tiers";
import { WallPreview } from "@/components/home/wall-preview";
import { getDict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import {
  getPressCoverage,
  getPublicStats,
  getTierAvailability,
  getTilesPreview,
} from "@/lib/public-data";

export default async function HomePage() {
  const locale = await getLocale();
  const dict = getDict(locale);

  const [stats, tiles, press, { availability }] = await Promise.all([
    getPublicStats(),
    getTilesPreview(50),
    getPressCoverage(),
    getTierAvailability(),
  ]);

  const total = stats.total_participants ?? 0;

  return (
    <>
      <Hero initialCount={total} dict={dict} locale={locale} />
      <Question dict={dict} />
      <WallPreview initialTiles={tiles} totalCount={total} dict={dict} locale={locale} />
      <MapPreview dict={dict} />
      <Tiers dict={dict} initialAvailability={availability} />
      <Curators dict={dict} />
      <Press dict={dict} coverage={press} />
      <Faq dict={dict} />
    </>
  );
}
