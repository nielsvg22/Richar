export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  publishedAt: string;
  readingTime: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "10-ideeen-unicornfeestje",
    title: "10 ideeën voor een onvergetelijk unicornfeestje",
    description:
      "Van regenboogdecoratie tot een echte unicorn-speurtocht: dit zijn onze favoriete ideeën voor het populairste kinderfeestjesthema van het moment.",
    emoji: "🦄",
    publishedAt: "2026-03-04",
    readingTime: "5 min",
    intro:
      "Het unicornfeest is al jaren het populairste thema bij Rosa & Charlotte, en dat is niet zonder reden. Regenboogkleuren, glitters en een vleugje magie: kinderen (en eerlijk gezegd ook wijzelf) worden er vrolijk van. In dit artikel delen we tien ideeën waarmee je zelf, of samen met ons, een unicornfeest tot in de puntjes kunt aankleden.",
    sections: [
      {
        heading: "1. Een regenboogboog als blikvanger",
        paragraphs: [
          "Een ballonnenboog in regenboogkleuren is dé eyecatcher van ieder unicornfeest. Hang hem boven de ingang of als achtergrond voor de fotohoek, en je hebt in één klap een Instagram-waardige plek gecreëerd.",
        ],
      },
      {
        heading: "2. Zelfgemaakte unicornhoorns",
        paragraphs: [
          "Laat de kinderen zelf een glitterende hoorn knutselen met een hoedje van karton, glitterpapier en een elastiekje. Het is een rustige activiteit om het feest mee te openen, en iedereen gaat naar huis met een eigen kroontje.",
        ],
      },
      {
        heading: "3. Regenboogcupcakes versieren",
        paragraphs: [
          "Kant-en-klare cupcakes met gekleurd glazuur, sprinkles en eetbare sterretjes zijn altijd een succes. Zet er een paar kommetjes decoratie bij en laat de kinderen los.",
        ],
      },
      {
        heading: "4. Een unicorn-speurtocht",
        paragraphs: [
          "Verstop kleine 'magische' aanwijzingen door het huis of de tuin die samen leiden naar een schat: bijvoorbeeld een mandje met unicorn-traktaties. Dit houdt ook de wat oudere kinderen (7-9 jaar) goed betrokken.",
        ],
      },
      {
        heading: "5. Pastel in plaats van fel",
        paragraphs: [
          "Voor een net iets verfijndere look kun je kiezen voor zachte pastelkleuren in plaats van felle regenboogkleuren. Dit oogt rustiger op foto's en past ook bij een gemengde groep jongens en meisjes.",
        ],
      },
      {
        heading: "6. Muziek en een mini-dansje",
        paragraphs: [
          "Een kort, simpel dansje op een vrolijk nummer zorgt voor energie in het programma. Wij gebruiken dit vaak als overgang tussen twee rustigere activiteiten.",
        ],
      },
      {
        heading: "7. Glittertattoos",
        paragraphs: [
          "Kleine, tijdelijke glittertattoos van sterretjes en unicorns zijn een simpele, goedkope aanvulling die kinderen enorm leuk vinden en die weinig voorbereiding kost.",
        ],
      },
      {
        heading: "8. Een fotohoek met props",
        paragraphs: [
          "Zet een paar unicorn-oortjes, een hoorn op een stokje en een gekleurde achtergrond klaar. Ouders komen vaak wat eerder ophalen en maken dan graag nog een leuke foto.",
        ],
      },
      {
        heading: "9. Goodiebags met een thema",
        paragraphs: [
          "In plaats van standaard snoepzakjes kun je kiezen voor een unicorn-thema: een klein setje haarspeldjes, een mini-notitieboekje met unicorn erop, en wat glitterstickers.",
        ],
      },
      {
        heading: "10. Laat het over aan een specialist",
        paragraphs: [
          "Wil je dit allemaal zonder zelf te hoeven plannen, boodschappen en opruimen? Ons Unicornfeest-pakket neemt alle bovenstaande onderdelen uit handen, inclusief begeleiding tijdens het feest zelf.",
        ],
      },
    ],
  },
  {
    slug: "kinderfeestje-thuis-checklist",
    title: "Kinderfeestje thuis organiseren: de complete checklist",
    description:
      "Alles wat je moet regelen voor een geslaagd kinderfeestje thuis, van uitnodigingen tot opruimen, overzichtelijk op een rij.",
    emoji: "📋",
    publishedAt: "2026-02-18",
    readingTime: "6 min",
    intro:
      "Een kinderfeestje thuis organiseren lijkt eenvoudig, tot je merkt hoeveel kleine dingen er eigenlijk bij komen kijken. Om te voorkomen dat je de dag zelf nog van alles vergeet, zetten we de belangrijkste stappen voor je op een rij.",
    sections: [
      {
        heading: "4 tot 6 weken van tevoren",
        paragraphs: [
          "Kies een datum en thema, en verstuur de uitnodigingen. Houd rekening met andere verjaardagen en schoolvakanties: populaire data zijn vaak al snel volgeboekt bij professionele aanbieders.",
          "Bepaal ook meteen hoeveel kinderen er mogen komen. Voor thuisfeestjes werkt 6 tot 8 kinderen vaak het prettigst qua ruimte en overzicht.",
        ],
      },
      {
        heading: "2 weken van tevoren",
        paragraphs: [
          "Bestel of koop decoratie, verzamel materialen voor de activiteiten en maak een tijdschema: hoe laat begint het feest, wanneer is de activiteit, wanneer eten jullie taart, en hoe laat worden de kinderen weer opgehaald.",
        ],
      },
      {
        heading: "De dag zelf",
        paragraphs: [
          "Ruim de belangrijkste ruimtes op en maak plek voor de activiteit. Zet decoratie op tijd neer zodat je niet gestrest bent als de eerste gasten arriveren.",
          "Zorg voor een duidelijk startmoment: een spelletje of activiteit zodra iedereen er is, voorkomt dat de kinderen zich al vervelen voordat het 'echte' programma begint.",
        ],
      },
      {
        heading: "Vergeet deze kleine dingen niet",
        paragraphs: [
          "Een EHBO-doosje binnen handbereik, een lijstje met allergieën van de gasten, extra batterijen voor speelgoed dat dat nodig heeft, en een plek waar jassen en tassen neergelegd kunnen worden.",
        ],
      },
      {
        heading: "Na afloop",
        paragraphs: [
          "Plan tijd in om op te ruimen; dit duurt vaak langer dan je denkt. Overweeg om vooraf een vuilniszak en extra vaatwasserruimte klaar te zetten.",
        ],
      },
      {
        heading: "Of laat het gewoon aan ons over",
        paragraphs: [
          "Wil je zelf geen checklist hoeven afwerken? Rosa & Charlotte regelen decoratie, activiteit, materialen én begeleiding, gewoon bij jullie thuis. Jij hoeft alleen de uitnodigingen te versturen.",
        ],
      },
    ],
  },
  {
    slug: "wat-kost-een-kinderfeestje",
    title: "Wat kost een kinderfeestje gemiddeld in 2026?",
    description:
      "Een overzicht van de kosten van een kinderfeestje: van zelf organiseren tot een compleet verzorgd feestje, en wat je voor je geld krijgt.",
    emoji: "💶",
    publishedAt: "2026-01-22",
    readingTime: "4 min",
    intro:
      "Een van de meest gestelde vragen die we krijgen: wat kost een kinderfeestje eigenlijk? Het antwoord hangt sterk af van wat je zelf regelt en wat je uitbesteedt. Hieronder een realistisch overzicht.",
    sections: [
      {
        heading: "Zelf organiseren",
        paragraphs: [
          "Bij zelf organiseren betaal je vooral voor losse onderdelen: decoratie (€20-€50), traktaties en snacks (€20-€40), een taart (€15-€40) en eventueel een kleine activiteit of knutselpakket (€15-€30). Al met al kom je al snel op €70-€150, exclusief je eigen tijd.",
        ],
      },
      {
        heading: "Een kant-en-klaar pakket",
        paragraphs: [
          "Bij een compleet verzorgd kinderfeestje, zoals onze Mini-, Fun- en Deluxe-pakketten, betaal je voor het hele pakket: decoratie, activiteit, materialen, begeleiding en vaak een cadeautje voor de jarige.",
          "Onze prijzen liggen tussen de €149 en €299, afhankelijk van de groepsgrootte en het gekozen thema. Dat is vergelijkbaar met wat je zelf kwijt bent aan losse onderdelen, maar dan zonder de tijd en stress van het zelf regelen.",
        ],
      },
      {
        heading: "Extra's die de prijs beïnvloeden",
        paragraphs: [
          "Denk aan een grotere groep kinderen, een ballonnenboog, professionele fotografie, of een uitgebreidere thema-aankleding. Deze extra's kosten meestal tussen de €15 en €150 per stuk.",
        ],
      },
      {
        heading: "Waar let je op bij het vergelijken?",
        paragraphs: [
          "Check altijd of de prijs echt alles omvat: sommige aanbieders rekenen reiskosten of materiaalkosten apart. Bij Rosa & Charlotte is de prijs die je op de website ziet inclusief alles wat in het pakket beschreven staat, zodat je niet voor verrassingen komt te staan.",
        ],
      },
    ],
  },
  {
    slug: "beste-leeftijd-per-thema",
    title: "De beste leeftijd voor elk soort kinderfeestje",
    description:
      "Niet ieder thema past bij iedere leeftijd. Een overzicht van welke kinderfeestjes het beste aansluiten bij welke leeftijdsgroep.",
    emoji: "🎂",
    publishedAt: "2026-04-10",
    readingTime: "4 min",
    intro:
      "Een thema dat perfect werkt voor een groep van 5-jarigen, kan bij 10-jarigen juist kinderachtig overkomen (en andersom). Hieronder een handig overzicht om de juiste keuze te maken voor de leeftijd van jullie jarige.",
    sections: [
      {
        heading: "4 tot 6 jaar",
        paragraphs: [
          "Op deze leeftijd werken visuele, fantasierijke thema's het beste: denk aan het Prinsessenfeest, Unicornfeest, Dino-feest of Superheldenfeest. Kies voor korte, afwisselende activiteiten van 15-20 minuten, want de aandachtsspanne is nog beperkt.",
        ],
      },
      {
        heading: "6 tot 8 jaar",
        paragraphs: [
          "Kinderen in deze leeftijd kunnen al goed samenwerken en instructies volgen. Een Speurtocht, Knutselfeest of Bakfeest sluit hier goed op aan, net als een lichte versie van het Wetenschapsfeest.",
        ],
      },
      {
        heading: "8 tot 10 jaar",
        paragraphs: [
          "Hier zien we vaak een voorkeur voor thema's met net iets meer uitdaging of 'coolheid': het TikTok & Dansfeest, Beautyfeest en Wetenschapsfeest scoren in deze leeftijdsgroep het beste.",
        ],
      },
      {
        heading: "10 tot 12 jaar",
        paragraphs: [
          "Oudere kinderen waarderen vaak thema's die net iets serieuzer of trendier aanvoelen: denk aan een uitgebreide fotoshoot bij het Beautyfeest, of een uitdagender speurtocht met puzzels en codes.",
        ],
      },
      {
        heading: "Twijfel je nog?",
        paragraphs: [
          "Geen zorgen: bij ieder thema op onze website staat een indicatieve leeftijd vermeld, en we denken graag mee als je twijfelt tussen twee opties. Neem gerust contact op.",
        ],
      },
    ],
  },
  {
    slug: "stressvrij-kinderfeestje-tips",
    title: "5 tips om een kinderfeestje stressvrij te laten verlopen",
    description:
      "Praktische tips van Rosa & Charlotte om als ouder zelf ook te kunnen genieten van het kinderfeestje van je kind.",
    emoji: "🌿",
    publishedAt: "2026-05-02",
    readingTime: "3 min",
    intro:
      "We horen het vaak van ouders: een kinderfeestje is voor de jarige het hoogtepunt van het jaar, maar voor de ouders soms vooral stressvol. Met deze vijf tips zorg je dat jij er ook van kunt genieten.",
    sections: [
      {
        heading: "1. Beperk de groepsgrootte",
        paragraphs: [
          "Meer kinderen betekent niet automatisch een leuker feest. Een groep van 6-8 kinderen is vaak overzichtelijker te begeleiden dan een groep van 15, zeker als je het feest alleen organiseert.",
        ],
      },
      {
        heading: "2. Plan een duidelijk begin- en eindtijd",
        paragraphs: [
          "Communiceer een strak tijdstip in de uitnodiging, bijvoorbeeld van 14:00 tot 16:00. Dit voorkomt dat het feest uitloopt en dat je zelf nog uren aan het opruimen bent terwijl je eigenlijk al moe bent.",
        ],
      },
      {
        heading: "3. Vraag hulp, of huur het in",
        paragraphs: [
          "Een extra paar handen maakt een enorm verschil, of dat nu een partner, opa/oma is, of een professionele feestbegeleider. Bij Rosa & Charlotte zijn we juist voor dit moment: wij begeleiden de activiteiten, zodat jij kunt kletsen met de andere ouders of gewoon kunt relaxen.",
        ],
      },
      {
        heading: "4. Bereid de activiteit vooraf voor",
        paragraphs: [
          "Niets is stressvoller dan tijdens het feest nog op zoek moeten naar scharen, lijm of extra materiaal. Leg alles wat je nodig hebt van tevoren klaar in de volgorde van het programma.",
        ],
      },
      {
        heading: "5. Laat het idee van perfectie los",
        paragraphs: [
          "Kinderen onthouden vooral of ze plezier hebben gehad, niet of de decoratie helemaal Pinterest-waardig was. Een ontspannen sfeer werkt vaak beter dan een tot in de puntjes uitgevoerd plan.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
