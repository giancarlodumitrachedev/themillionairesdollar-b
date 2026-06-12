"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export function LanguageToggle({ locale, label }: { locale: Locale; label?: string }) {
  const router = useRouter();

  const setLocale = (next: Locale) => {
    document.cookie = `lang=${next};path=/;max-age=31536000;samesite=lax`;
    router.refresh();
  };

  return (
    <div className="flex items-center gap-4">
      {label && (
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-tertiary">
          {label}
        </span>
      )}
      {(["it", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
            locale === l ? "text-primary" : "text-tertiary hover:text-secondary"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
