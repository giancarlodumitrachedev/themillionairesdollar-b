export type Locale = "en" | "it";

export const LOCALES: Locale[] = ["en", "it"];

const en = {
  nav: {
    wall: "The Wall",
    map: "The Map",
    manifesto: "Manifesto",
    press: "Press",
    participate: "Add yourself",
    language: "Language",
    menu: "Menu",
    close: "Close",
  },
  hero: {
    label: "MILLIONAIRES EXIST",
    subline1: "They proved it with €5",
    subline2: "You are invited to do the same",
    scroll: "Scroll",
  },
  question: {
    title: "Why would anyone pay €5 to say they exist?",
    p1: "Because nothing else is asked of them. No photograph, no biography, no performance of taste. Five euros, a handful of letters, a country, a year. The smallest possible gesture that still counts as a declaration.",
    p2: "Wealth, in our century, is everywhere implied and nowhere admitted. It hides behind holding companies and modest knitwear. The Wall reverses the etiquette: here, the only thing you can do with money is state — plainly, permanently, in public — that you have some, and that you are real.",
    p3: "Whether that gesture is vanity, irony, defiance or sincerity is not for us to decide. The Wall records; it does not interpret. Every tile is a person who, for one moment, chose to be counted.",
  },
  wall: {
    eyebrow: "01 — THE WALL",
    title: "Every tile is a person",
    subtitle: "Click any to read their reason for existing",
    viewAll: "View all {count} tiles →",
    declarations: "DECLARATIONS",
    empty: "The Wall is waiting for its first tile.",
    filters: {
      country: "Country",
      allCountries: "All countries",
      tier: "Tier",
      year: "Year",
      order: "Order",
      newest: "Newest",
      oldest: "Oldest",
      random: "Random",
      anyYear: "Any year",
    },
    joined: "Joined the Wall on {date}",
    tileNumber: "Tile",
  },
  map: {
    eyebrow: "02 — THE MAP",
    title: "Where existence has been declared",
    subtitle: "Real-time visualization of every participant",
    explore: "Explore full map →",
    legend: "= one person",
    declarations: "DECLARATIONS",
    onePerson: "one person",
  },
  tiers: {
    eyebrow: "03 — PARTICIPATE",
    title: "Choose how you want to exist",
    subtitle: "Every participation is permanent",
    cta: "Add yourself",
    soldout: "Not yet open",
    names: {
      existence: "Existence",
      verified: "Verified",
      founding: "Founding",
      permanent: "Permanent",
      patron: "Patron",
      curators_circle: "Curators' Circle",
    },
    descriptions: {
      existence:
        "A tile on the Wall. Initials, country, year. One line of your choosing. Permanent, for as long as the project exists.",
      verified:
        "Existence, plus the verification mark. Brief identity check via LinkedIn or business email. Signals to the Wall that you're real.",
      founding:
        "A highlighted tile in the upper sections of the Wall. Your full name if you wish. Featured in the “Founders” gallery. Priority consideration for future phases.",
      permanent:
        "A fixed tile in the top 100 positions of the Wall, for the lifetime of the project. Your tile cannot be displaced. Direct line to The Curators.",
      patron:
        "Everything in Permanent, plus: guaranteed invitation to the private gathering we're preparing. Travel and accommodation arranged. The Curators will be present.",
      curators_circle:
        "A pre-commitment to what comes after. Limited to 50 places. If, when revealed, you don't want to continue — full refund.",
    },
  },
  curators: {
    eyebrow: "04 — THE CURATORS",
    title: "We won't tell you who we are. Not yet.",
    p1: "The Wall does not belong to a brand, a fund, or a personality. It is maintained by a small group who prefer, for now, to remain a function rather than a face. We call ourselves The Curators because that is what we do: we keep the record.",
    p2: "We are not selling you status. Status cannot be bought for five euros — that is precisely the point. What we are building is a register of people willing to say something true in public, at a moment when truth about money is the rarest commodity of all.",
    p3: "The project has phases. This is the first. Those who are on the Wall will learn about the others before anyone else does. We will never promise more than that in writing.",
    p4: "Until then: the Wall is open, the record is permanent, and the only question that matters is whether your name — or your initials — belong on it.",
    readMore: "Read the full manifesto →",
  },
  press: {
    eyebrow: "05 — COVERAGE",
    title: "As covered in",
  },
  faq: {
    title: "Questions",
    items: [
      {
        q: "Is this real?",
        a: "Yes. Real payments, a real public wall, a real permanent record. The Millionaire's Dollar is a cultural experiment about wealth, visibility and the price of a public statement. Your tile goes up within minutes of payment and stays for the lifetime of the project.",
      },
      {
        q: "Do I actually have to be a millionaire?",
        a: "We operate on the honor system. We don't audit bank accounts at €5 — asking you to prove it would ruin the gesture. Higher tiers include a light verification step, because at those amounts the signal deserves a counter-signal.",
      },
      {
        q: "What exactly do I get?",
        a: "A numbered tile on the Wall with your initials or name, your country, optionally a city, the year, and one line of 60 characters. A point of light on the map. A permanent URL you can share. Nothing more — and nothing less.",
      },
      {
        q: "Can I remove my tile later?",
        a: "Yes, at any time, by writing to us or using the removal request on the privacy page. The tile is taken down; per our terms, contributions are not refunded. The Curators' Circle pre-commitment is the single exception — it is fully refundable.",
      },
      {
        q: "Who are The Curators?",
        a: "A small group who maintain the record and prefer to remain unnamed for now. Anonymity is not a gimmick; it keeps the Wall about the participants rather than about us. We will introduce ourselves when the project's next phase requires it.",
      },
      {
        q: "What happens next?",
        a: "The project has phases, and the Wall is the first. Participants who consented to be contacted will hear about future phases before the public does. We deliberately promise nothing specific — the record comes first.",
      },
    ],
  },
  footer: {
    brandLine: "The Millionaire's Dollar",
    byline: "A project by The Curators",
    explore: "Explore",
    legal: "Legal",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    newsletter: "Stay informed",
    newsletterPlaceholder: "Your email",
    subscribe: "Subscribe",
    subscribed: "You're in. Quietly.",
    newsletterNote: "No spam. Occasional updates only.",
    copyright: "© MMXXVI The Curators",
  },
  participate: {
    title: "Add yourself",
    intro: "Choose a tier, tell us almost nothing about yourself, and take your place on the Wall.",
    step1: "01 — Choose your tier",
    step2: "02 — Your tile",
    step3: "03 — Review",
    fields: {
      email: "Email",
      emailHint: "Receipt and tile link go here. Never shown publicly.",
      displayName: "Display name",
      displayNameHint: "Max 32 characters.",
      showAs: "Show on the Wall as",
      initialsOnly: "Initials only",
      fullName: "Full name",
      country: "Country",
      city: "City (optional)",
      year: "Year you became a millionaire (optional)",
      message: "Personal message (optional)",
      messageHint: "One line. 60 characters.",
      linkedin: "LinkedIn URL",
      businessEmail: "Business email",
      sourceOfWealth: "Source of wealth (200 characters)",
      phone: "Phone number for concierge contact",
      highTierNote: "These details are reviewed privately by The Curators. They never appear on the Wall.",
    },
    consents: {
      participation: "I confirm I'm 18+ and want to add myself to The Wall",
      futureContact: "I consent to being contacted about future phases of the project",
      newsletter: "I want to receive the weekly newsletter",
    },
    review: {
      title: "This is how you will exist",
      tier: "Tier",
      amount: "Amount",
      continue: "Continue to payment",
      processing: "Processing…",
      back: "Back",
      edit: "Edit details",
    },
    next: "Continue",
    errors: {
      email: "Enter a valid email address.",
      displayName: "A name is required (max 32 characters).",
      country: "Choose a country.",
      consent: "This confirmation is required.",
      message: "Max 60 characters.",
      year: "Enter a year between 1950 and the current year.",
      generic: "Something went wrong. Please try again.",
    },
  },
  checkout: {
    successTitle: "Welcome to the Wall,",
    successPlacing: "Your tile is being placed on the Wall…",
    successPlacingNote: "This usually takes a few seconds. The page will update by itself.",
    viewTile: "View your tile",
    share: "Share it if you wish.",
    copyLink: "Copy link",
    copied: "Copied",
    newsletterCta: "Sign up for the newsletter",
    cancelledTitle: "Nothing happened.",
    cancelledBody: "The payment was cancelled. Your declaration remains unmade — which is also a statement, of a kind.",
    backHome: "Return to the Wall",
    tryAgain: "Try again",
  },
  tile: {
    notFound: "This tile does not exist. Which is ironic.",
    joined: "Joined the Wall on {date}",
    cta: "Add yourself",
  },
  cookie: {
    text: "This site uses only essential cookies. No tracking, no ads.",
    ok: "Understood",
    more: "Privacy",
  },
  notFound: {
    title: "404 — This page does not exist.",
    body: "Unlike our participants, who paid €5 to prove otherwise.",
    back: "Return home",
  },
};

export type Dict = typeof en;

const it: Dict = {
  nav: {
    wall: "Il Muro",
    map: "La Mappa",
    manifesto: "Manifesto",
    press: "Stampa",
    participate: "Aggiungiti",
    language: "Lingua",
    menu: "Menu",
    close: "Chiudi",
  },
  hero: {
    label: "MILLIONAIRES EXIST",
    subline1: "Lo hanno dimostrato con €5",
    subline2: "Sei invitato a fare lo stesso",
    scroll: "Scroll",
  },
  question: {
    title: "Perché qualcuno dovrebbe pagare €5 per dire che esiste?",
    p1: "Perché non gli viene chiesto nient'altro. Nessuna fotografia, nessuna biografia, nessuna performance di buon gusto. Cinque euro, una manciata di lettere, un paese, un anno. Il gesto più piccolo possibile che conti ancora come una dichiarazione.",
    p2: "La ricchezza, nel nostro secolo, è ovunque sottintesa e in nessun luogo ammessa. Si nasconde dietro holding e maglieria sobria. Il Muro rovescia l'etichetta: qui l'unica cosa che puoi fare con il denaro è affermare — chiaramente, permanentemente, in pubblico — che ne possiedi, e che sei reale.",
    p3: "Se quel gesto sia vanità, ironia, sfida o sincerità non spetta a noi deciderlo. Il Muro registra; non interpreta. Ogni tessera è una persona che, per un momento, ha scelto di essere contata.",
  },
  wall: {
    eyebrow: "01 — IL MURO",
    title: "Ogni tessera è una persona",
    subtitle: "Cliccane una per leggere la sua ragione di esistere",
    viewAll: "Vedi tutte le {count} tessere →",
    declarations: "DICHIARAZIONI",
    empty: "Il Muro attende la sua prima tessera.",
    filters: {
      country: "Paese",
      allCountries: "Tutti i paesi",
      tier: "Tier",
      year: "Anno",
      order: "Ordine",
      newest: "Più recenti",
      oldest: "Più antiche",
      random: "Casuale",
      anyYear: "Qualsiasi anno",
    },
    joined: "Sul Muro dal {date}",
    tileNumber: "Tessera",
  },
  map: {
    eyebrow: "02 — LA MAPPA",
    title: "Dove l'esistenza è stata dichiarata",
    subtitle: "Visualizzazione in tempo reale di ogni partecipante",
    explore: "Esplora la mappa completa →",
    legend: "= una persona",
    declarations: "DICHIARAZIONI",
    onePerson: "una persona",
  },
  tiers: {
    eyebrow: "03 — PARTECIPA",
    title: "Scegli come vuoi esistere",
    subtitle: "Ogni partecipazione è permanente",
    cta: "Aggiungiti",
    soldout: "Non ancora aperto",
    names: {
      existence: "Existence",
      verified: "Verified",
      founding: "Founding",
      permanent: "Permanent",
      patron: "Patron",
      curators_circle: "Curators' Circle",
    },
    descriptions: {
      existence:
        "Una tessera sul Muro. Iniziali, paese, anno. Una riga a tua scelta. Permanente, finché il progetto esiste.",
      verified:
        "Existence, più il segno di verifica. Breve controllo d'identità via LinkedIn o email aziendale. Segnala al Muro che sei reale.",
      founding:
        "Una tessera in evidenza nelle sezioni alte del Muro. Il tuo nome completo, se vuoi. Presente nella galleria dei “Founders”. Considerazione prioritaria per le fasi future.",
      permanent:
        "Una tessera fissa nelle prime 100 posizioni del Muro, per tutta la vita del progetto. La tua tessera non può essere spostata. Linea diretta con The Curators.",
      patron:
        "Tutto ciò che è in Permanent, più: invito garantito al raduno privato che stiamo preparando. Viaggio e alloggio organizzati. The Curators saranno presenti.",
      curators_circle:
        "Un pre-impegno per ciò che viene dopo. Limitato a 50 posti. Se, quando sarà rivelato, non vorrai continuare — rimborso totale.",
    },
  },
  curators: {
    eyebrow: "04 — THE CURATORS",
    title: "Non vi diremo chi siamo. Non ancora.",
    p1: "Il Muro non appartiene a un brand, a un fondo o a un personaggio. È mantenuto da un piccolo gruppo che preferisce, per ora, restare una funzione piuttosto che un volto. Ci chiamiamo The Curators perché è ciò che facciamo: custodiamo il registro.",
    p2: "Non vi stiamo vendendo status. Lo status non si compra con cinque euro — è esattamente questo il punto. Stiamo costruendo un registro di persone disposte a dire qualcosa di vero in pubblico, nel momento in cui la verità sul denaro è la merce più rara di tutte.",
    p3: "Il progetto ha delle fasi. Questa è la prima. Chi è sul Muro saprà delle altre prima di chiunque altro. Non prometteremo mai più di questo per iscritto.",
    p4: "Fino ad allora: il Muro è aperto, il registro è permanente, e l'unica domanda che conta è se il tuo nome — o le tue iniziali — meritano di starci.",
    readMore: "Leggi il manifesto completo →",
  },
  press: {
    eyebrow: "05 — RASSEGNA",
    title: "Ne hanno scritto",
  },
  faq: {
    title: "Domande",
    items: [
      {
        q: "È una cosa vera?",
        a: "Sì. Pagamenti veri, un muro pubblico vero, un registro permanente vero. The Millionaire's Dollar è un esperimento culturale su ricchezza, visibilità e prezzo di una dichiarazione pubblica. La tua tessera appare pochi minuti dopo il pagamento e resta per tutta la vita del progetto.",
      },
      {
        q: "Devo essere davvero milionario?",
        a: "Funzioniamo sull'onor system. Non controlliamo i conti correnti a €5 — chiederti di dimostrarlo rovinerebbe il gesto. I tier più alti includono una verifica leggera, perché a quelle cifre il segnale merita un contro-segnale.",
      },
      {
        q: "Cosa ricevo esattamente?",
        a: "Una tessera numerata sul Muro con le tue iniziali o il tuo nome, il tuo paese, una città se vuoi, l'anno e una riga di 60 caratteri. Un punto di luce sulla mappa. Un URL permanente da condividere. Niente di più — e niente di meno.",
      },
      {
        q: "Posso rimuovere la mia tessera in seguito?",
        a: "Sì, in qualsiasi momento, scrivendoci o usando la richiesta di rimozione nella pagina privacy. La tessera viene tolta; come da termini, i contributi non sono rimborsati. Il pre-impegno del Curators' Circle è l'unica eccezione — è interamente rimborsabile.",
      },
      {
        q: "Chi sono The Curators?",
        a: "Un piccolo gruppo che mantiene il registro e preferisce, per ora, restare senza nome. L'anonimato non è un espediente; mantiene il Muro centrato sui partecipanti invece che su di noi. Ci presenteremo quando la prossima fase del progetto lo richiederà.",
      },
      {
        q: "Cosa succede dopo?",
        a: "Il progetto ha delle fasi, e il Muro è la prima. I partecipanti che hanno acconsentito a essere contattati sapranno delle fasi future prima del pubblico. Deliberatamente non promettiamo nulla di specifico — prima viene il registro.",
      },
    ],
  },
  footer: {
    brandLine: "The Millionaire's Dollar",
    byline: "A project by The Curators",
    explore: "Esplora",
    legal: "Legale",
    privacy: "Privacy",
    terms: "Termini",
    contact: "Contatto",
    newsletter: "Resta informato",
    newsletterPlaceholder: "La tua email",
    subscribe: "Iscriviti",
    subscribed: "Ci sei. In silenzio.",
    newsletterNote: "Niente spam. Solo aggiornamenti occasionali.",
    copyright: "© MMXXVI The Curators",
  },
  participate: {
    title: "Aggiungiti",
    intro: "Scegli un tier, dicci quasi nulla di te, e prendi il tuo posto sul Muro.",
    step1: "01 — Scegli il tuo tier",
    step2: "02 — La tua tessera",
    step3: "03 — Riepilogo",
    fields: {
      email: "Email",
      emailHint: "Ricevuta e link alla tessera arrivano qui. Mai mostrata pubblicamente.",
      displayName: "Nome visualizzato",
      displayNameHint: "Massimo 32 caratteri.",
      showAs: "Mostra sul Muro come",
      initialsOnly: "Solo iniziali",
      fullName: "Nome completo",
      country: "Paese",
      city: "Città (facoltativa)",
      year: "Anno in cui sei diventato milionario (facoltativo)",
      message: "Messaggio personale (facoltativo)",
      messageHint: "Una riga. 60 caratteri.",
      linkedin: "URL LinkedIn",
      businessEmail: "Email aziendale",
      sourceOfWealth: "Origine del patrimonio (200 caratteri)",
      phone: "Numero di telefono per contatto concierge",
      highTierNote: "Questi dettagli sono esaminati privatamente da The Curators. Non appaiono mai sul Muro.",
    },
    consents: {
      participation: "Confermo di avere 18+ anni e di voler aggiungermi al Muro",
      futureContact: "Acconsento a essere contattato sulle fasi future del progetto",
      newsletter: "Voglio ricevere la newsletter settimanale",
    },
    review: {
      title: "È così che esisterai",
      tier: "Tier",
      amount: "Importo",
      continue: "Procedi al pagamento",
      processing: "Elaborazione…",
      back: "Indietro",
      edit: "Modifica i dati",
    },
    next: "Continua",
    errors: {
      email: "Inserisci un indirizzo email valido.",
      displayName: "Il nome è obbligatorio (max 32 caratteri).",
      country: "Scegli un paese.",
      consent: "Questa conferma è obbligatoria.",
      message: "Massimo 60 caratteri.",
      year: "Inserisci un anno tra il 1950 e l'anno corrente.",
      generic: "Qualcosa è andato storto. Riprova.",
    },
  },
  checkout: {
    successTitle: "Benvenuto sul Muro,",
    successPlacing: "La tua tessera sta per essere posata sul Muro…",
    successPlacingNote: "Di solito richiede pochi secondi. La pagina si aggiornerà da sola.",
    viewTile: "Vedi la tua tessera",
    share: "Condividila, se vuoi.",
    copyLink: "Copia link",
    copied: "Copiato",
    newsletterCta: "Iscriviti alla newsletter",
    cancelledTitle: "Non è successo niente.",
    cancelledBody: "Il pagamento è stato annullato. La tua dichiarazione resta non fatta — che è anch'essa, a suo modo, una dichiarazione.",
    backHome: "Torna al Muro",
    tryAgain: "Riprova",
  },
  tile: {
    notFound: "Questa tessera non esiste. Il che è ironico.",
    joined: "Sul Muro dal {date}",
    cta: "Aggiungiti",
  },
  cookie: {
    text: "Questo sito usa solo cookie essenziali. Nessun tracciamento, nessuna pubblicità.",
    ok: "Ho capito",
    more: "Privacy",
  },
  notFound: {
    title: "404 — Questa pagina non esiste.",
    body: "A differenza dei nostri partecipanti, che hanno pagato €5 per dimostrare il contrario.",
    back: "Torna alla home",
  },
};

export const dictionaries: Record<Locale, Dict> = { en, it };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries.en;
}

export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
