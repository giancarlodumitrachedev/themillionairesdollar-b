import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { SignOutButton } from "@/components/admin/sign-out-button";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/participants", label: "Participants" },
  { href: "/admin/vetting", label: "Vetting" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/press", label: "Press" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireAdmin();

  return (
    <div className="min-h-svh lg:flex">
      <aside className="border-b border-edge bg-bg-elevated lg:w-56 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-6 lg:block">
          <div>
            <p className="font-display text-xl text-primary">M.D.</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-tertiary">
              Internal
            </p>
          </div>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-4 pb-4 lg:flex-col lg:px-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-secondary transition-colors duration-200 hover:bg-bg-overlay hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t border-edge p-4 lg:block">
          <p className="truncate font-mono text-[10px] text-tertiary">{email}</p>
          <SignOutButton />
        </div>
      </aside>
      <div className="flex-1 p-6 lg:p-10">{children}</div>
    </div>
  );
}
