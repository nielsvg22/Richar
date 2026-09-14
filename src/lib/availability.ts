import { getBookings } from "./bookings";
import { getBlockedDatesInMonth, isDateBlocked } from "./blockedDates";

export const MAX_BOOKINGS_PER_DAY = 2;

export function getAvailabilityForMonth(year: number, month: number) {
  const bookings = getBookings().filter((b) => b.status !== "Geannuleerd");
  const counts = new Map<string, number>();

  for (const booking of bookings) {
    const d = new Date(booking.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      counts.set(booking.date, (counts.get(booking.date) ?? 0) + 1);
    }
  }

  const blocked = getBlockedDatesInMonth(year, month);

  const result: Record<string, { count: number; full: boolean; blocked: boolean }> = {};
  for (const [date, count] of counts) {
    result[date] = { count, full: count >= MAX_BOOKINGS_PER_DAY, blocked: false };
  }
  for (const date of blocked) {
    const existing = result[date];
    result[date] = { count: existing?.count ?? 0, full: true, blocked: true };
  }

  return result;
}

export function isBookable(date: string): { bookable: boolean; reason?: string } {
  if (isDateBlocked(date)) {
    return { bookable: false, reason: "Deze datum is niet beschikbaar." };
  }
  const count = getBookings().filter(
    (b) => b.date === date && b.status !== "Geannuleerd"
  ).length;
  if (count >= MAX_BOOKINGS_PER_DAY) {
    return { bookable: false, reason: "Deze datum zit helaas al vol. Kies een andere datum." };
  }
  return { bookable: true };
}
