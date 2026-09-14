import Link from "next/link";
import type { Booking } from "@/lib/bookings";

const WEEKDAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

const STATUS_DOT: Record<Booking["status"], string> = {
  Nieuw: "bg-lavender",
  "In behandeling": "bg-yellow-500",
  Bevestigd: "bg-mint",
  Betaald: "bg-mint",
  Afgerond: "bg-ink/30",
  Geannuleerd: "bg-coral",
};

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function CalendarMonth({
  year,
  month,
  bookings,
}: {
  year: number;
  month: number; // 0-indexed
  bookings: Booking[];
}) {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const bookingsByDate = new Map<string, Booking[]>();
  for (const booking of bookings) {
    const key = booking.date;
    const list = bookingsByDate.get(key) ?? [];
    list.push(booking);
    bookingsByDate.set(key, list);
  }

  const cells: (Date | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const todayKey = toDateKey(new Date());

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
      <div className="grid grid-cols-7 border-b border-ink/10 text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {WEEKDAYS.map((day) => (
          <div key={day} className="px-3 py-3 text-center">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((date, i) => {
          if (!date) {
            return <div key={i} className="min-h-[110px] border-b border-r border-ink/5 bg-cream-soft/40" />;
          }
          const key = toDateKey(date);
          const dayBookings = bookingsByDate.get(key) ?? [];
          const isToday = key === todayKey;

          return (
            <div
              key={i}
              className="min-h-[110px] border-b border-r border-ink/5 p-2 last:border-r-0"
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                  isToday ? "bg-coral text-cream" : "text-ink-soft"
                }`}
              >
                {date.getDate()}
              </span>
              <div className="mt-1 space-y-1">
                {dayBookings.slice(0, 3).map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/admin/boekingen/${booking.id}`}
                    className="flex items-center gap-1.5 truncate rounded-lg bg-cream-soft px-1.5 py-1 text-[11px] font-medium hover:bg-mint-soft"
                    title={`${booking.themeName} · ${booking.childName}`}
                  >
                    <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${STATUS_DOT[booking.status]}`} />
                    <span className="truncate">{booking.childName}</span>
                  </Link>
                ))}
                {dayBookings.length > 3 && (
                  <p className="px-1.5 text-[11px] text-ink-soft">
                    +{dayBookings.length - 3} meer
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
