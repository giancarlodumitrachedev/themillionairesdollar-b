import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

/**
 * Admin gate. Auth = Supabase magic link; authorization = admin_whitelist.
 * The whitelist check runs under the user's own RLS context: the
 * admin_read_whitelist policy returns rows only to whitelisted emails.
 */
export async function requireAdmin(): Promise<{ email: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect("/admin/login");

  const { data } = await supabase
    .from("admin_whitelist")
    .select("email")
    .eq("email", user.email)
    .maybeSingle();

  if (!data) redirect("/admin/login?error=not_authorized");
  return { email: user.email };
}

/** Same check for server actions, throwing instead of redirecting. */
export async function requireAdminEmail(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) throw new Error("unauthorized");

  const { data } = await supabase
    .from("admin_whitelist")
    .select("email")
    .eq("email", user.email)
    .maybeSingle();
  if (!data) throw new Error("unauthorized");
  return user.email;
}
