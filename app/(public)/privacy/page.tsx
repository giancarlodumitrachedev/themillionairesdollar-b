import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy of The Millionaire's Dollar.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-light text-primary">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-[1.7] text-secondary">{children}</div>
    </section>
  );
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const it = locale === "it";

  return (
    <article className="mx-auto max-w-[680px] px-5 pb-32 pt-32 sm:px-8 lg:pt-48">
      <h1 className="font-display text-[2.5rem] font-light leading-[1.05] tracking-[-0.03em] text-primary">
        {it ? "Informativa sulla privacy" : "Privacy Policy"}
      </h1>
      <p className="mt-4 font-mono text-xs text-tertiary">
        {it ? "Ultimo aggiornamento: giugno 2026" : "Last updated: June 2026"}
      </p>

      <Section title={it ? "Chi siamo" : "Who we are"}>
        <p>
          {it
            ? "The Millionaire's Dollar (“il Progetto”) è gestito da The Curators. Per qualsiasi questione relativa ai dati: curators@themillionairesdollar.com."
            : "The Millionaire's Dollar (“the Project”) is operated by The Curators. For any data matter: curators@themillionairesdollar.com."}
        </p>
      </Section>

      <Section title={it ? "Quali dati raccogliamo" : "What we collect"}>
        <p>
          {it
            ? "Quando partecipi: email, nome visualizzato, paese, città (facoltativa), anno (facoltativo), messaggio personale (facoltativo), tier scelto e riferimenti di pagamento Stripe. Per i tier superiori, su base volontaria: URL LinkedIn, email aziendale, origine del patrimonio, numero di telefono."
            : "When you participate: email, display name, country, optional city, optional year, optional personal message, chosen tier, and Stripe payment references. For higher tiers, voluntarily: LinkedIn URL, business email, source of wealth, phone number."}
        </p>
        <p>
          {it
            ? "Non raccogliamo dati di tracciamento pubblicitario. Niente pixel, niente fingerprinting, niente cookie di terze parti a fini di marketing."
            : "We collect no advertising tracking data. No pixels, no fingerprinting, no third-party marketing cookies."}
        </p>
      </Section>

      <Section title={it ? "Cosa è pubblico" : "What is public"}>
        <p>
          {it
            ? "Solo la tua tessera: numero, nome o iniziali (secondo la tua scelta), paese, città se fornita, anno se fornito, messaggio se fornito. Se scegli “solo iniziali”, il nome completo non viene mai esposto pubblicamente. Email, telefono e dati di verifica non sono mai pubblici. La posizione sulla mappa è spostata casualmente di ±5 km."
            : "Only your tile: number, name or initials (your choice), country, city if provided, year if provided, message if provided. If you choose “initials only”, your full name is never publicly exposed. Email, phone and verification details are never public. Your map position is randomly offset by ±5km."}
        </p>
      </Section>

      <Section title={it ? "Base giuridica e finalità" : "Legal basis and purposes"}>
        <p>
          {it
            ? "Esecuzione del contratto (la tua tessera), consenso esplicito (contatti futuri, newsletter — caselle separate e facoltative), legittimo interesse (sicurezza e prevenzione frodi tramite Stripe Radar)."
            : "Performance of contract (your tile), explicit consent (future contact, newsletter — separate optional checkboxes), legitimate interest (security and fraud prevention via Stripe Radar)."}
        </p>
      </Section>

      <Section title={it ? "Fornitori" : "Processors"}>
        <p>
          {it
            ? "Supabase (database, EU — Irlanda), Stripe (pagamenti; non vediamo mai i dati della tua carta), Resend (email transazionali), Vercel (hosting), Cloudflare (DNS/CDN), Mapbox (mappa). Ognuno tratta i dati secondo i propri accordi DPA conformi al GDPR."
            : "Supabase (database, EU — Ireland), Stripe (payments; we never see your card data), Resend (transactional email), Vercel (hosting), Cloudflare (DNS/CDN), Mapbox (map rendering). Each processes data under GDPR-compliant DPAs."}
        </p>
      </Section>

      <Section title={it ? "Conservazione" : "Retention"}>
        <p>
          {it
            ? "La tessera è permanente per la durata del progetto, salvo tua richiesta di rimozione. I dati contabili sono conservati per gli obblighi di legge."
            : "Your tile is permanent for the lifetime of the project unless you request removal. Accounting records are retained as required by law."}
        </p>
      </Section>

      <Section title={it ? "I tuoi diritti" : "Your rights"}>
        <p>
          {it
            ? "Accesso, rettifica, cancellazione, portabilità, opposizione, reclamo all'autorità di controllo. Per rimuovere la tua tessera o cancellare i tuoi dati: scrivi a curators@themillionairesdollar.com oppure invia una richiesta POST a /api/data-deletion con la tua email — riceverai un link di conferma. La rimozione non comporta rimborso (vedi Termini)."
            : "Access, rectification, erasure, portability, objection, complaint to your supervisory authority. To remove your tile or delete your data: write to curators@themillionairesdollar.com or send a POST request to /api/data-deletion with your email — you'll receive a confirmation link. Removal does not entail a refund (see Terms)."}
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          {it
            ? "Usiamo solo cookie essenziali: la preferenza di lingua e, per gli amministratori, il cookie di sessione. Nessun consenso pubblicitario è necessario perché non c'è pubblicità."
            : "We use essential cookies only: your language preference and, for administrators, the session cookie. No advertising consent is needed because there is no advertising."}
        </p>
      </Section>
    </article>
  );
}
