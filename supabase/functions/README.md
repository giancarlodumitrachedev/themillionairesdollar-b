# Supabase Edge Functions — architectural decision

The PRD (§5) lists four Supabase Edge Functions: `stripe-webhook`,
`geocode-city`, `generate-tile-og-image`, `send-newsletter`. The PRD (§6 and
§14.1) **also** specifies the same logic as Next.js API routes
(`/app/api/stripe/webhook`, `/app/api/checkout`, OG generation via
`@vercel/og`).

Implementing both would mean two Stripe webhook endpoints and duplicated
business logic, which is a reliability hazard (double inserts, split logs).
This repository therefore implements everything **once, inside Next.js on
Vercel**, which is the variant the PRD itself codes out in §6:

| PRD edge function        | Implemented as                                            |
| ------------------------ | --------------------------------------------------------- |
| `stripe-webhook`         | `app/api/stripe/webhook/route.ts` (signature-verified)    |
| `geocode-city`           | `lib/geocode.ts`, called inside the webhook (Nominatim + ±5km jitter) |
| `generate-tile-og-image` | `app/tile/[id]/opengraph-image.tsx` (`next/og` ImageResponse) |
| `send-newsletter`        | `sendNewsletter` server action + `lib/emails.ts` (Resend batches) |

Benefits: one deployment, one set of environment variables, one webhook URL
to configure in Stripe, and the OG images are wired automatically into the
page metadata.

If you later want to move any of these into Deno edge functions (e.g. to
keep them alive independently of the web frontend), the logic in
`lib/geocode.ts` and `lib/emails.ts` is dependency-light and ports directly.
