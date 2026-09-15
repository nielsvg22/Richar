import fs from "fs";
import path from "path";
import { sql, ensureSchema, memoizeOnce } from "./db";

export type SiteImageSlot = {
  id: string;
  label: string;
  description: string;
  filename: string;
};

export const SITE_IMAGE_SLOTS: SiteImageSlot[] = [
  {
    id: "hero",
    label: "Hero-afbeelding",
    description: "Grote foto rechts bovenaan de homepage.",
    filename: "hero.jpg",
  },
  {
    id: "logo",
    label: "Logo",
    description: "Verschijnt in de navigatiebalk en de footer.",
    filename: "logo.png",
  },
  {
    id: "team-jungle-party",
    label: "Teamfoto — Jungle Party",
    description: "Gebruikt op de Over ons-pagina en homepage.",
    filename: "team-jungle-party.jpg",
  },
  {
    id: "team-office",
    label: "Teamfoto — Kantoor",
    description: "Gebruikt op de Over ons-pagina.",
    filename: "team-office.jpg",
  },
  {
    id: "workshops-hero",
    label: "Workshops — Hero-afbeelding",
    description: "Grote foto rechts bovenaan de workshops-pagina.",
    filename: "workshops-hero.jpg",
  },
];

export function getSiteImageSlot(id: string): SiteImageSlot | undefined {
  return SITE_IMAGE_SLOTS.find((slot) => slot.id === id);
}

function guessContentType(filename: string): string {
  if (filename.endsWith(".png")) return "image/png";
  if (filename.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

// Memoized per warm instance — every public page renders at least the logo
// (layout) plus its own hero/team images, so without this a single page load
// could fire off several unmemoized "is this seeded yet?" round-trips.
const ensureSeededImages = memoizeOnce("siteImages", async () => {
  await ensureSchema();
  const rows = await sql<{ slot_id: string }[]>`SELECT slot_id FROM site_images`;
  const seededIds = new Set(rows.map((r) => r.slot_id));

  await Promise.all(
    SITE_IMAGE_SLOTS.map(async (slot) => {
      if (seededIds.has(slot.id)) return;
      const filePath = path.join(process.cwd(), "public", "images", slot.filename);
      if (!fs.existsSync(filePath)) return;
      const buffer = fs.readFileSync(filePath);
      await sql`
        INSERT INTO site_images (slot_id, filename, content_type, data, updated_at)
        VALUES (${slot.id}, ${slot.filename}, ${guessContentType(slot.filename)}, ${buffer}, now())
        ON CONFLICT (slot_id) DO NOTHING
      `;
    })
  );
});

export async function siteImageExists(slot: SiteImageSlot): Promise<boolean> {
  await ensureSeededImages();
  const rows = await sql`SELECT 1 FROM site_images WHERE slot_id = ${slot.id}`;
  return rows.length > 0;
}

export async function siteImageUrl(slot: SiteImageSlot): Promise<string | null> {
  await ensureSeededImages();
  const rows = await sql<{ updated_at: Date }[]>`
    SELECT updated_at FROM site_images WHERE slot_id = ${slot.id}
  `;
  if (!rows[0]) return null;
  return `/api/site-images/${slot.id}?v=${rows[0].updated_at.getTime()}`;
}

export async function getSiteImageData(
  slotId: string
): Promise<{ data: Buffer; contentType: string } | undefined> {
  await ensureSeededImages();
  const rows = await sql<{ data: Buffer; content_type: string }[]>`
    SELECT data, content_type FROM site_images WHERE slot_id = ${slotId}
  `;
  if (!rows[0]) return undefined;
  return { data: rows[0].data, contentType: rows[0].content_type };
}

export async function saveSiteImage(slot: SiteImageSlot, buffer: Buffer, contentType: string) {
  await ensureSchema();
  await sql`
    INSERT INTO site_images (slot_id, filename, content_type, data, updated_at)
    VALUES (${slot.id}, ${slot.filename}, ${contentType}, ${buffer}, now())
    ON CONFLICT (slot_id) DO UPDATE SET
      filename = EXCLUDED.filename,
      content_type = EXCLUDED.content_type,
      data = EXCLUDED.data,
      updated_at = now()
  `;
}
