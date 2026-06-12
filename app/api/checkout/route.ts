import { NextResponse } from "next/server";
import { z } from "zod";
import { isCountryCode } from "@/lib/countries";
import { getTierAvailability } from "@/lib/public-data";
import { rateLimit, verifyTurnstile } from "@/lib/security";
import { getStripe } from "@/lib/stripe";
import { TIERS, isTierId } from "@/lib/tiers";
import { siteUrl } from "@/lib/utils";

const CheckoutSchema = z.object({
  tier: z.string().refine(isTierId, "unknown tier"),
  email: z.string().email().max(254),
  displayName: z.string().trim().min(1).max(32),
  displayAs: z.enum(["initials", "full_name"]),
  countryCode: z.string().refine(isCountryCode, "unknown country"),
  city: z.string().max(80).optional().default(""),
  year: z.string().max(4).optional().default(""),
  message: z.string().max(60).optional().default(""),
  linkedinUrl: z.string().max(200).optional().default(""),
  businessEmail: z.string().max(254).optional().default(""),
  sourceOfWealth: z.string().max(200).optional().default(""),
  phone: z.string().max(40).optional().default(""),
  consentParticipation: z.literal(true),
  consentFutureContact: z.boolean().optional().default(false),
  consentNewsletter: z.boolean().optional().default(false),
  website: z.string().optional().default(""), // honeypot
  turnstileToken: z.string().optional(),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // PRD §11.3 — max 3 checkout attempts per IP per hour.
  if (!rateLimit(`checkout:${ip}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let parsed;
  try {
    parsed = CheckoutSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  // Honeypot filled → pretend success, give bots nothing to learn from.
  if (parsed.website !== "") {
    return NextResponse.json({ url: siteUrl() });
  }

  if (!(await verifyTurnstile(parsed.turnstileToken, ip))) {
    return NextResponse.json({ error: "bot_check_failed" }, { status: 400 });
  }

  const { availability } = await getTierAvailability();
  if (!availability[parsed.tier]) {
    return NextResponse.json({ error: "tier_not_available" }, { status: 400 });
  }

  const tier = TIERS[parsed.tier];
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: tier.productName,
            description: "A tile on The Millionaire's Dollar Wall",
          },
          unit_amount: tier.amountCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${siteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/checkout/cancelled`,
    customer_email: parsed.email,
    metadata: {
      tier: parsed.tier,
      display_name: parsed.displayName,
      display_as: parsed.displayAs,
      country_code: parsed.countryCode,
      city: parsed.city,
      year: parsed.year,
      personal_message: parsed.message,
      linkedin_url: parsed.linkedinUrl,
      business_email: parsed.businessEmail,
      source_of_wealth: parsed.sourceOfWealth,
      phone_number: parsed.phone,
      consent_future_contact: String(parsed.consentFutureContact),
      consent_newsletter: String(parsed.consentNewsletter),
    },
  });

  return NextResponse.json({ url: session.url });
}
