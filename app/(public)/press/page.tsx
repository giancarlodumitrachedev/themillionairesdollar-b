import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getPressCoverage } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Press",
  description: "Coverage of The Millionaire's Dollar.",
};

export default async function PressPage() {
  const locale = await getLocale();
  const dict = getDict(locale);
  const coverage = await getPressCoverage();

  return (
    <div className="container-site pb-32 pt-32 lg:pt-48">
      <p className="eyebrow">{dict.press.eyebrow}</p>
      <h1 className="mt-8 font-display text-4xl font-light tracking-[-0.02em] text-primary sm:text-[3.5rem] sm:leading-[1.05]">
        {dict.press.title}
      </h1>

      {coverage.length === 0 ? (
        <p className="mt-16 max-w-[560px] font-display text-xl font-light italic text-tertiary">
          {locale === "it"
            ? "Ancora niente. I muri interessanti finiscono sempre sui giornali — è solo questione di tempo."
            : "Nothing yet. Interesting walls always end up in the papers — it is only a matter of time."}
        </p>
      ) : (
        <ul className="mt-16 divide-y divide-edge border-y border-edge">
          {coverage.map((item) => (
            <li key={item.id}>
              <a
                href={item.article_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1 py-6"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-tertiary">
                  {item.publication_name}
                  {item.published_at ? ` — ${item.published_at}` : ""}
                </span>
                <span className="font-display text-2xl font-light text-primary transition-colors duration-300 group-hover:text-accent-bright">
                  {item.article_title}
                </span>
                {item.quote && (
                  <span className="mt-1 text-sm italic text-secondary">“{item.quote}”</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
