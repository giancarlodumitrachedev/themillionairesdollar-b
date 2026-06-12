import { createAdminClient } from "@/lib/supabase/admin";
import { TIER_ORDER, formatEuro } from "@/lib/tiers";
import { formatTileNumber } from "@/lib/utils";

export const metadata = { title: "Admin — Overview", robots: { index: false } };

export default async function AdminOverviewPage() {
  const supabase = createAdminClient();

  const [counters, tierCounts, recent] = await Promise.all([
    supabase.from("counters").select("id, value"),
    Promise.all(
      TIER_ORDER.map(async (tier) => {
        const { count } = await supabase
          .from("participants")
          .select("id", { count: "exact", head: true })
          .eq("tier", tier)
          .eq("is_public", true);
        return { tier, count: count ?? 0 };
      })
    ),
    supabase
      .from("participants")
      .select("id, tile_number, display_name, tier, amount_paid_cents, country_code, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const counterMap = new Map((counters.data ?? []).map((c) => [c.id, c.value]));
  const total = counterMap.get("participants_total") ?? 0;
  const revenue = counterMap.get("revenue_total_cents") ?? 0;

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-primary">Overview</h1>

      <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ["Participants", String(total)],
          ["Revenue", formatEuro(revenue)],
          ...tierCounts
            .filter((t) => t.count > 0)
            .map((t) => [t.tier, String(t.count)] as [string, string]),
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
        Latest participants
      </h2>
      <div className="mt-4 overflow-x-auto rounded-sm border border-edge">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-edge font-mono text-[10px] uppercase tracking-[0.15em] text-tertiary">
              <th className="px-4 py-3">Tile</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge">
            {(recent.data ?? []).map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-mono text-xs text-tertiary">
                  {formatTileNumber(p.tile_number)}
                </td>
                <td className="px-4 py-3 text-primary">{p.display_name}</td>
                <td className="px-4 py-3 font-mono text-xs uppercase text-secondary">{p.tier}</td>
                <td className="px-4 py-3 font-mono text-xs text-secondary">
                  {formatEuro(p.amount_paid_cents)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-secondary">{p.country_code}</td>
                <td className="px-4 py-3 font-mono text-xs text-tertiary">
                  {new Date(p.created_at).toLocaleString("en-GB")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
