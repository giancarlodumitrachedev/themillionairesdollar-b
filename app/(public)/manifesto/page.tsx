import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Manifesto",
  description: "Why the Wall exists. A statement by The Curators.",
};

const CONTENT = {
  en: {
    title: "On the Price of Existing",
    paragraphs: [
      "Every age invents its own way of counting the rich. The Florentines had the catasto, the Gilded Age had the social register, the twentieth century had the rich list — a genre of journalism that pretends to be arithmetic. Ours has the algorithmic feed, where wealth is permanently implied and never declared, performed through objects and silences rather than stated in words.",
      "We find this dishonest. Not immoral — dishonest, which is worse, because it is boring.",
      "The Millionaire's Dollar asks for the opposite of performance. Five euros and a handful of characters: initials, a country, a year, one line. No photographs, because photographs lie professionally. No biographies, because biographies are advertisements. No follower counts, because the Wall is not a market.",
      "What remains, when you strip all of that away, is the barest possible public act: a person paying a trivial sum to enter a permanent record, saying only — I exist, and this much is true of me.",
    ],
    pullQuote: "The Wall records; it does not interpret.",
    paragraphs2: [
      "Why millionaires? Because money is the last taboo of the confessional age. People will tell strangers about their marriages, their illnesses, their childhoods — but ask them what they have, and the room goes quiet. A register of people willing to break that silence, even behind initials, is a cultural document no survey can produce.",
      "Why the honor system? Because verification at five euros would be theatre, and we dislike theatre. The Wall is exactly as honest as the people on it — which makes it, whatever else it is, an accurate portrait.",
      "Why permanent? Because deletion is the native gesture of our era, and permanence is therefore the only remaining provocation. The tile you buy today will outlive your enthusiasm for it. That is the point. A declaration that can be withdrawn at no cost is merely content.",
      "And why anonymous curators? Because the moment this project has a face, it has a marketing strategy. We prefer to remain a function: we keep the record, we tend the Wall, we count.",
      "The project has phases. This is the first, and we will not describe the others here, except to say that those on the Wall will always know before those outside it. We promise nothing further in writing — a register that over-promises becomes a brochure.",
      "Five euros. A few letters. A permanent place in an honest count. It is either the cheapest thing you will ever buy or the most expensive sentence you will ever write. We look forward to finding out which.",
    ],
    signature: "— The Curators, MMXXVI",
  },
  it: {
    title: "Sul prezzo di esistere",
    paragraphs: [
      "Ogni epoca inventa il proprio modo di contare i ricchi. I fiorentini avevano il catasto, la Gilded Age aveva il registro mondano, il Novecento ha avuto le classifiche dei patrimoni — un genere di giornalismo che finge di essere aritmetica. La nostra epoca ha il feed algoritmico, dove la ricchezza è perennemente sottintesa e mai dichiarata, recitata attraverso oggetti e silenzi invece che detta a parole.",
      "Troviamo tutto questo disonesto. Non immorale — disonesto, che è peggio, perché è noioso.",
      "The Millionaire's Dollar chiede l'opposto della recita. Cinque euro e una manciata di caratteri: iniziali, un paese, un anno, una riga. Nessuna fotografia, perché le fotografie mentono di professione. Nessuna biografia, perché le biografie sono pubblicità. Nessun conteggio di follower, perché il Muro non è un mercato.",
      "Ciò che resta, tolto tutto questo, è l'atto pubblico più nudo possibile: una persona che paga una somma irrisoria per entrare in un registro permanente, dicendo soltanto — esisto, e questo di me è vero.",
    ],
    pullQuote: "Il Muro registra; non interpreta.",
    paragraphs2: [
      "Perché i milionari? Perché il denaro è l'ultimo tabù dell'epoca confessionale. Le persone raccontano agli sconosciuti i propri matrimoni, le proprie malattie, le proprie infanzie — ma chiedete loro cosa possiedono, e la stanza ammutolisce. Un registro di persone disposte a rompere quel silenzio, anche dietro delle iniziali, è un documento culturale che nessun sondaggio può produrre.",
      "Perché l'onor system? Perché una verifica a cinque euro sarebbe teatro, e il teatro non ci piace. Il Muro è esattamente onesto quanto le persone che lo compongono — il che lo rende, qualunque altra cosa sia, un ritratto accurato.",
      "Perché permanente? Perché la cancellazione è il gesto nativo della nostra era, e la permanenza è quindi l'unica provocazione rimasta. La tessera che compri oggi sopravvivrà al tuo entusiasmo per essa. È questo il punto. Una dichiarazione ritirabile a costo zero è soltanto contenuto.",
      "E perché curatori anonimi? Perché nel momento in cui questo progetto ha un volto, ha una strategia di marketing. Preferiamo restare una funzione: custodiamo il registro, curiamo il Muro, contiamo.",
      "Il progetto ha delle fasi. Questa è la prima, e non descriveremo qui le altre, se non per dire che chi è sul Muro saprà sempre prima di chi ne è fuori. Non promettiamo altro per iscritto — un registro che promette troppo diventa una brochure.",
      "Cinque euro. Poche lettere. Un posto permanente in un conteggio onesto. È la cosa più economica che comprerai mai, oppure la frase più costosa che scriverai mai. Non vediamo l'ora di scoprire quale delle due.",
    ],
    signature: "— The Curators, MMXXVI",
  },
};

export default async function ManifestoPage() {
  const locale = await getLocale();
  const content = CONTENT[locale];

  return (
    <article className="mx-auto max-w-[680px] px-5 pb-32 pt-32 sm:px-8 lg:pt-48">
      <h1 className="font-display text-[2.5rem] font-light leading-[1.05] tracking-[-0.03em] text-primary sm:text-[3.25rem]">
        {content.title}
      </h1>

      <div className="mt-16 space-y-7">
        {content.paragraphs.map((p, i) => (
          <p
            key={i}
            className={`text-[1.0625rem] leading-[1.8] text-secondary sm:text-[1.1875rem] ${
              i === 0 ? "dropcap" : ""
            }`}
          >
            {p}
          </p>
        ))}
      </div>

      <blockquote className="my-16 border-l border-accent pl-6 font-display text-[1.75rem] font-light italic leading-[1.3] text-primary sm:text-[2rem]">
        {content.pullQuote}
      </blockquote>

      <div className="space-y-7">
        {content.paragraphs2.map((p, i) => (
          <p key={i} className="text-[1.0625rem] leading-[1.8] text-secondary sm:text-[1.1875rem]">
            {p}
          </p>
        ))}
      </div>

      <p className="mt-16 font-mono text-xs uppercase tracking-[0.2em] text-tertiary">
        {content.signature}
      </p>
    </article>
  );
}
