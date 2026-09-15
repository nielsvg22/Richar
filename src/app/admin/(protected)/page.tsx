import type { Metadata } from "next";
import Link from "next/link";
import { getBookings, getAverageSatisfactionRating, type BookingStatus } from "@/lib/bookings";
import { getMonthlyRevenue, getRevenueByTheme } from "@/lib/analytics";
import StatsCard from "@/components/admin/StatsCard";
import BookingTable from "@/components/admin/BookingTable";
import RevenueChart from "@/components/admin/RevenueChart";
import ThemeRevenueChart from "@/components/admin/ThemeRevenueChart";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_FILTERS: (BookingStatus | "Alle")[] = [
  "Alle",
  "Nieuw",
  "In behandeling",
  "Bevestigd",
  "Betaald",
  "Afgerond",
  "Geannuleerd",
];

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const activeFilter =
    statusParam && STATUS_FILTERS.includes(statusParam as BookingStatus)
      ? (statusParam as BookingStatus | "Alle")
      : "Alle";

  const bookings = await getBookings();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const bookingsThisMonth = bookings.filter(
    (b) => new Date(b.date) >= startOfMonth && b.status !== "Geannuleerd"
  );
  const revenueThisMonth = bookingsThisMonth.reduce((sum, b) => sum + b.totalPrice, 0);
  const openRequests = bookings.filter(
    (b) => b.status === "Nieuw" || b.status === "In behandeling"
  ).length;
  const upcoming = bookings
    .filter((b) => new Date(b.date) >= now && b.status !== "Geannuleerd")
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  const filteredBookings =
    activeFilter === "Alle" ? bookings : bookings.filter((b) => b.status === activeFilter);

  const monthlyRevenue = await getMonthlyRevenue(6);
  const revenueByTheme = await getRevenueByTheme(6);
  const satisfaction = await getAverageSatisfactionRating();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold">
            Goedemiddag Rosa &amp; Charlotte 👋
          </h1>
          <p className="mt-2 text-ink-soft">Hier is jullie overzicht.</p>
        </div>
        <Link
          href="/admin/boekingen/nieuw"
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coral"
        >
          + Boeking toevoegen
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Boekingen deze maand"
          value={String(bookingsThisMonth.length)}
          emoji="📅"
          accent="bg-lavender-soft"
        />
        <StatsCard
          label="Omzet deze maand"
          value={`€${revenueThisMonth.toLocaleString("nl-NL")}`}
          emoji="💶"
          accent="bg-mint-soft"
        />
        <StatsCard
          label="Open aanvragen"
          value={String(openRequests)}
          emoji="📨"
          accent="bg-yellow-soft"
        />
        <StatsCard
          label="Komende feestjes"
          value={String(upcoming.length)}
          emoji="🎉"
          accent="bg-coral-soft"
        />
        <StatsCard
          label="Gemiddelde tevredenheid"
          value={satisfaction.count > 0 ? `${satisfaction.average.toFixed(1)} / 5 ⭐` : "Nog geen data"}
          emoji="💬"
          accent="bg-pink-soft"
        />
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <RevenueChart data={monthlyRevenue} />
        <ThemeRevenueChart data={revenueByTheme} />
      </div>

      <div className="mt-10">
        <h2 className="font-heading text-xl font-bold">Komende feestjes</h2>
        <div className="mt-4">
          <BookingTable bookings={upcoming} />
        </div>
      </div>

      <div className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-heading text-xl font-bold">Alle boekingen</h2>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <Link
                key={filter}
                href={filter === "Alle" ? "/admin" : `/admin?status=${encodeURIComponent(filter)}`}
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  activeFilter === filter
                    ? "bg-ink text-cream"
                    : "bg-white text-ink-soft hover:bg-mint-soft"
                }`}
              >
                {filter}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <BookingTable bookings={filteredBookings} />
        </div>
      </div>
    </div>
  );
}
