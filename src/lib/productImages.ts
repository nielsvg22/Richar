import { randomUUID } from "crypto";
import { sql, ensureSchema } from "./db";
import { getProductArtDataUrl } from "./productArt";

export type ProductImage = {
  id: string;
  productSlug: string;
  contentType: string;
  sortOrder: number;
};

export async function getProductImages(productSlug: string): Promise<ProductImage[]> {
  await ensureSchema();
  const rows = await sql<
    { id: string; product_slug: string; content_type: string; sort_order: number }[]
  >`
    SELECT id, product_slug, content_type, sort_order
    FROM product_images
    WHERE product_slug = ${productSlug}
    ORDER BY sort_order ASC, created_at ASC
  `;
  return rows.map((r) => ({
    id: r.id,
    productSlug: r.product_slug,
    contentType: r.content_type,
    sortOrder: r.sort_order,
  }));
}

export async function getProductImageData(
  id: string
): Promise<{ data: Buffer; contentType: string } | undefined> {
  await ensureSchema();
  const rows = await sql<{ data: Buffer; content_type: string }[]>`
    SELECT data, content_type FROM product_images WHERE id = ${id}
  `;
  if (!rows[0]) return undefined;
  return { data: rows[0].data, contentType: rows[0].content_type };
}

export async function addProductImage(
  productSlug: string,
  buffer: Buffer,
  contentType: string
): Promise<ProductImage> {
  await ensureSchema();
  const [{ next }] = await sql<{ next: number }[]>`
    SELECT COALESCE(MAX(sort_order) + 1, 0) AS next FROM product_images WHERE product_slug = ${productSlug}
  `;
  const id = randomUUID();
  await sql`
    INSERT INTO product_images (id, product_slug, content_type, data, sort_order)
    VALUES (${id}, ${productSlug}, ${contentType}, ${buffer}, ${next})
  `;
  return { id, productSlug, contentType, sortOrder: next };
}

export async function deleteProductImage(id: string): Promise<boolean> {
  await ensureSchema();
  const rows = await sql`DELETE FROM product_images WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function getProductMainImageUrl(slug: string): Promise<string> {
  const images = await getProductImages(slug);
  return images.length > 0 ? `/api/product-images/${images[0].id}` : getProductArtDataUrl(slug);
}
