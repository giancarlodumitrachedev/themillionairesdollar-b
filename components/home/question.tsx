import { SectionReveal } from "@/components/site/section-reveal";
import type { Dict } from "@/lib/i18n";

export function Question({ dict }: { dict: Dict }) {
  return (
    <section className="py-24 lg:py-48">
      <div className="mx-auto max-w-[720px] px-5 sm:px-8">
        <SectionReveal>
          <h2 className="font-display text-[2rem] font-normal italic leading-[1.15] tracking-[-0.02em] text-primary sm:text-[3rem]">
            {dict.question.title}
          </h2>
        </SectionReveal>
        <div className="mt-16 space-y-6">
          {[dict.question.p1, dict.question.p2, dict.question.p3].map((p, i) => (
            <SectionReveal key={i} delay={0.2 * (i + 1)}>
              <p className="text-base leading-[1.7] text-secondary sm:text-lg">{p}</p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
