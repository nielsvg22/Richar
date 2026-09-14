import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/session";
import { getBookingsForCustomer } from "@/lib/bookings";
import StatsCard from "@/components/admin/StatsCard";
import AccountShell from "@/components/AccountShell";
import AccountBookingList from "@/components/AccountBookingList";

export const metadata: Metadata = {
  title: "Mijn account",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/inloggen");

  const bookings = getBookingsForCustomer(customer.id, customer.email);
  const now = new Date();
  const upcoming = bookings
    .filter((b) => new Date(b.date) >= now && b.status !== "Geannuleerd")
    .sort((a, b) => (a.date > b.date ? 1 : -1));
  const totalSpent = bookings
    .filter((b) => b.status !== "Geannuleerd")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const nextParty = upcoming[0];
  const daysUntilNext = nextParty
    ? Math.ceil((new Date(nextParty.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const recent = [...bookings]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3);

  return (
    <AccountShell
      name={customer.name}
      title="Overzicht"
      subtitle={
        daysUntilNext !== null
          ? daysUntilNext === 0
            ? "Jullie feestje is vandaag! 🎉"
            : `Nog ${daysUntilNext} dag${daysUntilNext === 1 ? "" : "en"} tot jullie volgende feestje.`
          : "Hier vind je al jullie boekingen en gegevens."
      }
    >
      <div className="grid gap-5 sm:grid-cols-3">
        <StatsCard
          label="Totaal geboekte feestjes"
          value={String(bookings.length)}
          emoji="🎈"
          accent="bg-lavender-soft"
        />
        <StatsCard
          label="Komende feestjes"
          value={String(upcoming.length)}
          emoji="🗓️"
          accent="bg-mint-soft"
        />
        <StatsCard
          label="Totaal besteed"
          value={`€${totalSpent.toLocaleString("nl-NL")}`}
          emoji="💶"
          accent="bg-yellow-soft"
        />
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-bold">Recente boekingen</h2>
          <Link
            href="/account/bestellingen"
            className="text-sm font-semibold text-coral hover:underline"
          >
            Bekijk alles →
          </Link>
        </div>
        <div className="mt-4">
          <AccountBookingList bookings={recent} />
        </div>
      </div>
    </AccountShell>
  );
}
