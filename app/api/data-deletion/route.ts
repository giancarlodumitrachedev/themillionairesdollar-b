import { NextResponse } from "next/server";
import { z } from "zod";
import { sendDeletionConfirmRequest, sendRemovalEmail } from "@/lib/emails";
import { rateLimit, signToken, verifyToken } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteUrl } from "@/lib/utils";

const TOKEN_TTL = 48 * 60 * 60 * 1000;

/**
 * GDPR right-to-be-forgotten, in two steps so strangers can't remove
 * someone else's tile:
 *   POST {email}  → emails the participant a signed confirmation link
 *   GET ?token=…  → hides the tile, records the request, sends confirmation
 */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`deletion:${ip}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let email: string;
  try {
    email = z.object({ email: z.string().email() }).parse(await req.json()).email.toLowerCase();
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: participant } = await supabase
    .from("participants")
    .select("id")
    .eq("email", email)
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Always answer the same way — no account enumeration.
  if (participant) {
    const token = signToken(participant.id, TOKEN_TTL);
    await sendDeletionConfirmRequest(
      email,
      `${siteUrl()}/api/data-deletion?token=${encodeURIComponent(token)}`
    );
  }
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const participantId = token ? verifyToken(token) : null;
  if (!participantId) {
    return new Response("Invalid or expired link.", { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: participant } = await supabase
    .from("participants")
    .update({ is_public: false, removal_requested_at: new Date().toISOString() })
    .eq("id", participantId)
    .select("email, tile_number")
    .maybeSingle();

  if (participant) {
    await supabase.from("admin_log").insert({
      admin_email: "system",
      action: "tile_removed_by_user",
      target_table: "participants",
      target_id: participantId,
    });
    try {
      await sendRemovalEmail(participant.email, participant.tile_number);
    } catch {
      // confirmation email is best-effort
    }
  }

  return new Response(
    `<!doctype html><html><body style="background:#0a0a0a;color:#a8a59e;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
      <p style="font-style:italic;font-size:20px">Your tile has been removed. The Wall remembers nothing now.</p>
    </body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
