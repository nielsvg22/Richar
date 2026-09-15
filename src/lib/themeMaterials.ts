import { sql, ensureSchema } from "./db";
import type { Booking } from "./bookings";

export type ThemeMaterial = {
  itemId: string;
  quantity: number;
};

export type MaterialChecklistEntry = {
  itemId: string;
  name: string;
  unit: string;
  quantityNeeded: number;
  quantityInStock: number;
  sufficient: boolean;
};

export async function getThemeMaterials(themeSlug: string): Promise<ThemeMaterial[]> {
  await ensureSchema();
  const rows = await sql<{ inventory_item_id: string; quantity: number }[]>`
    SELECT inventory_item_id, quantity FROM theme_materials WHERE theme_slug = ${themeSlug}
  `;
  return rows.map((r) => ({ itemId: r.inventory_item_id, quantity: r.quantity }));
}

export async function setThemeMaterials(themeSlug: string, materials: ThemeMaterial[]): Promise<void> {
  await ensureSchema();
  await sql`DELETE FROM theme_materials WHERE theme_slug = ${themeSlug}`;
  for (const m of materials) {
    if (!m.itemId || m.quantity <= 0) continue;
    await sql`
      INSERT INTO theme_materials (theme_slug, inventory_item_id, quantity)
      VALUES (${themeSlug}, ${m.itemId}, ${m.quantity})
      ON CONFLICT (theme_slug, inventory_item_id) DO UPDATE SET quantity = EXCLUDED.quantity
    `;
  }
}

export async function getMaterialChecklistForBooking(
  booking: Pick<Booking, "themeSlug">
): Promise<MaterialChecklistEntry[]> {
  await ensureSchema();
  const rows = await sql<
    { item_id: string; name: string; unit: string; quantity_needed: number; quantity_in_stock: number }[]
  >`
    SELECT
      i.id AS item_id,
      i.name AS name,
      i.unit AS unit,
      tm.quantity AS quantity_needed,
      i.quantity AS quantity_in_stock
    FROM theme_materials tm
    JOIN inventory i ON i.id = tm.inventory_item_id
    WHERE tm.theme_slug = ${booking.themeSlug}
    ORDER BY i.name ASC
  `;
  return rows.map((r) => ({
    itemId: r.item_id,
    name: r.name,
    unit: r.unit,
    quantityNeeded: r.quantity_needed,
    quantityInStock: r.quantity_in_stock,
    sufficient: r.quantity_in_stock >= r.quantity_needed,
  }));
}
