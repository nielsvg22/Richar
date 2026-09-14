import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/session";
import { getBookingsForCustomer, type Booking } from "@/lib/bookings";
import LogoutButton from "@/components/LogoutButton";
import StatusBadge from "@/components/admin/StatusBadge";
import StatsCard from "@/components/admin/StatsCard";
import AccountProfileCard from "@/components/AccountProfileCard";
import AccountPasswordCard from "@/components/AccountPasswordCard";
import AccountMessageForm from "@/components/AccountMessageForm";
import PayDepositButton from "@/components/PayDepositButton";

export const metadata: Metadata = {
  title: "Mijn account",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/inloggen");

  const { tab } = await searchParams;
  const activeTab = tab === "eerder" ? "eerder" : tab === "alle" ? "alle" : "aankomend";

  const bookings = getBookingsForCustomer(customer.id, customer.email);
  const now = new Date();
  const upcoming = bookings
    .filter((b) => new Date(b.date) >= now && b.status !== "Geannuleerd")
    .sort((a, b) => (a.date > b.date ? 1 : -1));
  const past = bookings.filter((b) => new Date(b.date) < now || b.status === "Geannuleerd");
  const totalSpent = bookings
    .filter((b) => b.status !== "Geannuleerd")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const shown = activeTab === "aankomend" ? upcoming : activeTab === "eerder" ? past : bookings;

  const nextParty = upcoming[0];
  const daysUntilNext = nextParty
    ? Math.ceil((new Date(nextParty.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <section className="bg-gradient-to-b from-lavender-soft/40 to-transparent">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
              👋 Welkom terug
            </span>
            <h1 className="mt-4 font-heading text-3xl font-extrabold sm:text-4xl">
              Hoi {customer.name.split(" ")[0]}!
            </h1>
            <p className="mt-2 text-ink-soft">
              {daysUntilNext !== null
                ? daysUntilNext === 0
                  ? "Jullie feestje is vandaag! 🎉"
                  : `Nog ${daysUntilNext} dag${daysUntilNext === 1 ? "" : "en"} tot jullie volgende feestje. 🎉`
                : "Hier vind je al jullie boekingen en gegevens."}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
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

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-heading text-xl font-bold">Onze feestjes samen</h2>
                <div className="flex gap-2">
                  {(
                    [
                      { key: "aankomend", label: "Aankomend" },
                      { key: "eerder", label: "Eerder" },
                      { key: "alle", label: "Alle" },
                    ] as const
                  ).map((t) => (
                    <Link
                      key={t.key}
                      href={t.key === "aankomend" ? "/account" : `/account?tab=${t.key}`}
                      className={`rounded-full px-4 py-2 text-xs font-semibold ${
                        activeTab === t.key
                          ? "bg-ink text-cream"
                          : "bg-white text-ink-soft hover:bg-mint-soft"
                      }`}
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {shown.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}

                {shown.length === 0 && (
                  <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
                    <p className="text-3xl">🎈</p>
                    <p className="mt-3 font-semibold">
                      {activeTab === "aankomend" ? "Geen komende feestjes" : "Nog geen boekingen"}
                    </p>
                    <p className="mt-1 text-sm text-ink-soft">
                      Tijd om het eerste feestje te plannen!
                    </p>
                    <Link
                      href="/boeken"
                      className="mt-5 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coral"
                    >
                      Boek een feestje
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-soft text-lg">
                  💌
                </span>
                <div>
                  <h2 className="font-heading text-lg font-bold">Mail ons</h2>
                  <p className="text-sm text-ink-soft">
                    Vraag, wijziging of gewoon een vraag — we horen het graag.
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <AccountMessageForm name={customer.name} email={customer.email} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <AccountProfileCard
              name={customer.name}
              email={customer.email}
              phone={customer.phone ?? ""}
              memberSince={new Date(customer.createdAt).toLocaleDateString("nl-NL", {
                month: "long",
                year: "numeric",
              })}
            />
            <AccountPasswordCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/account/boekingen/${booking.id}`} className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-soft text-xl blob">
            🎈
          </span>
          <div>
            <p className="font-heading text-lg font-bold">
              {booking.themeName} — {booking.childName}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              {new Date(booking.date).toLocaleDateString("nl-NL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              {booking.time && `· ${booking.time}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-heading text-lg font-bold text-coral">€{booking.totalPrice}</span>
          <StatusBadge status={booking.status} />
        </div>
      </Link>

      {!booking.depositPaid && booking.depositAmount > 0 && booking.status !== "Geannuleerd" && (
        <div className="mt-4 border-t border-ink/10 pt-4">
          <PayDepositButton bookingId={booking.id} amount={booking.depositAmount} />
        </div>
      )}
    </div>
  );
}
