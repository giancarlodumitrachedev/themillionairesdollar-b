import { VettingActions } from "@/components/admin/vetting-actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatEuro } from "@/lib/tiers";
import { formatTileNumber } from "@/lib/utils";

export const metadata = { title: "Admin — Vetting", robots: { index: false } };

export default async function AdminVettingPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("participants")
    .select(
      "id, tile_number, display_name, email, tier, amount_paid_cents, country_code, linkedin_url, business_email, source_of_wealth, phone_number, vetting_status, vetting_notes, created_at"
    )
    .neq("vetting_status", "none")
    .order("created_at", { ascending: false });

  const queue = data ?? [];

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-primary">Vetting queue</h1>
      <p className="mt-2 text-sm text-secondary">
        Verified and high-tier participants awaiting identity review.
      </p>

      {queue.length === 0 ? (
        <p className="mt-12 font-display text-lg font-light italic text-tertiary">
          Nothing to vet. The queue is empty.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {queue.map((p) => {
            const history = Array.isArray(
              (p.vetting_notes as { history?: unknown[] } | null)?.history
            )
              ? ((p.vetting_notes as { history: Array<{ at: string; by: string; note: string }> })
                  .history ?? [])
              : [];
            return (
              <li key={p.id} className="rounded-sm border border-edge bg-bg-elevated p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-primary">
                    <span className="font-mono text-xs text-tertiary">
                      {formatTileNumber(p.tile_number)}
                    </span>{" "}
                    {p.display_name}
                    <span className="ml-3 font-mono text-xs uppercase text-secondary">
                      {p.tier} — {formatEuro(p.amount_paid_cents)}
                    </span>
                  </p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent-bright">
                    {p.vetting_status}
                  </span>
                </div>

                <dl className="mt-4 grid gap-2 font-mono text-xs text-secondary sm:grid-cols-2">
                  <div>email: {p.email}</div>
                  <div>country: {p.country_code}</div>
                  {p.linkedin_url && (
                    <div className="truncate">
                      linkedin:{" "}
                      <a className="link-inline" href={p.linkedin_url} target="_blank" rel="noopener noreferrer">
                        {p.linkedin_url}
                      </a>
                    </div>
                  )}
                  {p.business_email && <div>business: {p.business_email}</div>}
                  {p.phone_number && <div>phone: {p.phone_number}</div>}
                  {p.source_of_wealth && (
                    <div className="sm:col-span-2">wealth: {p.source_of_wealth}</div>
                  )}
                </dl>

                {history.length > 0 && (
                  <ul className="mt-4 space-y-1 border-t border-edge pt-3 font-mono text-[11px] text-tertiary">
                    {history.map((h, i) => (
                      <li key={i}>
                        {new Date(h.at).toLocaleString("en-GB")} — {h.by}: {h.note}
                      </li>
                    ))}
                  </ul>
                )}

                <VettingActions id={p.id} current={p.vetting_status} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
