import { addPress } from "@/app/(admin)/admin/(dashboard)/actions";
import { PressDeleteButton } from "@/components/admin/press-delete-button";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Admin — Press", robots: { index: false } };

export default async function AdminPressPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("press_coverage")
    .select("*")
    .order("display_order", { ascending: true })
    .order("published_at", { ascending: false });

  const input =
    "w-full rounded-sm border border-edge bg-bg-elevated px-3 py-2 text-sm text-primary placeholder:text-tertiary focus:border-accent focus:outline-none";

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-primary">Press tracker</h1>
      <p className="mt-2 text-sm text-secondary">
        The homepage section appears automatically once at least one entry exists.
      </p>

      <form action={addPress} className="mt-8 max-w-xl space-y-3 rounded-sm border border-edge bg-bg-elevated p-6">
        <input name="publication_name" required placeholder="Publication name *" className={input} />
        <input name="article_title" required placeholder="Article title *" className={input} />
        <input name="article_url" required type="url" placeholder="Article URL *" className={input} />
        <input name="publication_logo_url" type="url" placeholder="Logo URL (SVG preferred)" className={input} />
        <textarea name="quote" placeholder="Selected quote (optional)" className={input} rows={2} />
        <div className="flex gap-3">
          <input name="published_at" type="date" className={input} />
          <input name="display_order" type="number" placeholder="Order" defaultValue={0} className={input} />
        </div>
        <label className="flex items-center gap-2 text-sm text-secondary">
          <input type="checkbox" name="is_featured" className="h-4 w-4 accent-[#8b7355]" />
          Featured (quote shown on homepage)
        </label>
        <button
          type="submit"
          className="rounded-sm border border-primary px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-primary transition-colors duration-300 hover:bg-primary hover:text-bg"
        >
          Add coverage
        </button>
      </form>

      <ul className="mt-8 space-y-2">
        {(data ?? []).map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-sm border border-edge bg-bg-elevated px-4 py-3"
          >
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-tertiary">
                {item.publication_name}
                {item.is_featured ? " — featured" : ""}
              </p>
              <p className="truncate text-sm text-primary">{item.article_title}</p>
            </div>
            <PressDeleteButton id={item.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
