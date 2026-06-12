import Link from "next/link";
import { SectionReveal } from "@/components/site/section-reveal";
import type { Dict } from "@/lib/i18n";

export function Curators({ dict }: { dict: Dict }) {
  return (
    <section className="py-24 lg:py-48">
      <div className="mx-auto max-w-[720px] px-5 text-center sm:px-8">
        <SectionReveal>
          <p className="eyebrow">{dict.curators.eyebrow}</p>
          <h2 className="mt-8 font-display text-[1.75rem] font-light leading-[1.15] tracking-[-0.02em] text-primary sm:text-4xl">
            {dict.curators.title}
          </h2>
        </SectionReveal>
        <div className="mt-12 space-y-6 text-left">
          {[dict.curators.p1, dict.curators.p2, dict.curators.p3, dict.curators.p4].map((p, i) => (
            <SectionReveal key={i} delay={0.15 * i}>
              <p className="text-base leading-[1.7] text-secondary sm:text-lg">{p}</p>
            </SectionReveal>
          ))}
        </div>
        <SectionReveal delay={0.5}>
          <Link href="/manifesto" className="link-inline mt-12 inline-block text-sm">
            {dict.curators.readMore}
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}
