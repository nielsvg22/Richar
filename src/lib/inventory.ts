import { sql, ensureSchema, memoizeOnce } from "./db";

export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  createdAt: string;
};

type InventoryRow = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  low_stock_threshold: number;
  created_at: Date;
};

function rowToItem(row: InventoryRow): InventoryItem {
  return {
    id: row.id,
    name: row.name,
    quantity: row.quantity,
    unit: row.unit,
    lowStockThreshold: row.low_stock_threshold,
    createdAt: row.created_at.toISOString(),
  };
}

const defaultItems = [
  { name: "Ballonnenboog sets", quantity: 6, unit: "sets", lowStockThreshold: 3 },
  { name: "Goodiebag tassen", quantity: 40, unit: "stuks", lowStockThreshold: 15 },
  { name: "Unicornhoorns (knutselset)", quantity: 20, unit: "sets", lowStockThreshold: 10 },
  { name: "Glitter make-up sets", quantity: 8, unit: "sets", lowStockThreshold: 4 },
  { name: "Prinsessenkronen", quantity: 15, unit: "stuks", lowStockThreshold: 6 },
  { name: "Wetenschapsproefjes-kit", quantity: 3, unit: "kits", lowStockThreshold: 4 },
];

const ensureSeeded = memoizeOnce("inventory", async () => {
  await ensureSchema();
  const [{ count }] = await sql<{ count: string }[]>`SELECT COUNT(*)::text FROM inventory`;
  if (Number(count) === 0) {
    const baseId = Date.now();
    await Promise.all(
      defaultItems.map(
        (item, i) => sql`
          INSERT INTO inventory (id, name, quantity, unit, low_stock_threshold)
          VALUES (${String(baseId + i)}, ${item.name}, ${item.quantity}, ${item.unit}, ${item.lowStockThreshold})
        `
      )
    );
  }
});

export async function getInventory(): Promise<InventoryItem[]> {
  await ensureSeeded();
  const rows = await sql<InventoryRow[]>`SELECT * FROM inventory ORDER BY name ASC`;
  return rows.map(rowToItem);
}

export async function createInventoryItem(data: {
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
}): Promise<InventoryItem> {
  await ensureSeeded();
  const item: InventoryItem = { id: `${Date.now()}`, ...data, createdAt: new Date().toISOString() };
  await sql`
    INSERT INTO inventory (id, name, quantity, unit, low_stock_threshold, created_at)
    VALUES (${item.id}, ${item.name}, ${item.quantity}, ${item.unit}, ${item.lowStockThreshold}, ${item.createdAt})
  `;
  return item;
}

export async function updateInventoryItem(
  id: string,
  data: Partial<InventoryItem>
): Promise<InventoryItem | undefined> {
  await ensureSeeded();
  const rows = await sql<InventoryRow[]>`SELECT * FROM inventory WHERE id = ${id}`;
  if (!rows[0]) return undefined;
  const existing = rowToItem(rows[0]);
  const next = { ...existing, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)) };
  await sql`
    UPDATE inventory SET name = ${next.name}, quantity = ${next.quantity}, unit = ${next.unit}, low_stock_threshold = ${next.lowStockThreshold}
    WHERE id = ${id}
  `;
  return next;
}

export async function deleteInventoryItem(id: string): Promise<boolean> {
  await ensureSeeded();
  const result = await sql`DELETE FROM inventory WHERE id = ${id}`;
  return result.count > 0;
}
