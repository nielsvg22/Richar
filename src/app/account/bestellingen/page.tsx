import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/session";
import { getBookingsForCustomer } from "@/lib/bookings";
import AccountShell from "@/components/AccountShell";
import AccountBookingList from "@/components/AccountBookingList";

export const metadata: Metadata = {
  title: "Mijn boekingen",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const TABS = [
  { key: "aankomend", label: "Aankomend" },
  { key: "eerder", label: "Eerder" },
  { key: "alle", label: "Alle" },
] as const;

export default async function BestellingenPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/inloggen");

  const { tab } = await searchParams;
  const activeTab = tab === "eerder" ? "eerder" : tab === "alle" ? "alle" : "aankomend";

  const bookings = await getBookingsForCustomer(customer.id, customer.email);
  const now = new Date();
  const upcoming = bookings
    .filter((b) => new Date(b.date) >= now && b.status !== "Geannuleerd")
    .sort((a, b) => (a.date > b.date ? 1 : -1));
  const past = [...bookings]
    .filter((b) => new Date(b.date) < now || b.status === "Geannuleerd")
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const shown = activeTab === "aankomend" ? upcoming : activeTab === "eerder" ? past : bookings;

  return (
    <AccountShell
      name={customer.name}
      title="Mijn boekingen"
      subtitle={`${bookings.length} boeking${bookings.length === 1 ? "" : "en"} in totaal.`}
    >
      <div className="mb-4 flex gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.key === "aankomend" ? "/account/bestellingen" : `/account/bestellingen?tab=${t.key}`}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              activeTab === t.key ? "bg-ink text-cream" : "bg-white text-ink-soft hover:bg-mint-soft"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <AccountBookingList
        bookings={shown}
        emptyTitle={activeTab === "aankomend" ? "Geen komende feestjes" : "Nog geen boekingen"}
      />
    </AccountShell>
  );
}
