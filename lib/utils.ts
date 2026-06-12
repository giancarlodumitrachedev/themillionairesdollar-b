/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** "#01247" — tile numbers padded to five digits, mono-friendly. */
export function formatTileNumber(n: number | null | undefined): string {
  if (n == null) return "#—";
  return `#${String(n).padStart(5, "0")}`;
}

/** "Ada Lovelace" → "A.L." */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  return parts.map((p) => p[0]!.toUpperCase()).join(".") + ".";
}

export function formatCount(n: number, locale: string): string {
  return n.toLocaleString(locale === "it" ? "it-IT" : "en-IE");
}

export function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === "it" ? "it-IT" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_URL ?? "https://themillionairesdollar.com";
}
