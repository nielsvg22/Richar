import type { Metadata } from "next";
import Link from "next/link";
import { getBookings } from "@/lib/bookings";
import { getBlockedDates } from "@/lib/blockedDates";
import CalendarMonth from "@/components/admin/CalendarMonth";

export const metadata: Metadata = {
  title: "Agenda",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const MONTH_NAMES = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const now = new Date();

  let year = now.getFullYear();
  let month = now.getMonth();

  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    const [y, m] = monthParam.split("-").map(Number);
    year = y;
    month = m - 1;
  }

  const bookings = getBookings().filter((b) => b.status !== "Geannuleerd");
  const blockedDates = getBlockedDates();

  const prevDate = new Date(year, month - 1, 1);
  const nextDate = new Date(year, month + 1, 1);
  const prevHref = `/admin/agenda?month=${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
  const nextHref = `/admin/agenda?month=${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}`;
  const todayHref = `/admin/agenda?month=${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthBookings = bookings.filter((b) => {
    const d = new Date(b.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold">Agenda</h1>
          <p className="mt-2 text-ink-soft">
            {monthBookings.length} feestje{monthBookings.length === 1 ? "" : "s"} in{" "}
            {MONTH_NAMES[month]} {year}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={prevHref}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm hover:bg-mint-soft"
            aria-label="Vorige maand"
          >
            ←
          </Link>
          <Link
            href={todayHref}
            className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-mint-soft"
          >
            Vandaag
          </Link>
          <Link
            href={nextHref}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm hover:bg-mint-soft"
            aria-label="Volgende maand"
          >
            →
          </Link>
        </div>
      </div>

      <h2 className="mt-6 font-heading text-xl font-bold capitalize">
        {MONTH_NAMES[month]} {year}
      </h2>

      <p className="mt-2 text-xs text-ink-soft">
        Beweeg over een dag en klik op het slotje om een dag te blokkeren of deblokkeren.
      </p>

      <div className="mt-4">
        <CalendarMonth year={year} month={month} bookings={bookings} blockedDates={blockedDates} />
      </div>
    </div>
  );
}
