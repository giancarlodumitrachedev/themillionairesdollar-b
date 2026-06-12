import type { Metadata } from "next";
import { ParticipateFlow } from "@/components/participate/participate-flow";
import { getDict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getTierAvailability } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Add yourself",
  description: "Choose a tier and take your place on the Wall.",
};

export default async function ParticipatePage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const [locale, { availability }, params] = await Promise.all([
    getLocale(),
    getTierAvailability(),
    searchParams,
  ]);
  const dict = getDict(locale);

  return (
    <div className="pt-32 lg:pt-48">
      <div className="container-site pb-16">
        <h1 className="font-display text-[2.5rem] font-light leading-[1.05] tracking-[-0.03em] text-primary sm:text-[3.25rem]">
          {dict.participate.title}
        </h1>
        <p className="mt-4 max-w-[560px] text-base text-secondary sm:text-lg">
          {dict.participate.intro}
        </p>
      </div>
      <ParticipateFlow
        dict={dict}
        availability={availability}
        preselectedTier={params.tier ?? null}
      />
    </div>
  );
}
