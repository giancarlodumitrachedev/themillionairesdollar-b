import type Stripe from "stripe";
import { sendWelcomeEmail } from "@/lib/emails";
import { geocodeCity } from "@/lib/geocode";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { TIERS, isTierId } from "@/lib/tiers";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return new Response("missing signature", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch {
    return new Response("invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      try {
        await handleCompletedSession(session);
      } catch (err) {
        // Non-2xx makes Stripe retry — exactly what we want for transient failures.
        console.error("webhook processing failed", err);
        return new Response("processing error", { status: 500 });
      }
    }
  }

  return new Response("ok", { status: 200 });
}

async function handleCompletedSession(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  // Idempotency: Stripe retries webhooks; one tile per payment intent.
  if (paymentIntentId) {
    const { data: existing } = await supabase
      .from("participants")
      .select("id")
      .eq("stripe_payment_intent_id", paymentIntentId)
      .maybeSingle();
    if (existing) return;
  }

  const m = session.metadata ?? {};
  const tier = isTierId(m.tier ?? "") ? (m.tier as keyof typeof TIERS) : "existence";
  const email = session.customer_details?.email ?? "";
  const countryCode = m.country_code ?? "XX";
  const city = m.city || null;

  // Approximate, privacy-jittered location for the map. Failure is fine.
  const geo = await geocodeCity(countryCode, city);

  const { data: inserted, error } = await supabase
    .from("participants")
    .insert({
      tier,
      amount_paid_cents: session.amount_total ?? TIERS[tier].amountCents,
      email,
      display_name: m.display_name ?? "Anonymous",
      display_as: m.display_as === "full_name" ? "full_name" : "initials",
      country_code: countryCode,
      city,
      latitude: geo?.latitude ?? null,
      longitude: geo?.longitude ?? null,
      year_became_millionaire: m.year ? parseInt(m.year, 10) || null : null,
      personal_message: m.personal_message || null,
      linkedin_url: m.linkedin_url || null,
      business_email: m.business_email || null,
      source_of_wealth: m.source_of_wealth || null,
      phone_number: m.phone_number || null,
      consent_participation: true,
      consent_future_contact: m.consent_future_contact === "true",
      consent_newsletter: m.consent_newsletter === "true",
      vetting_status: TIERS[tier].requiresVetting ? "pending" : "none",
      stripe_payment_intent_id: paymentIntentId,
      stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
    })
    .select("id, tile_number")
    .single();

  if (error) throw error;

  if (m.consent_newsletter === "true" && email) {
    await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email, source: "checkout", participant_id: inserted.id },
        { onConflict: "email" }
      );
  }

  if (email) {
    try {
      await sendWelcomeEmail(email, inserted.tile_number, inserted.id);
    } catch (err) {
      // Email failure must not make Stripe retry (tile already exists).
      console.error("welcome email failed", err);
    }
  }
}
