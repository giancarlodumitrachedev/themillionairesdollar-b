import type { Metadata } from "next";
import { FullMap } from "@/components/map/full-map";
import { getDict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getPublicStats } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "The Map",
  description: "Where existence has been declared, in real time.",
};

export default async function MapPage() {
  const locale = await getLocale();
  const dict = getDict(locale);
  const stats = await getPublicStats();

  return (
    <FullMap dict={dict} locale={locale} initialCount={stats.total_participants ?? 0} />
  );
}
