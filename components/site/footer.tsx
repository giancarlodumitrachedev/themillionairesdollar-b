import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";
import { LanguageToggle } from "./language-toggle";
import { NewsletterForm } from "./newsletter-form";

export function SiteFooter({ dict, locale }: { dict: Dict; locale: Locale }) {
  return (
    <footer className="border-t border-edge pb-12 pt-24">
      <div className="container-site">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <p className="font-display text-2xl text-primary">M.D.</p>
            <p className="mt-2 text-sm text-secondary">{dict.footer.brandLine}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-tertiary">
              {dict.footer.byline}
            </p>
          </div>

          <nav aria-label={dict.footer.explore}>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-tertiary">
              {dict.footer.explore}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/wall" className="text-secondary transition-colors duration-300 hover:text-primary">{dict.nav.wall}</Link></li>
              <li><Link href="/map" className="text-secondary transition-colors duration-300 hover:text-primary">{dict.nav.map}</Link></li>
              <li><Link href="/manifesto" className="text-secondary transition-colors duration-300 hover:text-primary">{dict.nav.manifesto}</Link></li>
              <li><Link href="/press" className="text-secondary transition-colors duration-300 hover:text-primary">{dict.nav.press}</Link></li>
            </ul>
          </nav>

          <nav aria-label={dict.footer.legal}>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-tertiary">
              {dict.footer.legal}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/privacy" className="text-secondary transition-colors duration-300 hover:text-primary">{dict.footer.privacy}</Link></li>
              <li><Link href="/terms" className="text-secondary transition-colors duration-300 hover:text-primary">{dict.footer.terms}</Link></li>
              <li>
                <a href="mailto:curators@themillionairesdollar.com" className="text-secondary transition-colors duration-300 hover:text-primary">
                  {dict.footer.contact}
                </a>
              </li>
            </ul>
          </nav>

          <div id="newsletter" className="col-span-2 scroll-mt-24 lg:col-span-1">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-tertiary">
              {dict.footer.newsletter}
            </h2>
            <NewsletterForm dict={dict} source="footer" />
            <p className="mt-2 text-xs text-tertiary">{dict.footer.newsletterNote}</p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-edge pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-tertiary">
            {dict.footer.copyright}
          </p>
          <LanguageToggle locale={locale} />
        </div>
      </div>
    </footer>
  );
}
