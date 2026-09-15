import { sql, ensureSchema } from "./db";
import { slugify } from "./themes";
import type { Workshop } from "./workshop-constants";

export type { Workshop } from "./workshop-constants";
export { DEFAULT_INCLUDED_ITEMS } from "./workshop-constants";
import { DEFAULT_INCLUDED_ITEMS } from "./workshop-constants";

type SeedWorkshop = Omit<
  Workshop,
  "slug" | "priceFrom" | "published" | "featured" | "sortOrder" | "updatedAt"
> & {
  slug: string;
  priceFrom: number | null;
};

const placeholderWorkshops: SeedWorkshop[] = [
  {
    slug: "sieraden-workshop",
    title: "Sieraden Workshop",
    category: "Creatief",
    shortDescription:
      "Maak je eigen armbandjes, kettingen en telefoonkoorden met de leukste kralen.",
    description:
      "Onder begeleiding rijgen de kinderen hun eigen sieraden van kleurrijke kralen, bedeltjes en kwastjes. Er is voor ieder wat wils: van een simpel armbandje tot een uitgebreide ketting. Aan het einde van de workshop heeft iedereen een eigen unieke creatie om trots te dragen.",
    minAge: 6,
    maxAge: null,
    duration: "90 minuten",
    minGroupSize: 6,
    maxGroupSize: 12,
    priceFrom: null,
    whatWeDo:
      "We beginnen met het uitkiezen van kralen en kleuren, waarna iedereen aan de slag gaat met het rijgen van armbandjes, kettingen of een telefoonkoord. We sluiten af met een klein modeshow-moment waarbij iedereen zijn creatie mag laten zien.",
    includedItems: DEFAULT_INCLUDED_ITEMS,
    metaTitle: "Sieraden Workshop | Rosa & Charlotte",
    metaDescription:
      "Maak je eigen armbandjes, kettingen en telefoonkoorden tijdens de sieraden workshop van Rosa & Charlotte.",
  },
  {
    slug: "schilder-workshop",
    title: "Schilder Workshop",
    category: "Creatief",
    shortDescription: "Laat je fantasie los en maak je eigen kunstwerk op canvas.",
    description:
      "Met verf, kwasten en een leeg canvas gaan de kinderen helemaal los. We helpen op weg met een thema of laten iedereen vrij schilderen. Ieder kind gaat naar huis met een eigen, unieke schilderij dat met trots opgehangen kan worden.",
    minAge: 5,
    maxAge: null,
    duration: "90 minuten",
    minGroupSize: 6,
    maxGroupSize: 12,
    priceFrom: null,
    whatWeDo:
      "We starten met een korte uitleg en wat schildertechnieken, waarna iedereen zijn eigen canvas mag beschilderen. We begeleiden waar nodig en zorgen dat iedereen tevreden is met het eindresultaat.",
    includedItems: DEFAULT_INCLUDED_ITEMS,
    metaTitle: "Schilder Workshop | Rosa & Charlotte",
    metaDescription:
      "Laat de fantasie van je kind los tijdens de schilder workshop van Rosa & Charlotte. Eigen kunstwerk op canvas.",
  },
  {
    slug: "beauty-workshop",
    title: "Beauty Workshop",
    category: "Beauty",
    shortDescription:
      "Een gezellige middag vol nagellak, glitter, haar en echte mini-spa momenten.",
    description:
      "Deze workshop draait om verwennen en glitteren. De kinderen gaan aan de slag met huidvriendelijke nagellak, glitter tattoos en leuke haarstyles. Een echte mini-spa-ervaring, speciaal gemaakt voor kinderen.",
    minAge: 7,
    maxAge: null,
    duration: "120 minuten",
    minGroupSize: 6,
    maxGroupSize: 10,
    priceFrom: null,
    whatWeDo:
      "We beginnen met nagels lakken in de favoriete kleur, gevolgd door glitter tattoos en een leuke haarstyle. We sluiten af met een klein fotomoment zodat iedereen kan stralen.",
    includedItems: DEFAULT_INCLUDED_ITEMS,
    metaTitle: "Beauty Workshop | Rosa & Charlotte",
    metaDescription:
      "Nagellak, glitter en mini-spa momenten tijdens de beauty workshop van Rosa & Charlotte.",
  },
  {
    slug: "cupcake-workshop",
    title: "Cupcake Workshop",
    category: "Bakken",
    shortDescription:
      "Versier cupcakes met kleurrijke toppings en maak je eigen zoete creaties.",
    description:
      "Met kant-en-klare cupcakes, slagroom, kleurrijke toppings en spikkels gaan de kinderen aan de slag om hun eigen zoete kunstwerkjes te maken. Hygiënisch, kindvriendelijk en heerlijk om aan het einde van te proeven.",
    minAge: 5,
    maxAge: null,
    duration: "90 minuten",
    minGroupSize: 6,
    maxGroupSize: 12,
    priceFrom: null,
    whatWeDo:
      "Iedereen krijgt cupcakes en een selectie aan toppings, glazuur en spikkels om zelf mee te versieren. We sluiten af met een gezellig moment waarbij iedereen mag proeven van zijn eigen creatie.",
    includedItems: DEFAULT_INCLUDED_ITEMS,
    metaTitle: "Cupcake Workshop | Rosa & Charlotte",
    metaDescription:
      "Versier je eigen cupcakes tijdens de cupcake workshop van Rosa & Charlotte. Leuk voor ieder feestje.",
  },
  {
    slug: "tasjes-versieren",
    title: "Tasjes Versieren",
    category: "Creatief",
    shortDescription:
      "Ontwerp je eigen tasje met verf, patches, glitter en vrolijke accessoires.",
    description:
      "Ieder kind krijgt een eigen tasje om te versieren met textielverf, patches, glitter en andere leuke accessoires. Een creatieve workshop waarbij iedereen zijn eigen unieke tasje mee naar huis neemt.",
    minAge: 6,
    maxAge: null,
    duration: "90 minuten",
    minGroupSize: 6,
    maxGroupSize: 12,
    priceFrom: null,
    whatWeDo:
      "Na een korte uitleg over de materialen gaat iedereen zelf aan de slag met het versieren van het eigen tasje. We begeleiden bij het aanbrengen van verf en patches, tot iedereen klaar is.",
    includedItems: DEFAULT_INCLUDED_ITEMS,
    metaTitle: "Tasjes Versieren | Rosa & Charlotte",
    metaDescription:
      "Ontwerp je eigen tasje tijdens de workshop tasjes versieren van Rosa & Charlotte.",
  },
  {
    slug: "mini-glam-workshop",
    title: "Mini Glam Workshop",
    category: "Beauty",
    shortDescription:
      "Een vrolijke combinatie van haar, glitter, nagels en creatieve styling.",
    description:
      "De ultieme glam-ervaring voor kinderen: haar stylen, glitter aanbrengen en nagels lakken, allemaal in één workshop. Perfect voor wie houdt van net dat beetje extra glitter en glamour.",
    minAge: 7,
    maxAge: null,
    duration: "120 minuten",
    minGroupSize: 6,
    maxGroupSize: 10,
    priceFrom: null,
    whatWeDo:
      "We combineren haarstyling, glitter en nagellak tot een complete glam-look. Onderweg is er tijd voor muziek en een gezellige sfeer, met aan het einde een echt fotomoment.",
    includedItems: DEFAULT_INCLUDED_ITEMS,
    metaTitle: "Mini Glam Workshop | Rosa & Charlotte",
    metaDescription:
      "Haar, glitter en nagels tijdens de mini glam workshop van Rosa & Charlotte.",
  },
];

type WorkshopRow = {
  slug: string;
  title: string;
  short_description: string;
  description: string;
  category: string;
  min_age: number | null;
  max_age: number | null;
  duration: string;
  min_group_size: number | null;
  max_group_size: number | null;
  price_from: number | null;
  what_we_do: string;
  included_items: string[];
  published: boolean;
  featured: boolean;
  sort_order: number;
  meta_title: string;
  meta_description: string;
  updated_at: Date;
};

function rowToWorkshop(row: WorkshopRow): Workshop {
  return {
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    category: row.category,
    minAge: row.min_age,
    maxAge: row.max_age,
    duration: row.duration,
    minGroupSize: row.min_group_size,
    maxGroupSize: row.max_group_size,
    priceFrom: row.price_from,
    whatWeDo: row.what_we_do,
    includedItems: row.included_items,
    published: row.published,
    featured: row.featured,
    sortOrder: row.sort_order,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    updatedAt: row.updated_at.toISOString(),
  };
}

async function ensureSeeded() {
  await ensureSchema();
  const [{ count }] = await sql<{ count: string }[]>`SELECT COUNT(*)::text FROM workshops`;
  if (Number(count) === 0) {
    for (let i = 0; i < placeholderWorkshops.length; i++) {
      const w = placeholderWorkshops[i];
      await sql`
        INSERT INTO workshops (
          slug, title, short_description, description, category, min_age, max_age,
          duration, min_group_size, max_group_size, price_from, what_we_do,
          included_items, published, featured, sort_order, meta_title, meta_description
        )
        VALUES (
          ${w.slug}, ${w.title}, ${w.shortDescription}, ${w.description}, ${w.category},
          ${w.minAge}, ${w.maxAge}, ${w.duration}, ${w.minGroupSize}, ${w.maxGroupSize},
          ${w.priceFrom}, ${w.whatWeDo}, ${sql.json(w.includedItems)}, true, false, ${i},
          ${w.metaTitle}, ${w.metaDescription}
        )
        ON CONFLICT (slug) DO NOTHING
      `;
    }
  }
}

export async function getWorkshops(): Promise<Workshop[]> {
  await ensureSeeded();
  const rows = await sql<WorkshopRow[]>`SELECT * FROM workshops ORDER BY sort_order ASC`;
  return rows.map(rowToWorkshop);
}

export async function getPublishedWorkshops(): Promise<Workshop[]> {
  await ensureSeeded();
  const rows = await sql<WorkshopRow[]>`
    SELECT * FROM workshops WHERE published = true ORDER BY sort_order ASC
  `;
  return rows.map(rowToWorkshop);
}

export async function getWorkshop(slug: string): Promise<Workshop | undefined> {
  await ensureSeeded();
  const rows = await sql<WorkshopRow[]>`SELECT * FROM workshops WHERE slug = ${slug}`;
  return rows[0] ? rowToWorkshop(rows[0]) : undefined;
}

export async function getPublishedWorkshop(slug: string): Promise<Workshop | undefined> {
  const workshop = await getWorkshop(slug);
  return workshop?.published ? workshop : undefined;
}

export async function createWorkshop(
  data: Omit<Workshop, "slug" | "sortOrder" | "updatedAt"> & { slug?: string }
): Promise<Workshop> {
  await ensureSeeded();
  const baseSlug = slugify(data.slug || data.title);
  let slug = baseSlug;
  let counter = 2;
  while ((await getWorkshop(slug)) !== undefined) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
  const [{ max }] = await sql<{ max: number | null }[]>`SELECT MAX(sort_order) as max FROM workshops`;
  const workshop: Workshop = {
    ...data,
    slug,
    sortOrder: (max ?? -1) + 1,
    updatedAt: new Date().toISOString(),
  };
  await sql`
    INSERT INTO workshops (
      slug, title, short_description, description, category, min_age, max_age,
      duration, min_group_size, max_group_size, price_from, what_we_do,
      included_items, published, featured, sort_order, meta_title, meta_description
    )
    VALUES (
      ${workshop.slug}, ${workshop.title}, ${workshop.shortDescription}, ${workshop.description},
      ${workshop.category}, ${workshop.minAge}, ${workshop.maxAge}, ${workshop.duration},
      ${workshop.minGroupSize}, ${workshop.maxGroupSize}, ${workshop.priceFrom}, ${workshop.whatWeDo},
      ${sql.json(workshop.includedItems)}, ${workshop.published}, ${workshop.featured},
      ${workshop.sortOrder}, ${workshop.metaTitle}, ${workshop.metaDescription}
    )
  `;
  return workshop;
}

export async function updateWorkshop(
  slug: string,
  data: Partial<Workshop>
): Promise<Workshop | undefined> {
  await ensureSeeded();
  const existing = await getWorkshop(slug);
  if (!existing) return undefined;
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
  const next: Workshop = { ...existing, ...cleanData, slug: existing.slug };
  await sql`
    UPDATE workshops SET
      title = ${next.title},
      short_description = ${next.shortDescription},
      description = ${next.description},
      category = ${next.category},
      min_age = ${next.minAge},
      max_age = ${next.maxAge},
      duration = ${next.duration},
      min_group_size = ${next.minGroupSize},
      max_group_size = ${next.maxGroupSize},
      price_from = ${next.priceFrom},
      what_we_do = ${next.whatWeDo},
      included_items = ${sql.json(next.includedItems)},
      published = ${next.published},
      featured = ${next.featured},
      meta_title = ${next.metaTitle},
      meta_description = ${next.metaDescription},
      updated_at = now()
    WHERE slug = ${slug}
  `;
  return next;
}

export async function deleteWorkshop(slug: string): Promise<boolean> {
  await ensureSeeded();
  const result = await sql`DELETE FROM workshops WHERE slug = ${slug}`;
  return result.count > 0;
}
