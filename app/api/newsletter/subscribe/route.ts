import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";

const Schema = z.object({
  email: z.string().email().max(254),
  source: z.string().max(40).optional().default("footer"),
  website: z.string().optional().default(""), // honeypot
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`newsletter:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let parsed;
  try {
    parsed = Schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  if (parsed.website !== "") return NextResponse.json({ ok: true });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      { email: parsed.email.toLowerCase(), source: parsed.source, unsubscribed_at: null },
      { onConflict: "email" }
    );

  if (error) return NextResponse.json({ error: "store_failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
