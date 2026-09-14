import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/session";
import { getBookingsForCustomer } from "@/lib/bookings";
import LogoutButton from "@/components/LogoutButton";
import StatusBadge from "@/components/admin/StatusBadge";
import AccountProfileCard from "@/components/AccountProfileCard";
import AccountMessageForm from "@/components/AccountMessageForm";

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
  const upcoming = bookings.filter((b) => new Date(b.date) >= now && b.status !== "Geannuleerd");

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
              {upcoming.length > 0
                ? `Jullie hebben ${upcoming.length} feestje${upcoming.length === 1 ? "" : "s"} in de planning. 🎉`
                : "Hier vind je al jullie boekingen en gegevens."}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div>
              <h2 className="font-heading text-xl font-bold">Onze feestjes samen</h2>
              <div className="mt-4 space-y-4">
                {bookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/account/boekingen/${booking.id}`}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
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
                      <span className="font-heading text-lg font-bold text-coral">
                        €{booking.totalPrice}
                      </span>
                      <StatusBadge status={booking.status} />
                    </div>
                  </Link>
                ))}

                {bookings.length === 0 && (
                  <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
                    <p className="text-3xl">🎈</p>
                    <p className="mt-3 font-semibold">Nog geen boekingen</p>
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
          </div>
        </div>
      </div>
    </section>
  );
}
