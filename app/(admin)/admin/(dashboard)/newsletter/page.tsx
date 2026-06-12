import { NewsletterComposer } from "@/components/admin/newsletter-composer";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Admin — Newsletter", robots: { index: false } };

export default async function AdminNewsletterPage() {
  const supabase = createAdminClient();
  const [{ count: subscribers }, { count: consented }] = await Promise.all([
    supabase
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .is("unsubscribed_at", null),
    supabase
      .from("participants")
      .select("id", { count: "exact", head: true })
      .eq("consent_newsletter", true)
      .eq("is_public", true),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-primary">Newsletter</h1>
      <p className="mt-2 text-sm text-secondary">
        {subscribers ?? 0} subscribers · {consented ?? 0} consenting participants. Sent via
        Resend in batches of 100.
      </p>
      <NewsletterComposer />
    </div>
  );
}
