import { countryName } from "@/lib/countries";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Admin — Analytics", robots: { index: false } };

export default async function AdminAnalyticsPage() {
  const supabase = createAdminClient();

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [{ data: stats }, { data: recent }] = await Promise.all([
    supabase.from("public_stats").select("*").single(),
    supabase
      .from("participants")
      .select("created_at")
      .gte("created_at", since)
      .eq("is_public", true),
  ]);

  // Daily buckets, oldest → newest.
  const days: { label: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    days.push({ label: d.toISOString().slice(0, 10), count: 0 });
  }
  const index = new Map(days.map((d, i) => [d.label, i]));
  for (const row of recent ?? []) {
    const key = row.created_at.slice(0, 10);
    const i = index.get(key);
    if (i !== undefined) days[i]!.count += 1;
  }
  const max = Math.max(1, ...days.map((d) => d.count));

  const byCountry = Object.entries(
    (stats?.by_country as Record<string, number> | null) ?? {}
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-primary">Analytics</h1>

      <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ["Total", stats?.total_participants ?? 0],
          ["Last 24h", stats?.last_24h ?? 0],
          ["Last week", stats?.last_week ?? 0],
          ["Countries", stats?.countries ?? 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded-sm border border-edge bg-bg-elevated p-5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-tertiary">
              {label}
            </dt>
            <dd className="mt-2 font-display text-3xl font-light text-primary">{value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-tertiary">
        Growth — last 30 days
      </h2>
      <svg
        viewBox="0 0 600 120"
        className="mt-4 w-full rounded-sm border border-edge bg-bg-elevated p-2"
        role="img"
        aria-label="Daily new participants over the last 30 days"
      >
        {days.map((d, i) => {
          const h = (d.count / max) * 100;
          return (
            <rect
              key={d.label}
              x={i * 20 + 4}
              y={110 - h}
              width={12}
              height={Math.max(1, h)}
              fill={d.count > 0 ? "#8b7355" : "#2a2a2a"}
            >
              <title>{`${d.label}: ${d.count}`}</title>
            </rect>
          );
        })}
      </svg>

      <h2 className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-tertiary">
        By country
      </h2>
      <ul className="mt-4 max-w-md space-y-1">
        {byCountry.length === 0 && (
          <li className="font-display text-lg font-light italic text-tertiary">No data yet.</li>
        )}
        {byCountry.map(([code, count]) => (
          <li key={code} className="flex items-center justify-between border-b border-edge py-2 text-sm">
            <span className="text-secondary">{countryName(code) ?? code}</span>
            <span className="font-mono text-xs text-primary">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
