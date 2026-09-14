import { getBookings } from "./bookings";

const MONTH_LABELS = [
  "jan",
  "feb",
  "mrt",
  "apr",
  "mei",
  "jun",
  "jul",
  "aug",
  "sep",
  "okt",
  "nov",
  "dec",
];

export async function getMonthlyRevenue(months = 6) {
  const bookings = (await getBookings()).filter((b) => b.status !== "Geannuleerd");
  const now = new Date();

  const result: { key: string; label: string; revenue: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    result.push({ key, label: MONTH_LABELS[d.getMonth()], revenue: 0 });
  }

  const byKey = new Map(result.map((r) => [r.key, r]));
  for (const booking of bookings) {
    const d = new Date(booking.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const entry = byKey.get(key);
    if (entry) entry.revenue += booking.totalPrice;
  }

  return result;
}

export async function getRevenueByTheme(limit = 6) {
  const bookings = (await getBookings()).filter((b) => b.status !== "Geannuleerd");
  const byTheme = new Map<string, number>();

  for (const booking of bookings) {
    byTheme.set(booking.themeName, (byTheme.get(booking.themeName) ?? 0) + booking.totalPrice);
  }

  return Array.from(byTheme.entries())
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}
