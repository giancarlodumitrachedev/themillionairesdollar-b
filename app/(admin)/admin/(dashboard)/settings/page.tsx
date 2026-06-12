import { TierControl } from "@/components/admin/tier-control";
import { createAdminClient } from "@/lib/supabase/admin";
import { TIERS, TIER_ORDER, computeAvailability, formatEuro, type TierOverrides } from "@/lib/tiers";

export const metadata = { title: "Admin — Settings", robots: { index: false } };

export default async function AdminSettingsPage() {
  const supabase = createAdminClient();
  const [{ data: setting }, { data: revenue }] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "tier_overrides").maybeSingle(),
    supabase.from("counters").select("value").eq("id", "revenue_total_cents").maybeSingle(),
  ]);

  const overrides = ((setting?.value as TierOverrides) ?? {}) as TierOverrides;
  const revenueCents = revenue?.value ?? 0;
  const availability = computeAvailability(revenueCents, overrides);

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-primary">Tier control</h1>
      <p className="mt-2 text-sm text-secondary">
        Current revenue: <span className="font-mono text-primary">{formatEuro(revenueCents)}</span>.
        “Auto” opens a tier when revenue passes its threshold.
      </p>

      <ul className="mt-8 max-w-2xl space-y-3">
        {TIER_ORDER.map((id) => (
          <li
            key={id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-edge bg-bg-elevated px-5 py-4"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
                {id}{" "}
                <span className="text-tertiary">
                  — {formatEuro(TIERS[id].amountCents, { compact: true })}, threshold{" "}
                  {formatEuro(TIERS[id].revenueThresholdCents, { compact: true })}
                </span>
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-tertiary">
                currently:{" "}
                <span className={availability[id] ? "text-success" : "text-danger"}>
                  {availability[id] ? "open" : "closed"}
                </span>
              </p>
            </div>
            <TierControl tier={id} current={overrides[id] ?? "auto"} />
          </li>
        ))}
      </ul>
    </div>
  );
}
