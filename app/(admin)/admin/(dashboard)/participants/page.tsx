import { ParticipantRowActions } from "@/components/admin/participant-row-actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatEuro } from "@/lib/tiers";
import { formatTileNumber } from "@/lib/utils";

export const metadata = { title: "Admin — Participants", robots: { index: false } };

const PAGE_SIZE = 50;

export default async function AdminParticipantsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const page = Math.max(0, Number(params.page ?? 0) || 0);

  const supabase = createAdminClient();
  let query = supabase
    .from("participants")
    .select(
      "id, tile_number, display_name, email, tier, amount_paid_cents, country_code, city, is_public, is_highlighted, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

  if (q) {
    query = query.or(`display_name.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data, count } = await query;
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-primary">Participants</h1>

      <form className="mt-6 flex max-w-sm gap-2" action="/admin/participants" method="GET">
        <label htmlFor="q" className="sr-only">
          Search
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Search name or email…"
          className="w-full rounded-sm border border-edge bg-bg-elevated px-3 py-2 text-sm text-primary placeholder:text-tertiary focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-sm border border-tertiary px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] text-secondary hover:text-primary"
        >
          Search
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-sm border border-edge">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-edge font-mono text-[10px] uppercase tracking-[0.15em] text-tertiary">
              <th className="px-4 py-3">Tile</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Where</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge">
            {(data ?? []).map((p) => (
              <tr key={p.id} className={p.is_public ? "" : "opacity-50"}>
                <td className="px-4 py-3 font-mono text-xs text-tertiary">
                  {formatTileNumber(p.tile_number)}
                </td>
                <td className="px-4 py-3 text-primary">
                  {p.display_name}
                  {p.is_highlighted && <span className="ml-2 text-accent-bright">★</span>}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-secondary">{p.email}</td>
                <td className="px-4 py-3 font-mono text-xs uppercase text-secondary">{p.tier}</td>
                <td className="px-4 py-3 font-mono text-xs text-secondary">
                  {formatEuro(p.amount_paid_cents)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-secondary">
                  {[p.city, p.country_code].filter(Boolean).join(", ")}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-tertiary">
                  {p.is_public ? "public" : "hidden"}
                </td>
                <td className="px-4 py-3">
                  <ParticipantRowActions
                    id={p.id}
                    isPublic={p.is_public}
                    isHighlighted={p.is_highlighted}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-4 font-mono text-xs text-tertiary">
        <span>
          Page {page + 1} / {totalPages} — {count ?? 0} total
        </span>
        {page > 0 && (
          <a className="link-inline" href={`/admin/participants?q=${encodeURIComponent(q)}&page=${page - 1}`}>
            ← Prev
          </a>
        )}
        {page + 1 < totalPages && (
          <a className="link-inline" href={`/admin/participants?q=${encodeURIComponent(q)}&page=${page + 1}`}>
            Next →
          </a>
        )}
      </div>
    </div>
  );
}
