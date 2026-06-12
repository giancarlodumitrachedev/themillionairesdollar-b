# The Millionaire's Dollar

A cultural experiment: millionaires pay €5 (or considerably more) to declare
publicly that they exist. A permanent wall of tiles, a world map of
declarations, six participation tiers, an anonymous group of Curators.

Built with **Next.js 15 (App Router) · TypeScript strict · Tailwind CSS 4 ·
Framer Motion · Supabase · Stripe Checkout · Resend · Mapbox GL JS**.

---

## Repository tour

```
app/
  (public)/            Homepage, /wall, /map, /tile/[id], /manifesto,
                       /press, /privacy, /terms, /participate
  (admin)/admin/       /admin/login (magic link) + gated dashboard:
                       overview, participants, vetting, analytics,
                       press, newsletter, settings (tier control)
  checkout/            /checkout/success (polls for the new tile),
                       /checkout/cancelled
  api/                 checkout, stripe/webhook, newsletter/{subscribe,
                       unsubscribe}, data-deletion, map-data, tiers,
                       tile-by-session
  opengraph-image.tsx  Default OG image (live counter)
components/            ui / site / home / wall / map / participate /
                       checkout / admin
lib/                   supabase clients, tiers, i18n (EN+IT), emails,
                       geocode (+±5km jitter), security, mapbox style JSON
hooks/                 use-realtime-counter, use-participants,
                       use-tier-availability
supabase/migrations/   Schema, mirrored from the live project (already applied)
docs/                  PRD.md (the spec) + TECHNICAL.md (component docs)
```

## Setup — step by step

### 0. Prerequisites

Node 20+, npm. Accounts: Supabase, Stripe, Resend, Mapbox, Vercel,
Cloudflare (optional but recommended).

### 1. Clone + install

```bash
git clone https://github.com/giancarlodumitrachedev/themillionairesdollar-b.git
cd themillionairesdollar-b
npm install
cp .env.local.example .env.local
```

### 2. Supabase (mostly DONE — live project exists)

The project **TheMillionairesDollar** (`mnsjtkzlrentyzqbzhsb`, eu-west-1)
already contains the full schema, RLS policies, views (`public_tiles`,
`public_stats`), counter triggers, and Realtime publication. Both migrations
in `supabase/migrations/` are already applied.

Still required by hand:

1. **Service role key** — Dashboard → Settings → API → `service_role` →
   paste into `SUPABASE_SERVICE_ROLE_KEY`.
2. **Admin whitelist** — add each curator email:
   ```sql
   INSERT INTO admin_whitelist (email) VALUES ('you@example.com');
   ```
3. **Auth redirect URLs** — Dashboard → Authentication → URL Configuration:
   set Site URL to your domain and add
   `https://<domain>/auth/callback` to Redirect URLs (and
   `http://localhost:3000/auth/callback` for dev).
4. (Optional) custom SMTP under Authentication → Emails so magic links
   don't use Supabase's rate-limited default sender.

### 3. Stripe

1. Get keys (test mode first): `STRIPE_SECRET_KEY`,
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. Create a webhook endpoint → `https://<domain>/api/stripe/webhook`,
   event: `checkout.session.completed`. Copy the signing secret into
   `STRIPE_WEBHOOK_SECRET`.
3. Local testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   stripe trigger checkout.session.completed   # or pay with 4242 4242 4242 4242
   ```
4. Branding (Dashboard → Settings → Branding): background `#0a0a0a`,
   accent `#8b7355`, upload the wordmark.
5. Enable **Stripe Radar** for fraud screening.

### 4. Resend

1. Verify your sending domain (SPF + DKIM records on Cloudflare).
2. `RESEND_API_KEY` + `EMAIL_FROM="The Curators <curators@themillionairesdollar.com>"`.

### 5. Mapbox

1. Create a token (public scopes) → `NEXT_PUBLIC_MAPBOX_TOKEN`.
2. The custom dark style ships in `lib/mapbox/style.dark.json` — no Studio
   work needed. URL-restrict the token to your domains.

### 6. Run

```bash
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

### 7. Vercel

1. Import the GitHub repo. Framework preset: Next.js. Production branch: `main`.
2. Add every variable from `.env.local.example` to the project env.
3. Add the custom domain.

### 8. Cloudflare

DNS → CNAME to Vercel (`cname.vercel-dns.com`), proxy on. SSL/TLS **Full
(Strict)**. Always Use HTTPS on. Bot Fight Mode on. Cache rules: bypass
`/api/*` and `/admin*`. Optional: create a **Turnstile** widget and set
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` — the participate
flow picks them up automatically; without them a honeypot + rate limit still
apply.

---

## How the moving parts fit

**Payment flow** — `/participate` (3 steps, client-validated) → POST
`/api/checkout` (zod validation, honeypot, rate limit, tier-gate check) →
Stripe hosted Checkout → webhook verifies the signature, geocodes the city
via Nominatim with ±5km privacy jitter, inserts the participant
(idempotent on payment intent), upserts the newsletter opt-in and sends the
plain-text welcome email → DB trigger refreshes `counters` → Supabase
Realtime pushes the new total to every open page → `/checkout/success`
polls `/api/tile-by-session` until the tile exists and shows
“Welcome to the Wall, #01247”.

**Privacy model** — the `participants` table has **no** public read policy.
Browsers only ever see the `public_tiles` view (initials computed in SQL
when requested, jittered coordinates, no email/phone) and `public_stats`.
Revenue total is not public; tier availability is computed server-side.

**Tier gating** — `lib/tiers.ts` holds prices + revenue thresholds
(Founding > €5K, Permanent > €15K, Patron > €30K, Curators' Circle > €100K).
Admins can force any tier on/off in `/admin/settings`
(`site_settings.tier_overrides`).

**i18n** — `lang` cookie, negotiated from `Accept-Language` (IT → Italian,
otherwise English). Toggle in the menu and footer.

**GDPR** — three separate consent checkboxes at checkout; right to be
forgotten via double-opt-in deletion flow (`POST /api/data-deletion` →
signed email link → tile hidden + confirmation email); essential cookies
only, so the banner is informational.

## Pre-launch checklist

See PRD §15 — and `docs/TECHNICAL.md` for component documentation and the
list of deliberate deviations from the PRD (each with rationale).
