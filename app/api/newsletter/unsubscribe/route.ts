import { createAdminClient } from "@/lib/supabase/admin";

/** One-click unsubscribe linked from every newsletter footer. */
export async function GET(req: Request) {
  const email = new URL(req.url).searchParams.get("email");
  if (email) {
    const supabase = createAdminClient();
    await supabase
      .from("newsletter_subscribers")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("email", email.toLowerCase());
  }

  return new Response(
    `<!doctype html><html><body style="background:#0a0a0a;color:#a8a59e;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
      <p style="font-style:italic;font-size:20px">You will not hear from us again. Unless you return.</p>
    </body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
