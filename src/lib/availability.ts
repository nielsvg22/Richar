import { getBookings } from "./bookings";

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

  const result: Record<string, { count: number; full: boolean }> = {};
  for (const [date, count] of counts) {
    result[date] = { count, full: count >= MAX_BOOKINGS_PER_DAY };
  }
  return result;
}
