import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export default async function NotFound() {
  const locale = await getLocale();
  const dict = getDict(locale);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <h1 className="font-display text-4xl font-light italic tracking-[-0.02em] text-primary">
        {dict.notFound.title}
      </h1>
      <p className="mt-6 max-w-md text-base leading-[1.7] text-secondary">{dict.notFound.body}</p>
      <Link href="/" className="link-inline mt-12 text-sm">
        {dict.notFound.back}
      </Link>
    </main>
  );
}
