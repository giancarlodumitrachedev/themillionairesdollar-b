"use server";

import { revalidatePath } from "next/cache";
import { requireAdminEmail } from "@/lib/admin-auth";
import { sendNewsletterBatch, sendRemovalEmail } from "@/lib/emails";
import { createAdminClient } from "@/lib/supabase/admin";
import { isTierId, type TierOverride, type TierOverrides } from "@/lib/tiers";

async function log(
  adminEmail: string,
  action: string,
  targetTable?: string,
  targetId?: string,
  details?: Record<string, string | number | boolean | null>
) {
  const supabase = createAdminClient();
  await supabase.from("admin_log").insert({
    admin_email: adminEmail,
    action,
    target_table: targetTable ?? null,
    target_id: targetId ?? null,
    details: details ?? null,
  });
}

export async function setTilePublic(id: string, isPublic: boolean) {
  const admin = await requireAdminEmail();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("participants")
    .update({
      is_public: isPublic,
      removal_requested_at: isPublic ? null : new Date().toISOString(),
    })
    .eq("id", id)
    .select("email, tile_number")
    .maybeSingle();

  await log(admin, isPublic ? "tile_restored" : "tile_hidden", "participants", id);
  if (!isPublic && data) {
    try {
      await sendRemovalEmail(data.email, data.tile_number);
    } catch {
      // best-effort
    }
  }
  revalidatePath("/admin/participants");
}

export async function setHighlighted(id: string, value: boolean) {
  const admin = await requireAdminEmail();
  const supabase = createAdminClient();
  await supabase.from("participants").update({ is_highlighted: value }).eq("id", id);
  await log(admin, value ? "tile_highlighted" : "tile_unhighlighted", "participants", id);
  revalidatePath("/admin/participants");
}

export async function setVettingStatus(id: string, status: string, note: string) {
  const admin = await requireAdminEmail();
  if (!["pending", "in_progress", "approved", "rejected"].includes(status)) {
    throw new Error("invalid status");
  }
  const supabase = createAdminClient();

  const { data: current } = await supabase
    .from("participants")
    .select("vetting_notes")
    .eq("id", id)
    .maybeSingle();

  const notes = (current?.vetting_notes as Record<string, unknown>) ?? {};
  const history = Array.isArray(notes.history) ? notes.history : [];
  if (note.trim()) {
    history.push({ at: new Date().toISOString(), by: admin, note: note.trim(), status });
  }

  await supabase
    .from("participants")
    .update({ vetting_status: status, vetting_notes: { ...notes, history } })
    .eq("id", id);

  await log(admin, "vetting_updated", "participants", id, { status });
  revalidatePath("/admin/vetting");
}

export async function addPress(formData: FormData) {
  const admin = await requireAdminEmail();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("press_coverage")
    .insert({
      publication_name: String(formData.get("publication_name") ?? "").trim(),
      article_title: String(formData.get("article_title") ?? "").trim(),
      article_url: String(formData.get("article_url") ?? "").trim(),
      publication_logo_url: String(formData.get("publication_logo_url") ?? "").trim() || null,
      quote: String(formData.get("quote") ?? "").trim() || null,
      published_at: String(formData.get("published_at") ?? "").trim() || null,
      is_featured: formData.get("is_featured") === "on",
      display_order: Number(formData.get("display_order") ?? 0) || 0,
    })
    .select("id")
    .single();

  await log(admin, "press_added", "press_coverage", data?.id);
  revalidatePath("/admin/press");
  revalidatePath("/press");
  revalidatePath("/");
}

export async function deletePress(id: string) {
  const admin = await requireAdminEmail();
  const supabase = createAdminClient();
  await supabase.from("press_coverage").delete().eq("id", id);
  await log(admin, "press_deleted", "press_coverage", id);
  revalidatePath("/admin/press");
  revalidatePath("/press");
  revalidatePath("/");
}

export async function setTierOverride(tier: string, override: TierOverride) {
  const admin = await requireAdminEmail();
  if (!isTierId(tier) || !["auto", "enabled", "disabled"].includes(override)) {
    throw new Error("invalid input");
  }
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "tier_overrides")
    .maybeSingle();

  const overrides = ((data?.value as TierOverrides) ?? {}) as TierOverrides;
  overrides[tier] = override;

  await supabase
    .from("site_settings")
    .upsert({ key: "tier_overrides", value: overrides, updated_at: new Date().toISOString() });

  await log(admin, "tier_override_set", "site_settings", undefined, { tier, override });
  revalidatePath("/admin/settings");
  revalidatePath("/participate");
  revalidatePath("/");
}

export async function sendNewsletter(formData: FormData): Promise<{ sent: number; failed: number }> {
  const admin = await requireAdminEmail();
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const audience = String(formData.get("audience") ?? "subscribers");
  const testTo = String(formData.get("test_to") ?? "").trim();

  if (!subject || !body) throw new Error("subject and body required");
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  if (testTo) {
    const result = await sendNewsletterBatch([testTo], `[TEST] ${subject}`, paragraphs);
    await log(admin, "newsletter_test_sent", undefined, undefined, { subject, testTo });
    return result;
  }

  const supabase = createAdminClient();
  const recipients = new Set<string>();

  if (audience === "subscribers" || audience === "all") {
    const { data } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .is("unsubscribed_at", null);
    for (const row of data ?? []) recipients.add(row.email.toLowerCase());
  }
  if (audience === "participants" || audience === "all") {
    const { data } = await supabase
      .from("participants")
      .select("email")
      .eq("consent_newsletter", true)
      .eq("is_public", true);
    for (const row of data ?? []) recipients.add(row.email.toLowerCase());
  }

  const result = await sendNewsletterBatch([...recipients], subject, paragraphs);
  await log(admin, "newsletter_sent", undefined, undefined, {
    subject,
    audience,
    ...result,
  });
  return result;
}
