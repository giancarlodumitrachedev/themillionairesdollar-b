import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Used by /checkout/success to resolve the freshly-created tile.
 * The session id acts as the bearer secret — only the payer has it.
 */
export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "invalid_session" }, { status: 400 });
  }

  let paymentIntentId: string | null = null;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ pending: true });
    }
    paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;
  } catch {
    return NextResponse.json({ error: "invalid_session" }, { status: 400 });
  }

  if (!paymentIntentId) return NextResponse.json({ pending: true });

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("participants")
    .select("id, tile_number")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .maybeSingle();

  if (!data) return NextResponse.json({ pending: true });
  return NextResponse.json({ tileNumber: data.tile_number, tileId: data.id });
}
