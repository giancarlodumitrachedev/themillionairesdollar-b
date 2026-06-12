import { CookieBanner } from "@/components/site/cookie-banner";
import { SiteFooter } from "@/components/site/footer";
import { TopBar } from "@/components/site/top-bar";
import { getDict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dict = getDict(locale);

  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <TopBar dict={dict} locale={locale} />
      <main id="content">{children}</main>
      <SiteFooter dict={dict} locale={locale} />
      <CookieBanner dict={dict} />
    </>
  );
}
