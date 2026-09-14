import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/session";
import { getBookingsForCustomer } from "@/lib/bookings";
import LogoutButton from "@/components/LogoutButton";
import StatusBadge from "@/components/admin/StatusBadge";

export const metadata: Metadata = {
  title: "Mijn account",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/inloggen");

  const bookings = getBookingsForCustomer(customer.id, customer.email);

  return (
    <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold">Hoi {customer.name.split(" ")[0]} 👋</h1>
          <p className="mt-2 text-ink-soft">Hier zie je al jullie geboekte feestjes.</p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-10 space-y-4">
        {bookings.map((booking) => (
          <Link
            key={booking.id}
            href={`/account/boekingen/${booking.id}`}
            className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-white p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
          >
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
            <div className="flex items-center gap-4">
              <span className="font-heading text-lg font-bold text-coral">
                €{booking.totalPrice}
              </span>
              <StatusBadge status={booking.status} />
            </div>
          </Link>
        ))}

        {bookings.length === 0 && (
          <div className="rounded-[2rem] bg-white p-10 text-center">
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
    </section>
  );
}
