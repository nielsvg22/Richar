import { randomUUID } from "crypto";
import { sql, ensureSchema } from "./db";
import { getWorkshopArtDataUrl } from "./workshopArt";

export type WorkshopImage = {
  id: string;
  workshopSlug: string;
  contentType: string;
  sortOrder: number;
};

export async function getWorkshopImages(workshopSlug: string): Promise<WorkshopImage[]> {
  await ensureSchema();
  const rows = await sql<
    { id: string; workshop_slug: string; content_type: string; sort_order: number }[]
  >`
    SELECT id, workshop_slug, content_type, sort_order
    FROM workshop_images
    WHERE workshop_slug = ${workshopSlug}
    ORDER BY sort_order ASC, created_at ASC
  `;
  return rows.map((r) => ({
    id: r.id,
    workshopSlug: r.workshop_slug,
    contentType: r.content_type,
    sortOrder: r.sort_order,
  }));
}

export async function getWorkshopImageData(
  id: string
): Promise<{ data: Buffer; contentType: string } | undefined> {
  await ensureSchema();
  const rows = await sql<{ data: Buffer; content_type: string }[]>`
    SELECT data, content_type FROM workshop_images WHERE id = ${id}
  `;
  if (!rows[0]) return undefined;
  return { data: rows[0].data, contentType: rows[0].content_type };
}

export async function addWorkshopImage(
  workshopSlug: string,
  buffer: Buffer,
  contentType: string
): Promise<WorkshopImage> {
  await ensureSchema();
  const [{ next }] = await sql<{ next: number }[]>`
    SELECT COALESCE(MAX(sort_order) + 1, 0) AS next FROM workshop_images WHERE workshop_slug = ${workshopSlug}
  `;
  const id = randomUUID();
  await sql`
    INSERT INTO workshop_images (id, workshop_slug, content_type, data, sort_order)
    VALUES (${id}, ${workshopSlug}, ${contentType}, ${buffer}, ${next})
  `;
  return { id, workshopSlug, contentType, sortOrder: next };
}

export async function deleteWorkshopImage(id: string): Promise<boolean> {
  await ensureSchema();
  const rows = await sql`DELETE FROM workshop_images WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function getWorkshopMainImageUrl(slug: string, category: string): Promise<string> {
  const images = await getWorkshopImages(slug);
  return images.length > 0 ? `/api/workshop-images/${images[0].id}` : getWorkshopArtDataUrl(slug, category);
}
