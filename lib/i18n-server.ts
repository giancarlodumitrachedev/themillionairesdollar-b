import { cookies, headers } from "next/headers";
import type { Locale } from "./i18n";

/** Locale negotiation: explicit cookie first, then Accept-Language (it → it, everything else → en). */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("lang")?.value;
  if (cookieLang === "it" || cookieLang === "en") return cookieLang;

  const headerStore = await headers();
  const accept = headerStore.get("accept-language") ?? "";
  return /^it\b|,\s*it\b/i.test(accept) ? "it" : "en";
}
