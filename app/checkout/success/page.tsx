import type { Metadata } from "next";
import { SuccessContent } from "@/components/checkout/success-content";
import { getDict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Welcome to the Wall",
  robots: { index: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const [locale, params] = await Promise.all([getLocale(), searchParams]);
  const dict = getDict(locale);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-5 py-24 text-center">
      <SuccessContent dict={dict} sessionId={params.session_id ?? null} />
    </main>
  );
}
