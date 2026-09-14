import fs from "fs";
import path from "path";

export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "inventory.json");

const defaultItems: InventoryItem[] = [
  { id: "1", name: "Ballonnenboog sets", quantity: 6, unit: "sets", lowStockThreshold: 3, createdAt: new Date().toISOString() },
  { id: "2", name: "Goodiebag tassen", quantity: 40, unit: "stuks", lowStockThreshold: 15, createdAt: new Date().toISOString() },
  { id: "3", name: "Unicornhoorns (knutselset)", quantity: 20, unit: "sets", lowStockThreshold: 10, createdAt: new Date().toISOString() },
  { id: "4", name: "Glitter make-up sets", quantity: 8, unit: "sets", lowStockThreshold: 4, createdAt: new Date().toISOString() },
  { id: "5", name: "Prinsessenkronen", quantity: 15, unit: "stuks", lowStockThreshold: 6, createdAt: new Date().toISOString() },
  { id: "6", name: "Wetenschapsproefjes-kit", quantity: 3, unit: "kits", lowStockThreshold: 4, createdAt: new Date().toISOString() },
];

function ensureStore(): InventoryItem[] {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultItems, null, 2));
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as InventoryItem[];
  } catch {
    return [];
  }
}

function writeStore(items: InventoryItem[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

export function getInventory(): InventoryItem[] {
  return ensureStore().sort((a, b) => a.name.localeCompare(b.name));
}

export function createInventoryItem(data: {
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
}): InventoryItem {
  const items = ensureStore();
  const item: InventoryItem = {
    id: `${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
  items.push(item);
  writeStore(items);
  return item;
}

export function updateInventoryItem(id: string, data: Partial<InventoryItem>): InventoryItem | undefined {
  const items = ensureStore();
  const item = items.find((i) => i.id === id);
  if (!item) return undefined;
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  Object.assign(item, cleanData);
  writeStore(items);
  return item;
}

export function deleteInventoryItem(id: string): boolean {
  const items = ensureStore();
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) return false;
  writeStore(next);
  return true;
}
