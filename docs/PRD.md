# PRD: THE MILLIONAIRE'S DOLLAR — Sito Web Completo

Documento di Sviluppo — Versione 1.0

## 0. CONTEXT PER L'ISTANZA CLAUDE CHE COSTRUIRÀ IL SITO

Stai costruendo un sito web completo per un progetto chiamato "The Millionaire's Dollar". Il sito invita persone (target: milionari self-declared, ma aperto a tutti via honor system) a pagare un importo a partire da €5 per dichiarare pubblicamente di esistere, ricevendo una "tessera" su un muro digitale pubblico permanente e una posizione su una mappa interattiva mondiale.

Il progetto è un esperimento culturale apparente, ma in realtà è lead generation per un futuro club privato. Il sito stesso NON DEVE rivelare nulla del club futuro — deve presentarsi come un genuino esperimento culturale/artistico.

Stack tecnico obbligato:

* Next.js 15 con App Router + TypeScript strict mode
* Tailwind CSS 4
* Framer Motion per animazioni
* Supabase per database, auth, storage (l'utente ha già l'integrazione configurata)
* Stripe Checkout per pagamenti (hosted page, NO custom payment form)
* Vercel per hosting
* Cloudflare per DNS e CDN
* Resend per email transazionali
* Mapbox GL JS per la mappa interattiva (free tier 50K loads/mese)
* React Server Components dove possibile per performance

Obiettivi non negoziabili:

1. Mobile-first responsive perfetto (>70% del traffico sarà mobile)
2. Lighthouse score >95 su Performance, Accessibility, SEO
3. Tempo di caricamento <1.5s su 4G mobile
4. Zero layout shift (CLS = 0)
5. Estetica "brutalismo editoriale" non "luxury brand" né "startup"
6. Dark mode è il default e unico mode (no light mode)
7. Accessibility WCAG AA compliant
8. Privacy by design (no tracking invasivo, cookie banner minimal)

Estetica di riferimento (NON copiare, ispirarsi):

* Are.na (are.na) per minimalismo intellettuale
* Holiday Magazine (holiday-magazine.com) per tipografia
* Cabinet Magazine per layout editoriale
* Mubi (mubi.com) per dark mode + serif
* Pentagram (pentagram.com) per ariosità

Estetiche da EVITARE assolutamente:

* Tailwind UI templates standard
* Linear / Vercel marketing pages (troppo "startup")
* Soho House / Aman websites (troppo "luxury")
* Stripe homepage (troppo "tech")
* Qualsiasi cosa con gradient colorati, glassmorphism, neumorphism

## 1. ARCHITETTURA INFORMATIVA

Il sito è una single page application con scroll narrativo, più alcune pagine secondarie. Struttura:

Pagine pubbliche:

* `/` — Homepage (single page scroll con tutte le sezioni principali)
* `/wall` — Il muro completo navigabile (estensione della sezione homepage)
* `/map` — La mappa mondiale full-screen (estensione della sezione homepage)
* `/tile/[id]` — Pagina singola di una tessera (per sharing diretto)
* `/manifesto` — Il manifesto esteso (long-form)
* `/press` — Press coverage (vuoto al lancio, popolato dopo)
* `/privacy` — Privacy policy
* `/terms` — Terms of service

Pagine di flusso:

* `/participate` — Tier selection + form di partecipazione
* `/checkout/success` — Pagina post-pagamento
* `/checkout/cancelled` — Pagina pagamento annullato

Pagine amministrative (protected):

* `/admin` — Dashboard interna (autenticazione email magic link)
* `/admin/participants` — Gestione partecipanti
* `/admin/vetting` — Coda vetting tier alti
* `/admin/analytics` — Statistiche interne

## 2. ESTETICA E DESIGN SYSTEM

### 2.1 Palette colori

Solo i seguenti valori, assolutamente nessun altro colore deve apparire:

```
--color-bg: #0a0a0a         /* Background principale */
--color-bg-elevated: #141414 /* Card e modal */
--color-bg-overlay: #1c1c1c  /* Hover states */
--color-text-primary: #f5f3ee /* Testo principale */
--color-text-secondary: #a8a59e /* Testo secondario */
--color-text-tertiary: #6b6862  /* Caption e dettagli */
--color-accent: #8b7355      /* Oro desaturato per accenti */
--color-accent-bright: #c9a876 /* Oro più chiaro per stati attivi */
--color-border: #2a2a2a      /* Bordi sottili */
--color-border-strong: #3a3a3a /* Bordi enfatici */
--color-danger: #8b3a3a      /* Errori (usare raramente) */
--color-success: #4a6b4a     /* Successo (usare raramente) */
```

Nessun gradient. Nessun colore vivace. Nessun rainbow. Nessun blu "tech". Punto.

### 2.2 Tipografia

Font display (titoli, numeri grandi):

* Primary: "GT Sectra Display" (se disponibile)
* Fallback Google Fonts: "Cormorant Garamond" weight 300, 400, 500
* Uso: hero counter, titoli sezione, numeri tessere

Font body (corpo del testo):

* Primary: "Inter" variable font (Google Fonts gratis)
* Uso: paragrafi, label, navigation, form

Font mono (dati, codici, numeri tabellari):

* Primary: "JetBrains Mono" variable (Google Fonts gratis)
* Uso: numero tessera, statistiche, anno, codici

Scala tipografica:

```
--font-size-xs: 0.75rem    /* 12px - caption */
--font-size-sm: 0.875rem   /* 14px - secondary */
--font-size-base: 1rem     /* 16px - body */
--font-size-lg: 1.25rem    /* 20px - emphasized body */
--font-size-xl: 1.5rem     /* 24px - subheading */
--font-size-2xl: 2rem      /* 32px - section title */
--font-size-3xl: 3rem      /* 48px - page title */
--font-size-display-sm: 5rem    /* 80px - hero secondary */
--font-size-display-md: 8rem    /* 128px - hero counter mobile */
--font-size-display-lg: 12rem   /* 192px - hero counter desktop */
```

Line height:

* Display: 0.95 (tight)
* Heading: 1.15
* Body: 1.6
* Caption: 1.4

Letter spacing:

* Display: -0.03em (tight)
* Heading: -0.02em
* Body: 0
* Uppercase labels: 0.1em

### 2.3 Spaziatura

Sistema basato su multipli di 8px:

```
--space-1: 0.5rem   /* 8px */
--space-2: 1rem     /* 16px */
--space-3: 1.5rem   /* 24px */
--space-4: 2rem     /* 32px */
--space-6: 3rem     /* 48px */
--space-8: 4rem     /* 64px */
--space-12: 6rem    /* 96px */
--space-16: 8rem    /* 128px */
--space-24: 12rem   /* 192px */
```

Regole di whitespace:

* Padding verticale tra sezioni: minimo 96px desktop, 64px mobile
* Padding orizzontale container: max-width 1280px con padding 32px desktop, 20px mobile
* Spazio tra elementi correlati: 16-24px
* Spazio tra elementi non correlati: 48-96px

### 2.4 Border radius e ombre

```
--radius-none: 0
--radius-sm: 2px
--radius-md: 4px
--radius-lg: 8px
```

Regola: la maggior parte degli elementi NON ha border radius. Solo bottoni interattivi e card delle tessere hanno radius molto sottile (2-4px). Mai pillole, mai cerchi arrotondati moderni.

Ombre: non usare ombre. Per la separazione visiva usare border sottili o background elevation.

### 2.5 Componenti UI di base

Bottone primario:

* Background: nero pieno
* Bordo: 1px solid var(--color-text-primary)
* Testo: bianco off
* Padding: 16px 32px
* Font: Inter 14px medium uppercase letter-spacing 0.1em
* Hover: background bianco off, testo nero, transition 300ms
* Border radius: 2px
* No emoji, no icons in default state

Bottone secondario:

* Background: transparent
* Bordo: 1px solid var(--color-text-tertiary)
* Testo: var(--color-text-secondary)
* Stesso padding e tipografia
* Hover: bordo più chiaro, testo bianco

Input testo:

* Background: var(--color-bg-elevated)
* Bordo: 1px solid var(--color-border)
* Testo: bianco off, font Inter 16px
* Padding: 16px
* Focus: bordo color accent
* Placeholder: var(--color-text-tertiary)
* Border radius: 2px

Link inline:

* Color: bianco off
* Underline: 1px sottile sotto la baseline
* Hover: color var(--color-accent-bright)
* No bold, no color shift drastico

## 3. HOMEPAGE: STRUTTURA DETTAGLIATA

La homepage è organizzata in 9 sezioni verticali. L'utente scrolla in sequenza naturale.

### 3.1 Sezione 1 — Hero (above the fold)

Layout:

* Full viewport height (100vh, 100svh su mobile per gestire safe area)
* Background: pure black #0a0a0a
* Layout flexbox column, centered
* Padding superiore: 80px desktop, 60px mobile

Top bar (fixed, transparent fino allo scroll):

* Logo testuale "M.D." in alto sinistra, font display, weight 400, 16px
* Menu hamburger icon (3 linee orizzontali sottili) in alto destra
* Background diventa #0a0a0a con border bottom 1px var(--color-border) dopo 100px scroll
* Transition 300ms

Contenuto centrato:

Riga 1 — Counter:

* Numero gigante, font display weight 300
* Desktop: 192px (--font-size-display-lg)
* Mobile: 96px (--font-size-display-md)
* Color: bianco off
* Counter animato all'mount: parte da 0 e conta fino al numero reale in 2000ms con easing
* Aggiornamento real-time via Supabase subscriptions quando nuovi paganti

Riga 2 — Etichetta:

* "MILLIONAIRES EXIST" in uppercase
* Font Inter, weight 500, 14px desktop, 12px mobile
* Letter spacing 0.2em
* Color: var(--color-text-secondary)
* Margin-top: 16px

Spaziatura: 80px desktop, 48px mobile

Riga 3 — Subline italiana (default per visitatori IT):

* "Lo hanno dimostrato con €5"
* Font display, weight 300, italic
* 24px desktop, 18px mobile
* Color: bianco off

Riga 4 — Subline secondaria:

* "Sei invitato a fare lo stesso"
* Same styling, color var(--color-text-secondary)
* Margin top 8px

Scroll indicator (bottom centro):

* Linea verticale 1px che pulsa (alta 60px), color var(--color-text-tertiary)
* Animazione: opacity 0.3 → 1 → 0.3 in 2000ms infinite
* Sotto la linea: testo "Scroll" font mono 10px uppercase letter-spacing 0.2em

Localizzazione:

* Detect language da Accept-Language header
* Italiano per IT, inglese per tutti gli altri
* Toggle lingua in menu hamburger

### 3.2 Sezione 2 — The Question

Padding verticale: 192px desktop, 96px mobile

Layout:

* Container max-width 720px, centered
* Padding orizzontale 32px desktop, 20px mobile
* Testo allineato a sinistra

Contenuto:

Domanda principale:

* "Why would anyone pay €5 to say they exist?"
* Font display, weight 400, italic
* 48px desktop, 32px mobile
* Color bianco off
* Margin bottom 64px

Tre paragrafi (Italian + English versions):

* Font Inter, 18px desktop, 16px mobile
* Line height 1.7
* Color var(--color-text-secondary)
* Spacing tra paragrafi: 24px

Animazione:

* Quando la sezione entra nel viewport (50% visible), fade-in slow 1200ms
* Stagger leggero tra paragrafi (200ms delay each)
* Trigger: IntersectionObserver via Framer Motion

### 3.3 Sezione 3 — The Wall (preview)

Padding verticale: 96px

Layout:

* Full width section
* Container padding orizzontale: 0 (il wall si estende edge-to-edge)

Header sezione:

* Container max-width 1280px, centered, padding 32px
* Eyebrow "01 — THE WALL" font mono 12px uppercase letter-spacing 0.2em color var(--color-text-tertiary)
* Titolo "Every tile is a person" font display 56px desktop 36px mobile weight 300
* Sottotitolo "Click any to read their reason for existing" font Inter 16px color var(--color-text-secondary)
* Spacing 32px tra eyebrow e titolo, 16px tra titolo e sottotitolo

Wall preview (mostra prime ~50 tessere):

Griglia di tile:

* Desktop: griglia auto-fill con tile 180x180px, gap 8px
* Tablet: tile 140x140px, gap 6px
* Mobile: tile 100x100px, gap 4px

Anatomia singola tile:

* Background: var(--color-bg-elevated)
* Border: 1px solid var(--color-border)
* Padding interno: 16px desktop, 12px mobile
* Layout flex column space-between

Contenuto tile:

* Top: numero tessera font mono 10px color var(--color-text-tertiary), es. "#01247"
* Center: iniziali (font display 28px) o nome completo (font display 16px se nome esteso)
* Bottom: city + country in font mono 9px uppercase, year font mono 9px
* Hover desktop: tile zoom 1.05x, border color accent, transition 300ms
* Click: apre modal con info completa

Tier visual variants:

* Existence (€5): tile standard come descritto
* Verified (€50): aggiunge piccolo "✓" in oro in alto destra
* Founding (€500): tile con border 1px accent invece di border standard
* Permanent (€5K): tile con background gradient sottile da #141414 a #1a1814 (oro molto desaturato)
* Patron (€25K): doppio border (esterno accent, interno standard), 2px gap

CTA in fondo:

* "View all 14,847 tiles →" link discreto, font Inter 14px
* Margin top 48px
* Link a /wall page

### 3.4 Sezione 4 — The Map (preview interattiva)

Padding verticale: 96px

Layout:

* Full width
* Container max-width 1280px per header, full width per la mappa

Header sezione:

* Eyebrow "02 — THE MAP"
* Titolo "Where existence has been declared"
* Sottotitolo "Real-time visualization of every participant"

Mappa interattiva:

Implementazione tecnica Mapbox GL JS:

* Container: aspect-ratio 16:9 desktop, 4:3 mobile
* Border: 1px solid var(--color-border)
* Style: custom dark map con Mapbox Studio

Stile mappa custom richiesto:

* Background acqua: #0a0a0a
* Background terra: #1a1a1a
* Bordi paesi: 0.5px var(--color-border)
* Nomi paesi: var(--color-text-tertiary) font Inter 10px (mostrati solo a zoom alto)
* Nessuna città, nessuna strada
* Nessun riconoscimento di territori contestati (usare default Natural Earth boundaries)

Punti partecipanti:

* Ogni tessera = un punto luminoso
* Posizione: random jitter ±5km da centro città dichiarata per privacy
* Colore base: var(--color-accent) #8b7355
* Dimensione base: 3px radius
* Glow effect: box-shadow circular 8px var(--color-accent) opacity 0.4

Animazioni mappa:

* All'apparire nel viewport, punti emergono uno per uno con stagger random (durata totale 3000ms)
* Pulse animation: ogni punto pulsa lentamente (opacity 0.6 → 1 → 0.6, 3000ms ciclo, fase random per punto)
* Nuovo pagante real-time: pulse forte (radius 3→12px) + glow esteso, 1500ms, poi torna normale
* Cluster automatic quando >5 punti in 50km: mostra numero in cerchio

Interazione utente:

* Pan: drag standard
* Zoom: scroll wheel desktop, pinch mobile
* Click su punto: popup con info tessera (numero, iniziali, anno, paese)
* Click su cluster: zoom in al cluster
* Mai zoom oltre street level (max zoom 10)
* Min zoom: vista mondo intero

Controlli mappa:

* Top right: contatore "X DECLARATIONS" font mono 11px uppercase
* Bottom right: filtri minimal (paese dropdown, anno range slider)
* Bottom left: legenda discreta (un singolo punto + "= one person")

Performance:

* Lazy load Mapbox SDK solo quando sezione entra in viewport
* Punti renderizzati con WebGL via Mapbox layer (gestisce 50K+ punti facilmente)
* Data caricata via Supabase con paginazione se >10K punti

CTA in fondo:

* "Explore full map →" link a /map page

### 3.5 Sezione 5 — The Tiers

Padding verticale: 192px desktop, 96px mobile

Layout:

* Container max-width 1280px
* Padding 32px

Header:

* Eyebrow "03 — PARTICIPATE"
* Titolo "Choose how you want to exist"
* Sottotitolo "Every participation is permanent"

Grid dei tier:

Desktop: 4 colonne (5 quando Patron è attivo, 6 quando Curators' Circle è attivo)
Tablet: 2 colonne
Mobile: 1 colonna, full width

Card del tier:

* Background: var(--color-bg-elevated)
* Border: 1px solid var(--color-border)
* Padding: 32px
* Min height: 480px
* Display: flex column
* Border radius: 2px

Contenuto card:

* Top: nome tier in font mono 12px uppercase letter-spacing 0.2em, color var(--color-text-tertiary)
* Sotto: prezzo gigante font display 64px weight 300
* Sotto: descrizione tier in font Inter 14px line-height 1.6 color var(--color-text-secondary), max 4 righe
* Bottom: bottone "Add yourself" primary style, full width della card

Tier visualizzati (configurabili da admin):

Existence — €5:
A tile on the Wall. Initials, country, year. One line of your choosing. Permanent, for as long as the project exists.

Verified — €50:
Existence, plus the verification mark. Brief identity check via LinkedIn or business email. Signals to the Wall that you're real.

Founding — €500 (attivato quando totale revenue >€5K):
A highlighted tile in the upper sections of the Wall. Your full name if you wish. Featured in the "Founders" gallery. Priority consideration for future phases.

Permanent — €5,000 (attivato quando revenue >€15K):
A fixed tile in the top 100 positions of the Wall, for the lifetime of the project. Your tile cannot be displaced. Direct line to The Curators.

Patron — €25,000 (attivato quando revenue >€30K):
Everything in Permanent, plus: guaranteed invitation to the private gathering we're preparing. Travel and accommodation arranged. The Curators will be present.

Curators' Circle — €30,000 (attivato quando revenue >€100K):
A pre-commitment to what comes after. Limited to 50 places. If, when revealed, you don't want to continue — full refund.

Hover stato:

* Card border diventa var(--color-accent)
* Subtle background lift to var(--color-bg-overlay)
* Transition 300ms

### 3.6 Sezione 6 — The Curators (about)

Padding verticale: 192px desktop, 96px mobile

Layout:

* Container max-width 720px
* Allineamento centrato

Header minimal:

* Eyebrow "04 — THE CURATORS"
* Titolo "We won't tell you who we are. Not yet."
* Font display 36px desktop 28px mobile

Body:

* 4-5 paragrafi del manifesto (versione corta)
* Font Inter 18px desktop 16px mobile
* Line height 1.7
* Color var(--color-text-secondary)
* Spacing 24px tra paragrafi

Link al manifesto completo:

* "Read the full manifesto →"
* Margin top 48px

### 3.7 Sezione 7 — Press (mostrata solo quando popolata)

Logica: se l'array di press coverage in admin ha 0 entries, NON renderizzare questa sezione affatto. Quando ha 1+ entries, render.

Layout:

* Padding 96px verticale
* Container max-width 1280px

Header:

* Eyebrow "05 — COVERAGE"
* Titolo "As covered in"

Grid loghi testate:

* Grid auto-fill 200px column desktop, 150px mobile
* Gap 64px
* Loghi monocromatici (svg preferito), filter grayscale brightness 0.7
* Hover: brightness 1, transition 300ms

Quote selezionate (opzionale, 1-3):

* Sotto i loghi
* Format: quote font display italic 28px, attribution font mono 11px uppercase
* Max width 600px per quote, centered

### 3.8 Sezione 8 — FAQ

Layout:

* Container max-width 720px
* Padding 96px verticale

Header:

* "Questions" — non "FAQ"
* Font display 36px

Accordion items:

* 6 domande
* Default state: collapsed
* Click espande con animazione height 300ms ease-out
* Border bottom 1px var(--color-border) tra item
* Domanda: font Inter 18px weight 500 padding 24px 0
* Risposta: font Inter 16px color var(--color-text-secondary) line height 1.7 padding bottom 24px
* Indicatore: simbolo "+" font display 20px che ruota a "×" quando aperto

### 3.9 Sezione 9 — Footer

Layout:

* Padding 96px top 48px bottom
* Border top 1px var(--color-border)
* Container max-width 1280px

Top row (grid 4 columns desktop, 2 mobile):

Column 1 — Brand:

* "M.D." font display 32px
* "The Millionaire's Dollar" font Inter 14px color var(--color-text-secondary)
* "A project by The Curators" font mono 10px uppercase color var(--color-text-tertiary)

Column 2 — Explore:

* Heading "Explore" uppercase mono 10px
* Links: Wall, Map, Manifesto, Press

Column 3 — Legal:

* Heading "Legal"
* Links: Privacy, Terms, Contact

Column 4 — Newsletter:

* Heading "Stay informed"
* Input email + bottone "Subscribe"
* Microcopy "No spam. Occasional updates only."

Bottom row:

* Border top 1px var(--color-border) margin top 48px padding top 24px
* Sinistra: "© MMXXVI The Curators" font mono 10px
* Destra: language toggle (IT / EN)

## 4. PAGINE SECONDARIE

### 4.1 /wall — Wall completo

Stessa estetica della preview homepage, ma:

* Full screen della griglia tessere
* Header sticky con counter + filtri
* Filtri funzionanti: paese (dropdown), anno range (slider), tier (chips multi-select), ordine (newest/oldest/random)
* Infinite scroll con virtualizzazione (react-window)
* Performance: 50.000+ tile renderizzabili senza lag

### 4.2 /map — Mappa full screen

* 100vh height
* Controlli compatti in overlay
* Counter live in top center
* Stessa logica della preview ma con UI ridotta al minimo

### 4.3 /tile/[id] — Single tile page

Pagina condivisibile per ogni tessera. Layout:

* Hero centrato con la tessera ingrandita (400x400px)
* Sotto: numero, nome/iniziali, città/paese, anno, messaggio
* Sotto ancora: "Joined the Wall on [date]"
* CTA: "Add yourself" che porta a /participate
* Open Graph image generata automaticamente per ogni tessera (per share social)

Open Graph image:

* Generata via Next.js ImageResponse
* Dimensioni 1200x630
* Background nero
* La tessera renderizzata grande al centro
* Nome del progetto in basso

### 4.4 /manifesto

Long-form editoriale. Layout:

* Max width 680px centered
* Padding top 192px, padding sides 32px
* Font display 52px per titolo
* Font Inter 19px line height 1.8 per body
* Drop cap nel primo paragrafo
* Pull quotes occasionali in font display italic
* Footer minimal

### 4.5 /participate — Tier selection + checkout flow

Step 1 — Tier selection:

* Hero "Add yourself"
* Grid dei tier identica alla homepage ma con più dettaglio
* Click su tier seleziona e scrolla a step 2

Step 2 — Information form:

* Layout: container max-width 560px
* Form fields:
  * Email (required, validation real-time)
  * Display name (required, max 32 char)
  * "Show as" radio: "Initials only" / "Full name"
  * Country (required, dropdown searchable)
  * City (optional, free text)
  * Year became millionaire (optional, year picker 1950-current)
  * Personal message (optional, max 60 char, character counter)
* Form fields per tier alti (€500+):
  * Aggiunge: LinkedIn URL, business email, source of wealth (200 char)
* Form fields per tier €5K+:
  * Aggiunge: phone number per concierge contact
* Consent checkboxes (3 separati, GDPR compliant):
  * [Required] "I confirm I'm 18+ and want to add myself to The Wall"
  * [Optional] "I consent to being contacted about future phases of the project"
  * [Optional] "I want to receive the weekly newsletter"

Step 3 — Review:

* Mostra summary della tessera come apparirà
* Mostra prezzo e tier
* CTA "Continue to payment"

Step 4 — Stripe Checkout:

* Redirect to Stripe hosted checkout page
* Customize Stripe page con logo e brand colors
* Success URL: /checkout/success?session_id=XXX
* Cancel URL: /checkout/cancelled

### 4.6 /checkout/success

* Hero gigante con numero tessera assegnato
* "Welcome to the Wall, #01247"
* Link alla propria tessera
* Share buttons (Twitter, LinkedIn, generic copy link)
* Open Graph image della propria tessera già generata
* CTA secondario: "Sign up for newsletter"

### 4.7 /admin — Dashboard interna

Auth: magic link email via Supabase Auth, whitelist di email autorizzate.

Sezioni:

* Overview: revenue totale, paganti totali, breakdown per tier, grafico crescita
* Participants: tabella searchable/sortable di tutti i partecipanti
* Vetting queue: lista paganti tier alto da vettare con form per note
* Press tracker: aggiungi/edita coverage
* Wall management: highlight tile speciali, hide tile problematiche
* Email blast: composer per newsletter mass send via Resend
* Tier control: enable/disable tier in real-time

## 5. DATABASE SCHEMA (SUPABASE)

Vedi `supabase/migrations/001_initial_schema.sql` e
`supabase/migrations/002_privacy_hardening.sql` per lo schema effettivo
(già applicato al progetto live). Lo schema del PRD originale prevedeva:

```sql
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  tile_number SERIAL UNIQUE NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('existence', 'verified', 'founding', 'permanent', 'patron', 'curators_circle')),
  amount_paid_cents INTEGER NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  display_as TEXT NOT NULL CHECK (display_as IN ('initials', 'full_name')),
  country_code TEXT NOT NULL,
  city TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  year_became_millionaire INTEGER,
  personal_message TEXT,
  linkedin_url TEXT,
  business_email TEXT,
  source_of_wealth TEXT,
  phone_number TEXT,
  consent_participation BOOLEAN NOT NULL DEFAULT true,
  consent_future_contact BOOLEAN NOT NULL DEFAULT false,
  consent_newsletter BOOLEAN NOT NULL DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  removal_requested_at TIMESTAMPTZ,
  vetting_status TEXT DEFAULT 'none' CHECK (vetting_status IN ('none', 'pending', 'in_progress', 'approved', 'rejected')),
  vetting_notes JSONB DEFAULT '{}',
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,
  is_seed_participant BOOLEAN DEFAULT false
);
```

più `press_coverage`, `admin_log`, `newsletter_subscribers`,
`admin_whitelist`, la vista `public_stats`, RLS strict e funzioni edge
(`stripe-webhook`, `geocode-city`, `generate-tile-og-image`,
`send-newsletter` — implementate come Next.js API routes, vedi
`supabase/functions/README.md`).

## 6. INTEGRAZIONE STRIPE

Setup richiesto:

1. Account Stripe (test + live mode)
2. Webhook endpoint: `https://[domain]/api/stripe/webhook`
3. Stripe Checkout configuration:
   * Mode: payment (not subscription)
   * Multi-currency: EUR primary
   * Allowed countries: tutti tranne sanctioned list

Implementazione: `app/api/checkout/route.ts` (creazione sessione con
metadata della tessera) + `app/api/stripe/webhook/route.ts` (verifica
firma, insert idempotente del partecipante, email di benvenuto via Resend).

## 7. ANIMAZIONI E INTERAZIONI

Filosofia: animazioni mai gratuite, sempre con scopo narrativo o feedback
funzionale. Tutto slow (300-1200ms). Mai bouncy.

* Page transitions: fade-in 400ms; loading state a barra orizzontale 1px.
* Scroll-triggered: fade-in + slide-up 20px, 1000ms,
  cubic-bezier(0.25, 0.46, 0.45, 0.94), trigger 30% visibile.
* Counter hero: 0 → valore reale in 2000ms easeOutExpo.
* Tile hover: scale 1.05, border accent, 300ms. Click: modal backdrop
  fade 200ms + content slide-up 400ms.
* Real-time: counter micro-flash accent 300ms; nuova tile scale 0→1 600ms;
  punto mappa pulse 1500ms.
* Loading: linea sweep orizzontale + skeleton shimmer 1500ms. No spinner.
* Form: focus border accent 200ms; errori fade-in 200ms; submit
  "Processing…" disabled.

## 8. MOBILE OPTIMIZATION

* Breakpoints: 640 / 768 / 1024 / 1280. Mobile-first, baseline 375px.
* Tap targets minimi 44x44px.
* Hero counter 96px su mobile; wall a 3 colonne con tile 100px; modal
  full-screen; mappa 4:3 con punti più grandi; form single column con
  input 56px e picker nativi.
* Performance: WebP, font subset + preload, code splitting aggressivo,
  Mapbox SDK lazy, target LCP <2.5s / CLS <0.1 / bundle <200KB gz.

## 9. SEO E OPEN GRAPH

* Meta base + Open Graph + Twitter Card (vedi `app/layout.tsx`).
* OG default 1200x630 generata da `app/opengraph-image.tsx` (counter live).
* OG dinamica per tessera da `app/tile/[id]/opengraph-image.tsx`.
* `app/robots.ts`: Allow /, Disallow /admin /api; `app/sitemap.ts`
  auto-genera tutte le tile pages.

## 10. ACCESSIBILITÀ

WCAG 2.1 AA minimo: contrasto >4.5:1, focus ring 2px accent-bright, skip
link, heading hierarchy, alt text, aria-label, aria-live sul counter,
label associate, keyboard navigation completa (Tab/Enter/Esc),
`prefers-reduced-motion` rispettato ovunque.

## 11. SICUREZZA E PRIVACY

* RLS strict; encryption at rest; HTTPS only; validazione email; rate
  limiting; CSRF-safe (form → API JSON same-origin).
* GDPR: cookie banner minimal, 3 consensi separati, /privacy completa,
  `/api/data-deletion` (double opt-in) per right to be forgotten.
* Bot: Turnstile invisibile (opzionale), honeypot, max 3 checkout/IP/ora,
  Stripe Radar.
* Env vars: vedi `.env.local.example`.

## 12. EMAIL TRANSACTIONAL TEMPLATES

Via Resend (`lib/emails.ts`):

* Welcome: "Welcome to the Wall, #[tile_number]" — plain text, no immagini.
* Removal: "Your tile has been removed" — plain text.
* Newsletter settimanale: shell HTML dark con titoli serif e unsubscribe.

## 13. DEPLOYMENT E CONFIGURAZIONE

* Vercel: repo GitHub, env vars, production branch main, preview su PR,
  dominio custom via Cloudflare.
* Cloudflare: DNS → Vercel, SSL Full Strict, Bot Fight Mode, Always HTTPS,
  cache bypass su /api e /admin.
* Monitoring: Vercel Analytics, Sentry free, Supabase logs, Stripe
  Dashboard, UptimeRobot.
* Backup: Supabase auto-backup giornaliero + export settimanale.

## 14. DELIVERABLES

1. ✅ Repository completo Next.js 15 App Router
2. ✅ Tutti i componenti funzionanti
3. ✅ Database schema (già applicato su Supabase, mirrored in migrations/)
4. ✅ API routes Stripe checkout + webhook
5. ✅ Logica edge functions (come API routes — vedi supabase/functions/README.md)
6. ✅ Email templates Resend
7. ✅ README con setup step-by-step
8. ✅ Mapbox style JSON custom (lib/mapbox/style.dark.json)
9. ✅ OG image generation (default + per-tile)
10. ✅ Admin dashboard con auth magic link + whitelist
11. ✅ Documentazione tecnica (docs/TECHNICAL.md)

## 15. CHECKLIST FINALE PRE-LANCIO

* [ ] Homepage render perfetta su iPhone 12, iPhone SE, Android medio
* [ ] Counter aggiornamento real-time funzionante
* [ ] Wall infinite scroll smooth con 1000+ tile mock
* [ ] Mappa renderizza 1000+ punti senza lag
* [ ] Flow di checkout completo testato end-to-end con Stripe test cards
* [ ] Email transactional arrivano e renderizzano correttamente
* [ ] Admin dashboard auth funzionante
* [ ] Privacy policy e ToS popolate
* [ ] OG images generate correttamente
* [ ] Lighthouse score >95 su desktop e mobile
* [ ] Accessibility audit zero violations critiche
* [ ] Form validation completa
* [ ] Loading states implementati
* [ ] Real-time subscriptions Supabase funzionanti
* [ ] Cookie banner GDPR compliant
* [ ] Newsletter signup funzionante
* [ ] 6 FAQ in accordion
* [ ] Manifesto page con typography editoriale
* [ ] Footer con tutti i link
* [ ] Language toggle IT/EN
* [ ] 404 page custom
* [ ] Sitemap.xml automatico

## 16. NOTE FINALI

Priorità di costruzione: setup → homepage → database/API/Stripe →
participate flow → real-time → mappa → admin → email → OG → polish.

In dubbio: minimalista, tipograficamente raffinato, più whitespace;
performance > effetto; elegant > cool.

Mai: emoji, pillole, gradient colorati, bouncy, carousel, close button
giganti, toast colorati, confetti, hero video.
