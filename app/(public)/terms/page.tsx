import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of service of The Millionaire's Dollar.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-light text-primary">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-[1.7] text-secondary">{children}</div>
    </section>
  );
}

export default async function TermsPage() {
  const locale = await getLocale();
  const it = locale === "it";

  return (
    <article className="mx-auto max-w-[680px] px-5 pb-32 pt-32 sm:px-8 lg:pt-48">
      <h1 className="font-display text-[2.5rem] font-light leading-[1.05] tracking-[-0.03em] text-primary">
        {it ? "Termini di servizio" : "Terms of Service"}
      </h1>
      <p className="mt-4 font-mono text-xs text-tertiary">
        {it ? "Ultimo aggiornamento: giugno 2026" : "Last updated: June 2026"}
      </p>

      <Section title={it ? "Il servizio" : "The service"}>
        <p>
          {it
            ? "The Millionaire's Dollar è un esperimento culturale: pagando il contributo del tier scelto, ottieni una tessera numerata sul muro digitale pubblico del progetto e un punto sulla mappa. Il progetto è un'opera editoriale e partecipativa; non è un investimento, non conferisce quote, diritti finanziari o aspettative di rendimento."
            : "The Millionaire's Dollar is a cultural experiment: by paying your chosen tier's contribution, you receive a numbered tile on the project's public digital wall and a point on its map. The project is an editorial, participatory work; it is not an investment and confers no equity, financial rights, or expectation of return."}
        </p>
      </Section>

      <Section title={it ? "Requisiti" : "Eligibility"}>
        <p>
          {it
            ? "Devi avere almeno 18 anni. La qualifica di “milionario” opera su onor system: dichiari sotto la tua responsabilità. I tier con verifica richiedono un controllo d'identità leggero, che possiamo rifiutare a nostra discrezione (con rimborso integrale in caso di rifiuto)."
            : "You must be 18 or older. “Millionaire” status operates on the honor system: you declare it on your own responsibility. Verified tiers involve a light identity check, which we may decline at our discretion (with a full refund if declined)."}
        </p>
      </Section>

      <Section title={it ? "Contenuti" : "Content"}>
        <p>
          {it
            ? "Il messaggio personale non può contenere contenuti illegali, diffamatori, odiosi, pubblicitari o dati personali di terzi. Ci riserviamo il diritto di nascondere tessere che violino queste regole, senza rimborso."
            : "Your personal message may not contain illegal, defamatory, hateful, or advertising content, or third parties' personal data. We reserve the right to hide tiles that violate these rules, without refund."}
        </p>
      </Section>

      <Section title={it ? "Pagamenti e rimborsi" : "Payments and refunds"}>
        <p>
          {it
            ? "I pagamenti sono gestiti da Stripe. I contributi non sono rimborsabili: stai acquistando un'iscrizione permanente in un registro pubblico, eseguita immediatamente. Unica eccezione: il pre-impegno “Curators' Circle”, interamente rimborsabile come descritto nella relativa offerta. La rimozione volontaria della tessera non dà diritto a rimborso."
            : "Payments are processed by Stripe. Contributions are non-refundable: you are purchasing a permanent entry in a public register, performed immediately. Single exception: the “Curators' Circle” pre-commitment, fully refundable as described in that offer. Voluntary tile removal does not entitle you to a refund."}
        </p>
      </Section>

      <Section title={it ? "Permanenza e rimozione" : "Permanence and removal"}>
        <p>
          {it
            ? "“Permanente” significa per la durata del progetto. Puoi chiedere la rimozione della tua tessera in qualsiasi momento (vedi Privacy). Ci impegniamo a mantenere il muro online, ma non garantiamo una durata minima del progetto."
            : "“Permanent” means for the lifetime of the project. You may request removal of your tile at any time (see Privacy). We commit to keeping the wall online but do not guarantee a minimum project duration."}
        </p>
      </Section>

      <Section title={it ? "Limitazione di responsabilità" : "Limitation of liability"}>
        <p>
          {it
            ? "Nella misura massima consentita dalla legge, la nostra responsabilità complessiva è limitata all'importo che hai pagato. Nulla in questi termini limita i diritti inderogabili del consumatore."
            : "To the maximum extent permitted by law, our aggregate liability is limited to the amount you paid. Nothing in these terms limits mandatory consumer rights."}
        </p>
      </Section>

      <Section title={it ? "Legge applicabile" : "Governing law"}>
        <p>
          {it
            ? "Questi termini sono regolati dalla legge italiana. Foro competente: il tribunale del luogo di residenza del consumatore, ove previsto dalla legge."
            : "These terms are governed by Italian law. Venue: the consumer's place of residence where required by law."}
        </p>
      </Section>
    </article>
  );
}
