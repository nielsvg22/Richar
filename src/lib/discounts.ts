import { sql, ensureSchema, memoizeOnce } from "./db";

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

type DiscountRow = {
  code: string;
  type: string;
  value: number;
  description: string;
  active: boolean;
  expires_at: Date | null;
  usage_limit: number | null;
  usage_count: number;
  created_at: Date;
};

function rowToDiscount(row: DiscountRow): DiscountCode {
  return {
    code: row.code,
    type: row.type as DiscountCode["type"],
    value: row.value,
    description: row.description,
    active: row.active,
    expiresAt: row.expires_at ? row.expires_at.toISOString() : null,
    usageLimit: row.usage_limit,
    usageCount: row.usage_count,
    createdAt: row.created_at.toISOString(),
  };
}

const ensureSeeded = memoizeOnce("discounts", async () => {
  await ensureSchema();
  const [{ count }] = await sql<{ count: string }[]>`SELECT COUNT(*)::text FROM discounts`;
  if (Number(count) === 0) {
    await sql`
      INSERT INTO discounts (code, type, value, description, active)
      VALUES ('WELKOM10', 'percentage', 10, '10% korting voor nieuwe klanten', true)
      ON CONFLICT (code) DO NOTHING
    `;
  }
});

export async function getDiscounts(): Promise<DiscountCode[]> {
  await ensureSeeded();
  const rows = await sql<DiscountRow[]>`SELECT * FROM discounts ORDER BY created_at DESC`;
  return rows.map(rowToDiscount);
}

export async function getDiscount(code: string): Promise<DiscountCode | undefined> {
  await ensureSeeded();
  const rows = await sql<DiscountRow[]>`SELECT * FROM discounts WHERE upper(code) = upper(${code})`;
  return rows[0] ? rowToDiscount(rows[0]) : undefined;
}

export async function createDiscount(data: Omit<DiscountCode, "usageCount" | "createdAt">) {
  await ensureSeeded();
  const code = data.code.toUpperCase().trim();
  if (await getDiscount(code)) {
    throw new Error("Deze kortingscode bestaat al.");
  }
  const discount: DiscountCode = { ...data, code, usageCount: 0, createdAt: new Date().toISOString() };
  await sql`
    INSERT INTO discounts (code, type, value, description, active, expires_at, usage_limit, usage_count, created_at)
    VALUES (${discount.code}, ${discount.type}, ${discount.value}, ${discount.description}, ${discount.active}, ${discount.expiresAt}, ${discount.usageLimit}, 0, ${discount.createdAt})
  `;
  return discount;
}

export async function updateDiscount(code: string, data: Partial<DiscountCode>) {
  await ensureSeeded();
  const existing = await getDiscount(code);
  if (!existing) return undefined;
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
  const next = { ...existing, ...cleanData, code: existing.code };
  await sql`
    UPDATE discounts SET
      type = ${next.type},
      value = ${next.value},
      description = ${next.description},
      active = ${next.active},
      expires_at = ${next.expiresAt},
      usage_limit = ${next.usageLimit}
    WHERE upper(code) = upper(${code})
  `;
  return next;
}

export async function deleteDiscount(code: string) {
  await ensureSeeded();
  const result = await sql`DELETE FROM discounts WHERE upper(code) = upper(${code})`;
  return result.count > 0;
}

export async function incrementDiscountUsage(code: string) {
  await ensureSeeded();
  await sql`UPDATE discounts SET usage_count = usage_count + 1 WHERE upper(code) = upper(${code})`;
}

export async function validateDiscount(
  code: string,
  subtotal: number
): Promise<{ valid: boolean; discount?: DiscountCode; amount?: number; error?: string }> {
  const discount = await getDiscount(code);
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
