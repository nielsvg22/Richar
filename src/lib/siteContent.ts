import { sql, ensureSchema } from "./db";

export type ContentField = {
  key: string;
  label: string;
  group: string;
  type: "text" | "textarea";
  default: string;
};

export const CONTENT_FIELDS: ContentField[] = [
  // Homepage
  { key: "home.hero.badge", label: "Badge boven de titel", group: "Homepage", type: "text", default: "🎈 Kinderfeestjes van 4 t/m 12 jaar" },
  { key: "home.hero.title1", label: "Titel regel 1", group: "Homepage", type: "text", default: "Het leukste" },
  { key: "home.hero.title2", label: "Titel regel 2", group: "Homepage", type: "text", default: "kinderfeestje?" },
  { key: "home.hero.title3", label: "Titel regel 3 (koraal)", group: "Homepage", type: "text", default: "Dat regelen wij." },
  { key: "home.hero.subtitle", label: "Subtitel", group: "Homepage", type: "textarea", default: "Rosa & Charlotte organiseren creatieve, vrolijke en compleet verzorgde kinderfeestjes. Jij geniet van de verjaardag, wij regelen de rest." },
  { key: "home.hero.stat", label: "Statistiek onder de knoppen", group: "Homepage", type: "text", default: "500+ vrolijke feestjes georganiseerd" },
  { key: "home.themes.title", label: "Titel thema-sectie", group: "Homepage", type: "text", default: "Welk feestje past bij jouw jarige?" },
  { key: "home.about.title", label: "Titel over-ons blok", group: "Homepage", type: "text", default: "Hoi! Wij zijn Rosa & Charlotte 👋" },
  { key: "home.about.text1", label: "Over-ons alinea 1", group: "Homepage", type: "textarea", default: "Wij zijn twee enthousiaste ondernemers met één missie: van ieder kinderfeestje een herinnering maken waar kinderen én ouders nog lang over napraten." },
  { key: "home.about.text2", label: "Over-ons alinea 2", group: "Homepage", type: "textarea", default: "We vinden het geweldig om thema's te bedenken, mooie decoraties te maken en kinderen een middag vol plezier te bezorgen. En misschien wel het belangrijkste: wij vinden dat een kinderfeestje voor ouders óók leuk moet zijn." },
  { key: "home.faq.title", label: "Titel FAQ-sectie", group: "Homepage", type: "text", default: "Veelgestelde vragen" },

  // Over ons
  { key: "overons.hero.title", label: "Titel", group: "Over ons", type: "text", default: "Wij zijn Rosa & Charlotte" },
  { key: "overons.hero.text1", label: "Alinea 1", group: "Over ons", type: "textarea", default: "Wij leerden elkaar kennen tijdens het organiseren van een verjaardagsfeest voor onze eigen kinderen – en merkten al snel dat we allebei hetzelfde vonden: kinderfeestjes mogen best wat meer glans hebben, zonder dat ouders zich rot moeten organiseren." },
  { key: "overons.hero.text2", label: "Alinea 2", group: "Over ons", type: "textarea", default: "Vanuit die gedachte startten we Rosa & Charlotte Kinderfeestjes. Inmiddels hebben we honderden feestjes vol glitters, confetti en blije kindergezichten georganiseerd – en dat aantal groeit iedere maand." },
  { key: "overons.values.title", label: "Titel waarden-sectie", group: "Over ons", type: "text", default: "Waar wij voor staan" },
  { key: "overons.quote.text", label: "Citaat", group: "Over ons", type: "textarea", default: "Wij vinden dat een kinderfeestje voor ouders óók leuk moet zijn." },

  // FAQ
  { key: "faq.title", label: "Titel", group: "FAQ", type: "text", default: "Veelgestelde vragen" },
  { key: "faq.subtitle", label: "Subtitel", group: "FAQ", type: "textarea", default: "Staat je vraag er niet bij? Neem gerust contact met ons op, we helpen je graag verder." },

  // Prijzen
  { key: "prijzen.title1", label: "Titel regel 1", group: "Prijzen", type: "text", default: "Transparante prijzen," },
  { key: "prijzen.title2", label: "Titel regel 2", group: "Prijzen", type: "text", default: "geen verrassingen" },
  { key: "prijzen.subtitle", label: "Subtitel", group: "Prijzen", type: "textarea", default: "Onze pakketten zijn all-in. Wil je nog iets extra's? Dat kan altijd, met duidelijke prijzen vooraf." },
  { key: "prijzen.extras.title", label: "Titel extra's-sectie", group: "Prijzen", type: "text", default: "Extra's" },
  { key: "prijzen.extras.subtitle", label: "Subtitel extra's-sectie", group: "Prijzen", type: "text", default: "Maak je feestje nog completer met onderstaande extra's." },
];

export async function getSiteContentMap(): Promise<Record<string, string>> {
  await ensureSchema();
  const rows = await sql<{ key: string; value: string }[]>`SELECT key, value FROM site_content`;
  const overrides = new Map(rows.map((r) => [r.key, r.value]));
  const map: Record<string, string> = {};
  for (const field of CONTENT_FIELDS) {
    map[field.key] = overrides.get(field.key) ?? field.default;
  }
  return map;
}

export async function getSiteContentValue(key: string): Promise<string> {
  const field = CONTENT_FIELDS.find((f) => f.key === key);
  const fallback = field?.default ?? "";
  await ensureSchema();
  const rows = await sql<{ value: string }[]>`SELECT value FROM site_content WHERE key = ${key}`;
  return rows[0]?.value ?? fallback;
}

export async function saveSiteContent(values: Record<string, string>): Promise<void> {
  await ensureSchema();
  const validKeys = new Set(CONTENT_FIELDS.map((f) => f.key));
  for (const [key, value] of Object.entries(values)) {
    if (!validKeys.has(key)) continue;
    await sql`
      INSERT INTO site_content (key, value, updated_at)
      VALUES (${key}, ${value}, now())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
    `;
  }
}
