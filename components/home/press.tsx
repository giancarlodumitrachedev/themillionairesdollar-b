import { SectionReveal } from "@/components/site/section-reveal";
import type { Dict } from "@/lib/i18n";
import type { PressCoverage } from "@/lib/supabase/database.types";

/** Rendered only when coverage exists (PRD §3.7) — the page omits it otherwise. */
export function Press({ dict, coverage }: { dict: Dict; coverage: PressCoverage[] }) {
  if (coverage.length === 0) return null;

  const quotes = coverage.filter((c) => c.is_featured && c.quote).slice(0, 3);

  return (
    <section className="py-24">
      <div className="container-site">
        <SectionReveal>
          <p className="eyebrow">{dict.press.eyebrow}</p>
          <h2 className="mt-8 font-display text-4xl font-light tracking-[-0.02em] text-primary sm:text-[3.5rem] sm:leading-[1.05]">
            {dict.press.title}
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="mt-16 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] items-center gap-16 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
            {coverage.map((item) => (
              <a
                key={item.id}
                href={item.article_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                aria-label={`${item.publication_name}: ${item.article_title}`}
              >
                {item.publication_logo_url ? (
                  // Arbitrary external hosts → plain img, monochrome treatment.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.publication_logo_url}
                    alt={item.publication_name}
                    className="max-h-10 w-auto brightness-75 grayscale transition-[filter] duration-300 hover:brightness-100"
                    loading="lazy"
                  />
                ) : (
                  <span className="font-display text-2xl font-light text-secondary transition-colors duration-300 hover:text-primary">
                    {item.publication_name}
                  </span>
                )}
              </a>
            ))}
          </div>
        </SectionReveal>

        {quotes.length > 0 && (
          <div className="mt-24 space-y-16">
            {quotes.map((item) => (
              <SectionReveal key={item.id}>
                <figure className="mx-auto max-w-[600px] text-center">
                  <blockquote className="font-display text-[1.75rem] font-light italic leading-[1.3] text-primary">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-tertiary">
                    {item.publication_name}
                  </figcaption>
                </figure>
              </SectionReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
