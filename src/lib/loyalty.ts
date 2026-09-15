import { sql, ensureSchema } from "./db";
import { createDiscount, type DiscountCode } from "./discounts";

export const LOYALTY_THRESHOLD = 2;
export const LOYALTY_DISCOUNT_PERCENT = 15;

export type LoyaltyAccount = {
  customerId: string;
  completedBookings: number;
};

function generateLoyaltyCode(): string {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LOYAAL-${suffix}`;
}

export async function getLoyaltyAccount(customerId: string): Promise<LoyaltyAccount> {
  await ensureSchema();
  const rows = await sql<{ customer_id: string; completed_bookings: number }[]>`
    SELECT customer_id, completed_bookings FROM loyalty_accounts WHERE customer_id = ${customerId}
  `;
  if (!rows[0]) return { customerId, completedBookings: 0 };
  return { customerId, completedBookings: rows[0].completed_bookings };
}

/**
 * Called when a booking is marked "Afgerond". Increments the customer's
 * completed-bookings count and, every LOYALTY_THRESHOLD bookings, creates a
 * one-time personal discount code as a reward.
 */
export async function recordCompletedBooking(customerId: string): Promise<DiscountCode | null> {
  await ensureSchema();
  const rows = await sql<{ completed_bookings: number }[]>`
    INSERT INTO loyalty_accounts (customer_id, completed_bookings, updated_at)
    VALUES (${customerId}, 1, now())
    ON CONFLICT (customer_id) DO UPDATE SET
      completed_bookings = loyalty_accounts.completed_bookings + 1,
      updated_at = now()
    RETURNING completed_bookings
  `;
  const completedBookings = rows[0].completed_bookings;

  if (completedBookings % LOYALTY_THRESHOLD !== 0) return null;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await createDiscount({
        code: generateLoyaltyCode(),
        type: "percentage",
        value: LOYALTY_DISCOUNT_PERCENT,
        description: `Trouwe-klant-korting na ${completedBookings} feestjes`,
        active: true,
        expiresAt: null,
        usageLimit: 1,
      });
    } catch {
      // Code collision (extremely unlikely) — retry with a new random code.
    }
  }
  return null;
}
