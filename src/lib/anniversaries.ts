import { sql, ensureSchema } from "./db";
import type { Booking } from "./bookings";

export type AnniversaryMatch = {
  booking: Booking;
  anniversaryDate: string;
  daysUntil: number;
};

/**
 * Finds completed bookings whose party-date anniversary (this year or next,
 * whichever is soonest) falls within the given window from today. Used both
 * for the automated birthday-reminder e-mail and the "binnenkort jarig"
 * widget in the customer account.
 */
export function findUpcomingAnniversaries(
  bookings: Booking[],
  windowDays = 14,
  reference: Date = new Date()
): AnniversaryMatch[] {
  const today = new Date(reference);
  today.setHours(0, 0, 0, 0);

  const matches: AnniversaryMatch[] = [];

  for (const booking of bookings) {
    if (booking.status !== "Afgerond") continue;

    const original = new Date(booking.date);
    if (Number.isNaN(original.getTime())) continue;

    let anniversary = new Date(today.getFullYear(), original.getMonth(), original.getDate());
    if (anniversary < today) {
      anniversary = new Date(today.getFullYear() + 1, original.getMonth(), original.getDate());
    }

    const daysUntil = Math.round((anniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil >= 0 && daysUntil <= windowDays) {
      matches.push({
        booking,
        anniversaryDate: anniversary.toISOString().slice(0, 10),
        daysUntil,
      });
    }
  }

  return matches.sort((a, b) => a.daysUntil - b.daysUntil);
}

export async function wasBirthdayReminderSent(bookingId: string, year: number): Promise<boolean> {
  await ensureSchema();
  const rows = await sql`
    SELECT 1 FROM birthday_reminders_sent WHERE booking_id = ${bookingId} AND year = ${year}
  `;
  return rows.length > 0;
}

export async function markBirthdayReminderSent(bookingId: string, year: number): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO birthday_reminders_sent (booking_id, year)
    VALUES (${bookingId}, ${year})
    ON CONFLICT (booking_id, year) DO NOTHING
  `;
}
