import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { getDict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Payment cancelled",
  robots: { index: false },
};

export default async function CheckoutCancelledPage() {
  const locale = await getLocale();
  const dict = getDict(locale);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <h1 className="font-display text-4xl font-light italic tracking-[-0.02em] text-primary">
        {dict.checkout.cancelledTitle}
      </h1>
      <p className="mt-6 max-w-md text-base leading-[1.7] text-secondary">
        {dict.checkout.cancelledBody}
      </p>
      <div className="mt-12 flex flex-col items-center gap-4">
        <ButtonLink href="/participate">{dict.checkout.tryAgain}</ButtonLink>
        <Link href="/" className="link-inline text-sm">
          {dict.checkout.backHome}
        </Link>
      </div>
    </main>
  );
}
