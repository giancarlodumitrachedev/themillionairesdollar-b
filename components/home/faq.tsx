import { Accordion } from "@/components/ui/accordion";
import { SectionReveal } from "@/components/site/section-reveal";
import type { Dict } from "@/lib/i18n";

export function Faq({ dict }: { dict: Dict }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[720px] px-5 sm:px-8">
        <SectionReveal>
          <h2 className="font-display text-4xl font-light tracking-[-0.02em] text-primary">
            {dict.faq.title}
          </h2>
        </SectionReveal>
        <SectionReveal delay={0.2}>
          <div className="mt-12">
            <Accordion items={dict.faq.items} />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
