import { randomUUID } from "crypto";
import { sql, ensureSchema } from "./db";

export type ThemeImage = {
  id: string;
  themeSlug: string;
  contentType: string;
  sortOrder: number;
};

export async function getThemeImages(themeSlug: string): Promise<ThemeImage[]> {
  await ensureSchema();
  const rows = await sql<{ id: string; theme_slug: string; content_type: string; sort_order: number }[]>`
    SELECT id, theme_slug, content_type, sort_order
    FROM theme_images
    WHERE theme_slug = ${themeSlug}
    ORDER BY sort_order ASC, created_at ASC
  `;
  return rows.map((r) => ({
    id: r.id,
    themeSlug: r.theme_slug,
    contentType: r.content_type,
    sortOrder: r.sort_order,
  }));
}

export async function getThemeImageData(
  id: string
): Promise<{ data: Buffer; contentType: string } | undefined> {
  await ensureSchema();
  const rows = await sql<{ data: Buffer; content_type: string }[]>`
    SELECT data, content_type FROM theme_images WHERE id = ${id}
  `;
  if (!rows[0]) return undefined;
  return { data: rows[0].data, contentType: rows[0].content_type };
}

export async function addThemeImage(
  themeSlug: string,
  buffer: Buffer,
  contentType: string
): Promise<ThemeImage> {
  await ensureSchema();
  const [{ next }] = await sql<{ next: number }[]>`
    SELECT COALESCE(MAX(sort_order) + 1, 0) AS next FROM theme_images WHERE theme_slug = ${themeSlug}
  `;
  const id = randomUUID();
  await sql`
    INSERT INTO theme_images (id, theme_slug, content_type, data, sort_order)
    VALUES (${id}, ${themeSlug}, ${contentType}, ${buffer}, ${next})
  `;
  return { id, themeSlug, contentType, sortOrder: next };
}

export async function deleteThemeImage(id: string): Promise<boolean> {
  await ensureSchema();
  const rows = await sql`DELETE FROM theme_images WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
