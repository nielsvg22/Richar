import fs from "fs";
import path from "path";

export type DiscountCode = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  description: string;
  active: boolean;
  expiresAt: string | null;
  usageLimit: number | null;
  usageCount: number;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "discounts.json");

const defaultDiscounts: DiscountCode[] = [
  {
    code: "WELKOM10",
    type: "percentage",
    value: 10,
    description: "10% korting voor nieuwe klanten",
    active: true,
    expiresAt: null,
    usageLimit: null,
    usageCount: 0,
    createdAt: new Date().toISOString(),
  },
];

function ensureStore(): DiscountCode[] {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultDiscounts, null, 2));
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as DiscountCode[];
  } catch {
    return [];
  }
}

function writeStore(items: DiscountCode[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

export function getDiscounts(): DiscountCode[] {
  return ensureStore();
}

export function getDiscount(code: string): DiscountCode | undefined {
  return ensureStore().find((d) => d.code.toUpperCase() === code.toUpperCase());
}

export function createDiscount(data: Omit<DiscountCode, "usageCount" | "createdAt">) {
  const items = ensureStore();
  const code = data.code.toUpperCase().trim();
  if (items.some((d) => d.code === code)) {
    throw new Error("Deze kortingscode bestaat al.");
  }
  const discount: DiscountCode = {
    ...data,
    code,
    usageCount: 0,
    createdAt: new Date().toISOString(),
  };
  items.push(discount);
  writeStore(items);
  return discount;
}

export function updateDiscount(code: string, data: Partial<DiscountCode>) {
  const items = ensureStore();
  const index = items.findIndex((d) => d.code.toUpperCase() === code.toUpperCase());
  if (index === -1) return undefined;
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  items[index] = { ...items[index], ...cleanData, code: items[index].code };
  writeStore(items);
  return items[index];
}

export function deleteDiscount(code: string) {
  const items = ensureStore();
  const next = items.filter((d) => d.code.toUpperCase() !== code.toUpperCase());
  if (next.length === items.length) return false;
  writeStore(next);
  return true;
}

export function incrementDiscountUsage(code: string) {
  const items = ensureStore();
  const item = items.find((d) => d.code.toUpperCase() === code.toUpperCase());
  if (!item) return;
  item.usageCount += 1;
  writeStore(items);
}

export function validateDiscount(
  code: string,
  subtotal: number
): { valid: boolean; discount?: DiscountCode; amount?: number; error?: string } {
  const discount = getDiscount(code);
  if (!discount) return { valid: false, error: "Deze kortingscode bestaat niet." };
  if (!discount.active) return { valid: false, error: "Deze kortingscode is niet meer actief." };
  if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
    return { valid: false, error: "Deze kortingscode is verlopen." };
  }
  if (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit) {
    return { valid: false, error: "Deze kortingscode is helaas niet meer geldig." };
  }

  const amount =
    discount.type === "percentage"
      ? Math.round((subtotal * discount.value) / 100)
      : Math.min(discount.value, subtotal);

  return { valid: true, discount, amount };
}
