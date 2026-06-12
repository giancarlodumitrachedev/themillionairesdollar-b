# Technical documentation

Component-level documentation of the key pieces, plus the deliberate
deviations from the PRD and why each was made.

## Design system

`app/globals.css` defines the entire system as Tailwind 4 `@theme` tokens:
exactly the PRD palette (no other colors exist as utilities — `--color-*:
initial` wipes the Tailwind default palette), the three font stacks
(`font-display` → Cormorant Garamond, `font-body` → Inter, `font-mono` →
JetBrains Mono, all loaded with `next/font` for zero-CLS swaps), radii
capped at 8px. Shared primitives: `.container-site`, `.eyebrow`,
`.link-inline`, `.loading-line` (the 1px sweep that replaces spinners),
`.skeleton` (shimmer), `.scroll-indicator-line`, `.skip-link`,
`.tile-permanent` (the single sanctioned near-invisible gold gradient),
`.dropcap`. A global `prefers-reduced-motion` block collapses every
animation to 0.01ms; Framer components additionally branch on
`useReducedMotion()`.

## Realtime pipeline

One channel, deliberately narrow: clients subscribe to
`counters.participants_total` UPDATEs (the only counter row anon may read —
RLS). A statement-level trigger on `participants` recomputes the counters
on every insert/update/delete, so a single Realtime event fans out to:

- `useRealtimeCounter` — hero counter and /wall, /map headers (+300ms accent flash);
- `WallPreview` / `useParticipants` — refetch the newest tile and prepend it
  (scale-in 600ms);
- the map flashes new points on the next `/api/map-data` revalidation.

Subscribing to `participants` directly would leak row payloads to anonymous
clients; the counter-as-signal pattern keeps the wire PII-free.

## The Wall (`components/wall/tile-grid.tsx`)

`react-window` FixedSizeGrid. Column count derives from a ResizeObserver
(180px tiles ≥1024px, 140px ≥640px, 100px below — PRD §3.3). Pages of 200
rows from `public_tiles`; `onItemsRendered` triggers the next page four rows
before the end. "Random" order is a stable keyset fetch shuffled per page
client-side (PostgREST has no random ordering; documented trade-off).
Tier variants live in `components/wall/tile.tsx` and match PRD §3.3 exactly.

## The Map (`components/map/world-map.tsx`)

The Mapbox SDK and its CSS are dynamically imported, and the component
itself only mounts when an IntersectionObserver sees the section within
400px (PRD §3.4 lazy-load requirement). The style is a hand-written
specification (`lib/mapbox/style.dark.json`): water #0a0a0a, land #1a1a1a,
0.5px non-disputed admin-0 borders, country labels only ≥z3 — no cities, no
roads. Data arrives as GeoJSON from `/api/map-data` (edge-cached 5 min,
paginated reads up to 60K points) and renders through Mapbox's WebGL
clustering (radius 50). Max zoom 10, popups show tile number / name /
country / year only. The collective pulse is a paint-property interval,
skipped under reduced motion.

## Checkout (`/participate` → Stripe → webhook)

- `participate-flow.tsx` is a three-step state machine (tier → form →
  review). Validation is mirrored client-side (`validateForm`) and
  server-side (zod in `/api/checkout`).
- `/api/checkout` enforces: honeypot (silently swallowed), optional
  Turnstile, 3 attempts/IP/hour, tier availability re-check (so a closed
  tier can't be bought via curl), then creates the Checkout Session with
  all tile data in metadata.
- `/api/stripe/webhook` verifies the signature, is idempotent via a partial
  unique index on `stripe_payment_intent_id`, geocodes through Nominatim
  with ±5km jitter (failure → no map point, never a failed sale), inserts,
  marks `vetting_status='pending'` for vetting tiers, sends the plain-text
  welcome email. Email failure does not 500 (Stripe would retry and find
  the idempotency guard anyway); insert failure does 500 so Stripe retries.
- `/checkout/success` polls `/api/tile-by-session` (session id is the
  bearer secret) every 2s until the webhook lands.

## Admin

Auth: Supabase magic link (`/admin/login` → `signInWithOtp` →
`/auth/callback` exchanges the code). Authorization: `admin_whitelist`
checked under the caller's own RLS context (the policy returns rows only to
whitelisted emails), in `lib/admin-auth.ts`. Middleware refreshes sessions
and bounces anonymous visitors off `/admin/*`. All mutations are server
actions (`app/(admin)/admin/(dashboard)/actions.ts`) that re-verify the
caller, use the service-role client, and append to `admin_log`.

Sections: Overview (counters, tier breakdown, latest 10), Participants
(search/pagination, hide/restore + highlight, hide sends the removal
email), Vetting (queue with notes history in `vetting_notes.history`),
Analytics (30-day SVG bar chart — no chart library), Press (CRUD; homepage
section auto-appears at ≥1 entry), Newsletter (Resend batches of 100, test
send, audience selection), Settings (tier overrides auto/enabled/disabled).

## Deviations from the PRD (each deliberate)

1. **Supabase Edge Functions not deployed** — the PRD specifies the same
   logic both as edge functions (§5) and as Next.js routes (§6/§14). Two
   webhook endpoints is a reliability hazard; everything lives in Next.js.
   See `supabase/functions/README.md` for the mapping.
2. **`public_stats` (materialized view) refreshes via trigger, not cron**
   (migration 004): the same statement trigger that maintains the counters
   also runs `REFRESH MATERIALIZED VIEW`, so stats are exact in real time
   with zero cron configuration. Past ~100K rows, move to pg_cron +
   `refresh_public_stats()` (CONCURRENTLY-ready: unique index in place).
3. **`public_tiles` computes initials in SQL** (migration 002): the PRD
   schema would have shipped full names to the client for initials-only
   participants. Privacy by design won.
4. **Revenue counter is not publicly readable** (migration 002): tier
   availability is computed server-side instead, since revenue gates the
   tiers but the figure itself is sensitive.
5. **Rate limiting is in-memory per serverless instance** — a real limiter
   needs shared state (Cloudflare rules or Upstash). Documented in
   `lib/security.ts`; Cloudflare Bot Fight Mode is the production layer.
6. **GT Sectra Display not bundled** — it is a commercial font; Cormorant
   Garamond (the PRD's own fallback) loads via `next/font`. Drop the GT
   Sectra woff2 files into `public/fonts/` and swap the `@theme` stack if
   licensed later.
7. **Year picker starts at 1950** per PRD §4.5 even though the DB CHECK
   allows ≥1900 — the stricter UI bound wins; the DB stays permissive for
   seed/import data.
8. **No service worker** — Vercel/Cloudflare edge caching covers static
   assets; a SW would add update-staleness risk for a single-page-ish site.
   Revisit only if offline support ever matters.
9. **Admin policies rewritten around `is_admin()`** (migration 003): the
   original `auth.email() IN (SELECT … FROM admin_whitelist)` pattern was
   self-referential through the whitelist's own policy and raised
   "infinite recursion detected in policy" on anonymous reads of
   `site_settings` and `press_coverage`. Found and fixed during end-to-end
   testing against the live database.

## Security linter notes (reviewed, intentional)

The Supabase advisor flags three things that are deliberate here:

- **`public_tiles` is an owner-rights (SECURITY DEFINER) view** — that is
  the mechanism: `participants` has no public SELECT policy at all, and the
  view is the only public window, exposing a fixed safe column set (initials
  computed in SQL, no email/phone) for `is_public` rows only. An
  invoker-rights view cannot do column-level filtering against RLS.
- **`public_stats` matview is API-readable** — it contains aggregate counts
  only, no PII.
- **`is_admin()` is executable by anon/authenticated** — required, since RLS
  policies evaluate it as the querying role; it returns a boolean about the
  caller's own email and nothing else (always `false` for anon).

One dashboard toggle remains for a human: enable “Leaked password
protection” under Auth settings (harmless here — auth is magic-link only).

## Performance notes

- Mapbox (~220KB gz) and react-window grids are lazy/dynamic imports;
  the homepage ships neither until needed.
- All public pages are server components except the interactive islands.
- Fonts subset to latin, `display: swap`, `next/font` removes CLS.
- The hero counter renders the final number server-side in the HTML
  (SEO + no-JS), then animates client-side.
