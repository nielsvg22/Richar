import { sql, ensureSchema, memoizeOnce } from "./db";
import type { Theme } from "./theme-constants";

export type { Theme } from "./theme-constants";
export { DEFAULT_CHECKLIST } from "./theme-constants";
import { DEFAULT_CHECKLIST } from "./theme-constants";

const defaultThemes: Omit<Theme, "checklist">[] = [
  {
    slug: "prinsessenfeest",
    name: "Prinsessenfeest",
    emoji: "👑",
    tagline: "Voor de jarige die zich een dag lang koningin voelt",
    description:
      "Een sprookjesachtig feest vol jurken, kronen en een heus paleisbal.",
    longDescription:
      "Van de aankleding tot de kroningsceremonie: dit feest draait om één ding, de jarige laten stralen als een échte prinses. We versieren de ruimte met zachte pastelkleuren, gouden accenten en een heus 'paleis-decor'. De kinderen maken hun eigen kroon, leren een mini-dans en sluiten af met een prinsessenparade.",
    ageRange: "4 - 8 jaar",
    vanaf: 149,
    gradient: "from-pink to-lavender-soft",
    activities: [
      "Kroon en sieraden knutselen",
      "Prinsessendans instuderen",
      "Paleisbal met muziek",
      "Fotomoment op de 'rode loper'",
    ],
    includes: [
      "Prinsessendecoratie",
      "Kronen en accessoires per kind",
      "Begeleiding door Rosa of Charlotte",
      "Klein cadeautje voor de jarige",
    ],
    featured: false,
  },
  {
    slug: "beautyfeest",
    name: "Beautyfeest",
    emoji: "💅",
    tagline: "Glitters, nagellak en een echte glamourshoot",
    description:
      "Een verwenmiddag met make-up, nagellak en een glitterfotoshoot.",
    longDescription:
      "De kinderen worden omgetoverd tot echte sterren. Met kindvriendelijke, huidvriendelijke make-up en nagellak gaan we los, gevolgd door een glamoureuze fotoshoot met een echte flitsachtergrond. Alle meiden (en jongens die willen glitteren) gaan trots naar huis.",
    ageRange: "5 - 12 jaar",
    vanaf: 199,
    gradient: "from-pink to-coral-soft",
    activities: [
      "Make-up en glitter tattoos",
      "Nagellak in eigen kleur",
      "Glamour fotoshoot",
      "Modeshow voor de ouders",
    ],
    includes: [
      "Professionele make-up sets",
      "Fotoshoot met props",
      "Themadecoratie",
      "Traktatie en cadeautje",
    ],
    featured: true,
  },
  {
    slug: "unicornfeest",
    name: "Unicornfeest",
    emoji: "🦄",
    tagline: "Een magische middag vol regenboogkleuren",
    description:
      "Unicorns, regenbogen en glitter: het meest gevraagde feest van het jaar.",
    longDescription:
      "Dit is al jaren het populairste thema. We toveren de ruimte om tot een magisch unicornlandschap met regenboogslingers, ballonnenbogen en glitterdetails. De kinderen knutselen hun eigen unicornhoorn, doen een unicorn-speurtocht en sluiten af met regenboogcupcakes.",
    ageRange: "4 - 9 jaar",
    vanaf: 199,
    gradient: "from-lavender to-pink-soft",
    activities: [
      "Unicornhoorn knutselen",
      "Regenboog-speurtocht",
      "Unicorn dansspel",
      "Versieren van cupcakes",
    ],
    includes: [
      "Unicorn thema-decoratie",
      "Ballonnenboog in regenboogkleuren",
      "Knutselmaterialen",
      "Cadeautje voor de jarige",
    ],
    featured: true,
  },
  {
    slug: "knutselfeest",
    name: "Knutselfeest",
    emoji: "🎨",
    tagline: "Voor de creatieve jarige die graag met de handen bezig is",
    description:
      "Schilderen, kleien en knutselen onder begeleiding van creatieve pro's.",
    longDescription:
      "Ieder kind gaat naar huis met een eigen kunstwerk. We werken met verf, klei, glitters en natuurlijke materialen, aangepast aan de leeftijd van de groep. Rustig, creatief en verrassend gezellig — ook voor de wat stillere kinderen.",
    ageRange: "4 - 10 jaar",
    vanaf: 149,
    gradient: "from-yellow-soft to-mint-soft",
    activities: [
      "Schilderen op canvas",
      "Klei-workshop",
      "Sieraden maken",
      "Eigen kunstwerk inlijsten",
    ],
    includes: [
      "Alle knutselmaterialen",
      "Werkschorten",
      "Begeleiding stap voor stap",
      "Cadeautje voor de jarige",
    ],
    featured: false,
  },
  {
    slug: "bakfeest",
    name: "Bakfeest",
    emoji: "🧁",
    tagline: "Cupcakes versieren, deeg kneden en samen proeven",
    description:
      "Een gezellig bakfeest waarbij de kinderen hun eigen lekkernijen maken.",
    longDescription:
      "Onder begeleiding bakken en versieren de kinderen hun eigen cupcakes en koekjes. Alles verloopt kindvriendelijk en hygiënisch, met kant-en-klaar beslag zodat er geen wachttijd is. Aan het einde neemt iedereen een doosje zelfgemaakte lekkernijen mee naar huis.",
    ageRange: "5 - 11 jaar",
    vanaf: 199,
    gradient: "from-peach to-yellow-soft",
    activities: [
      "Cupcakes versieren",
      "Koekjes bakken en decoreren",
      "Bakwedstrijdje",
      "Eigen bakdoosje samenstellen",
    ],
    includes: [
      "Alle bakbenodigdheden",
      "Bakschorten en mutsjes",
      "Decoratiemateriaal",
      "Eigen bakdoosje om mee te nemen",
    ],
    featured: false,
  },
  {
    slug: "dansfeest",
    name: "TikTok & Dansfeest",
    emoji: "💃",
    tagline: "De populairste dansjes en een heuse videoclip",
    description: "Dansen op de nieuwste TikTok-hits en een eigen videoclip maken.",
    longDescription:
      "Een energiek feest voor de jarige die graag beweegt. We leren samen de bekendste TikTok-dansjes, houden een mini-dansbattle en filmen een eigen videoclip die de kinderen mee naar huis krijgen.",
    ageRange: "6 - 12 jaar",
    vanaf: 199,
    gradient: "from-coral-soft to-lavender-soft",
    activities: [
      "TikTok-dansjes instuderen",
      "Dansbattle",
      "Videoclip opnemen",
      "Discofeest met lichteffecten",
    ],
    includes: [
      "Professionele geluidsinstallatie",
      "Dansbegeleiding",
      "Videobestand voor thuis",
      "Cadeautje voor de jarige",
    ],
    featured: true,
  },
  {
    slug: "speurtocht",
    name: "Speurtocht",
    emoji: "🔎",
    tagline: "Puzzels, aanwijzingen en een verborgen schat",
    description:
      "Een spannende speurtocht met raadsels, opdrachten en een échte schat.",
    longDescription:
      "Rosa en Charlotte bouwen een avontuurlijk verhaal rondom de speurtocht, passend bij het huis, de tuin of de gekozen locatie. De kinderen werken samen aan opdrachten en raadsels, tot ze uiteindelijk de verborgen schatkist vinden.",
    ageRange: "6 - 12 jaar",
    vanaf: 149,
    gradient: "from-mint to-yellow-soft",
    activities: [
      "Speurtocht met opdrachten",
      "Geheime code kraken",
      "Teamwork-spellen",
      "Schatkist openen",
    ],
    includes: [
      "Compleet speurtocht-script op maat",
      "Opdrachtkaarten en attributen",
      "Schatkist met verrassingen",
      "Cadeautje voor de jarige",
    ],
    featured: false,
  },
  {
    slug: "wetenschapsfeest",
    name: "Wetenschapsfeest",
    emoji: "🧪",
    tagline: "Proefjes, explosies van kleur en veel 'oooh's en 'aaah's'",
    description:
      "Een spectaculair feest vol leuke en veilige wetenschapsproefjes.",
    longDescription:
      "Van bruisende vulkanen tot zelfgemaakte slijm: dit feest zit vol verrassende, veilige proefjes die kinderen zelf mogen uitvoeren. Perfect voor de nieuwsgierige jarige die graag ontdekt hoe dingen werken.",
    ageRange: "7 - 12 jaar",
    vanaf: 199,
    gradient: "from-mint-soft to-lavender-soft",
    activities: [
      "Vulkaan laten uitbarsten",
      "Zelf slijm maken",
      "Kleurrijke chemie-proefjes",
      "Mini-diploma uitreiking",
    ],
    includes: [
      "Alle proefjesmaterialen",
      "Veiligheidsbrillen per kind",
      "Begeleiding door een 'wetenschapper'",
      "Cadeautje voor de jarige",
    ],
    featured: false,
  },
  {
    slug: "dino-feest",
    name: "Dino-feest",
    emoji: "🦖",
    tagline: "Een prehistorisch avontuur vol dinosaurussen",
    description: "Fossielen opgraven, dino-eieren zoeken en brullen als een T-rex.",
    longDescription:
      "De kamer verandert in prehistorisch landschap vol jungle-decor. De kinderen gaan op expeditie, graven fossielen op uit zand en zoeken verstopte dino-eieren. Een avontuurlijk feest, ideaal voor kleine dino-fans.",
    ageRange: "4 - 9 jaar",
    vanaf: 149,
    gradient: "from-mint to-peach-soft",
    activities: [
      "Fossielen opgraven",
      "Dino-eieren zoektocht",
      "Dino-masker knutselen",
      "Prehistorisch groepsspel",
    ],
    includes: [
      "Dino thema-decoratie",
      "Opgraafmateriaal",
      "Knutselpakket",
      "Cadeautje voor de jarige",
    ],
    featured: false,
  },
  {
    slug: "superheldenfeest",
    name: "Superheldenfeest",
    emoji: "🦸",
    tagline: "Voor de jarige die de wereld wil redden",
    description:
      "Een actiefeest met een eigen superheldenkostuum en spannende missies.",
    longDescription:
      "Elk kind wordt in dit feest een echte superheld. We maken samen een cape en masker, trainen 'superkrachten' via een parcours en sluiten af met een spannende missie om de wereld te redden.",
    ageRange: "4 - 10 jaar",
    vanaf: 149,
    gradient: "from-coral to-yellow-soft",
    activities: [
      "Cape en masker maken",
      "Superheldentraining parcours",
      "Missie uitvoeren",
      "Superheldenparade",
    ],
    includes: [
      "Superhelden-decoratie",
      "Knutselmateriaal voor kostuum",
      "Parcoursmaterialen",
      "Cadeautje voor de jarige",
    ],
    featured: true,
  },
];

const seasonalThemes: Omit<Theme, "checklist">[] = [
  {
    slug: "halloweenfeest",
    name: "Halloweenfeest",
    emoji: "🎃",
    tagline: "Griezelig gezellig, met pompoenen en spinnenwebben",
    description:
      "Een spannend Halloweenfeest vol pompoenen, griezelspelletjes en lekkere trucs.",
    longDescription:
      "De ruimte verandert in een spannend (maar niet té eng) Halloween-decor met pompoenen, spinnenwebben en sfeervolle verlichting. De kinderen pompoenen versieren, doen een griezelige speurtocht en trakteren zichzelf op een heksenbrouwsel-mocktail.",
    ageRange: "5 - 12 jaar",
    vanaf: 179,
    gradient: "from-coral to-yellow-soft",
    activities: [
      "Pompoenen versieren",
      "Griezelige speurtocht",
      "Heksenbrouwsel maken (mocktail)",
      "Verkleedmoment met fotoshoot",
    ],
    includes: [
      "Halloween thema-decoratie",
      "Pompoen-versiermateriaal",
      "Griezelscript voor de speurtocht",
      "Klein snoepzakje voor iedereen",
    ],
    featured: false,
  },
  {
    slug: "sinterklaasfeest",
    name: "Sinterklaasfeest",
    emoji: "🎁",
    tagline: "Pepernoten, surprises en spannende cadeautjes",
    description:
      "Een gezellig Sinterklaasfeest met pepernoten bakken, surprises maken en een verrassing.",
    longDescription:
      "Een knus en gezellig feest in Sinterklaassfeer. De kinderen bakken en versieren hun eigen pepernoten, knutselen een mini-surprise en sluiten af met een klein cadeautje. Perfect voor een gezellige decembermiddag.",
    ageRange: "4 - 10 jaar",
    vanaf: 179,
    gradient: "from-coral-soft to-lavender-soft",
    activities: [
      "Pepernoten bakken en versieren",
      "Mini-surprise knutselen",
      "Sinterklaas-liedjesspel",
      "Cadeautje uitpakken",
    ],
    includes: [
      "Sinterklaas thema-decoratie",
      "Bak- en knutselmaterialen",
      "Begeleiding door Rosa of Charlotte",
      "Klein cadeautje voor iedereen",
    ],
    featured: false,
  },
  {
    slug: "kerstfeest",
    name: "Kerstfeest",
    emoji: "🎄",
    tagline: "Twinkelende lichtjes en zelfgemaakte kerstversiering",
    description:
      "Een sfeervol kerstfeest met kerstboomversiering knutselen en warme chocolademelk.",
    longDescription:
      "Een winters, sfeervol feest vol twinkelende lichtjes. De kinderen knutselen hun eigen kerstversiering, versieren koekjes en genieten van warme chocolademelk met marshmallows. Een warm en gezellig feest voor de decembermaand.",
    ageRange: "4 - 11 jaar",
    vanaf: 189,
    gradient: "from-mint to-coral-soft",
    activities: [
      "Kerstversiering knutselen",
      "Kerstkoekjes versieren",
      "Warme chocolademelk-moment",
      "Kerstfotomoment",
    ],
    includes: [
      "Kerst thema-decoratie",
      "Knutsel- en versiermaterialen",
      "Warme chocolademelk voor iedereen",
      "Zelfgemaakte kerstversiering om mee te nemen",
    ],
    featured: false,
  },
  {
    slug: "zomerkampfeest",
    name: "Zomerkampfeest",
    emoji: "🏕️",
    tagline: "Buiten spelen, waterspelletjes en een zomers avontuur",
    description:
      "Een zonnig zomerkampfeest vol buitenspellen, waterspelletjes en avontuur in de tuin.",
    longDescription:
      "Een energiek buitenfeest vol zomerse spelletjes. Denk aan waterspelletjes, een survivalparcours en een echte schattenjacht in de tuin. Ideaal voor warme dagen en kinderen die graag naar buiten willen.",
    ageRange: "5 - 12 jaar",
    vanaf: 169,
    gradient: "from-mint-soft to-yellow-soft",
    activities: [
      "Waterspelletjes",
      "Survivalparcours in de tuin",
      "Zomerse schattenjacht",
      "Zelfgemaakte fruitijsjes",
    ],
    includes: [
      "Alle buitenspel-materialen",
      "Waterspellen-attributen",
      "Begeleiding door Rosa of Charlotte",
      "Verkoeling voor iedereen",
    ],
    featured: false,
  },
];

type ThemeRow = {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  long_description: string;
  age_range: string;
  vanaf: number;
  gradient: string;
  activities: string[];
  includes: string[];
  featured: boolean;
  checklist: string[];
};

function rowToTheme(row: ThemeRow): Theme {
  return {
    slug: row.slug,
    name: row.name,
    emoji: row.emoji,
    tagline: row.tagline,
    description: row.description,
    longDescription: row.long_description,
    ageRange: row.age_range,
    vanaf: row.vanaf,
    gradient: row.gradient,
    activities: row.activities,
    includes: row.includes,
    featured: row.featured,
    checklist: row.checklist,
  };
}

// Memoized per warm serverless instance — without this, every single call
// (i.e. every page render that touches themes) paid for a fresh COUNT(*)
// round-trip to the database even though seeding only ever needs to happen
// once.
const ensureSeeded = memoizeOnce("themes", async () => {
  await ensureSchema();
  const [{ count }] = await sql<{ count: string }[]>`SELECT COUNT(*)::text FROM themes`;
  if (Number(count) === 0) {
    for (let i = 0; i < defaultThemes.length; i++) {
      const t = defaultThemes[i];
      await sql`
        INSERT INTO themes (slug, name, emoji, tagline, description, long_description, age_range, vanaf, gradient, activities, includes, featured, sort_order, checklist)
        VALUES (${t.slug}, ${t.name}, ${t.emoji}, ${t.tagline}, ${t.description}, ${t.longDescription}, ${t.ageRange}, ${t.vanaf}, ${t.gradient}, ${sql.json(t.activities)}, ${sql.json(t.includes)}, ${t.featured}, ${i}, ${sql.json(DEFAULT_CHECKLIST)})
        ON CONFLICT (slug) DO NOTHING
      `;
    }
  }
  await ensureSeasonalThemesSeeded();
});

const ensureSeasonalThemesSeeded = memoizeOnce("seasonalThemes", async () => {
  const [{ max }] = await sql<{ max: number | null }[]>`SELECT MAX(sort_order) as max FROM themes`;
  const baseOrder = (max ?? -1) + 1;
  await Promise.all(
    seasonalThemes.map(
      (t, i) => sql`
        INSERT INTO themes (slug, name, emoji, tagline, description, long_description, age_range, vanaf, gradient, activities, includes, featured, sort_order, checklist)
        VALUES (${t.slug}, ${t.name}, ${t.emoji}, ${t.tagline}, ${t.description}, ${t.longDescription}, ${t.ageRange}, ${t.vanaf}, ${t.gradient}, ${sql.json(t.activities)}, ${sql.json(t.includes)}, ${t.featured}, ${baseOrder + i}, ${sql.json(DEFAULT_CHECKLIST)})
        ON CONFLICT (slug) DO NOTHING
      `
    )
  );
});

export async function getThemes(): Promise<Theme[]> {
  await ensureSeeded();
  const rows = await sql<ThemeRow[]>`SELECT * FROM themes ORDER BY sort_order ASC`;
  return rows.map(rowToTheme);
}

export async function getTheme(slug: string): Promise<Theme | undefined> {
  await ensureSeeded();
  const rows = await sql<ThemeRow[]>`SELECT * FROM themes WHERE slug = ${slug}`;
  return rows[0] ? rowToTheme(rows[0]) : undefined;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createTheme(
  data: Omit<Theme, "slug" | "checklist"> & { slug?: string; checklist?: string[] }
): Promise<Theme> {
  await ensureSeeded();
  const baseSlug = slugify(data.slug || data.name);
  let slug = baseSlug;
  let counter = 2;
  while ((await getTheme(slug)) !== undefined) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
  const [{ max }] = await sql<{ max: number | null }[]>`SELECT MAX(sort_order) as max FROM themes`;
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  ) as Omit<Theme, "slug" | "checklist"> & { checklist?: string[] };
  const theme: Theme = { checklist: DEFAULT_CHECKLIST, ...cleanData, slug };
  await sql`
    INSERT INTO themes (slug, name, emoji, tagline, description, long_description, age_range, vanaf, gradient, activities, includes, featured, sort_order, checklist)
    VALUES (${theme.slug}, ${theme.name}, ${theme.emoji}, ${theme.tagline}, ${theme.description}, ${theme.longDescription}, ${theme.ageRange}, ${theme.vanaf}, ${theme.gradient}, ${sql.json(theme.activities)}, ${sql.json(theme.includes)}, ${theme.featured}, ${(max ?? -1) + 1}, ${sql.json(theme.checklist)})
  `;
  return theme;
}

export async function updateTheme(slug: string, data: Partial<Theme>): Promise<Theme | undefined> {
  await ensureSeeded();
  const existing = await getTheme(slug);
  if (!existing) return undefined;
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
  const next: Theme = { ...existing, ...cleanData, slug: existing.slug };
  await sql`
    UPDATE themes SET
      name = ${next.name},
      emoji = ${next.emoji},
      tagline = ${next.tagline},
      description = ${next.description},
      long_description = ${next.longDescription},
      age_range = ${next.ageRange},
      vanaf = ${next.vanaf},
      gradient = ${next.gradient},
      activities = ${sql.json(next.activities)},
      includes = ${sql.json(next.includes)},
      featured = ${next.featured},
      checklist = ${sql.json(next.checklist)}
    WHERE slug = ${slug}
  `;
  return next;
}

export async function deleteTheme(slug: string): Promise<boolean> {
  await ensureSeeded();
  const result = await sql`DELETE FROM themes WHERE slug = ${slug}`;
  return result.count > 0;
}
