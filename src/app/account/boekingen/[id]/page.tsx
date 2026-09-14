import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getCurrentCustomer } from "@/lib/session";
import { getBooking } from "@/lib/bookings";
import { getExtra } from "@/lib/pricing";
import StatusBadge from "@/components/admin/StatusBadge";
import BookingTimeline from "@/components/BookingTimeline";
import PayDepositButton from "@/components/PayDepositButton";
import AccountShell from "@/components/AccountShell";

export const metadata: Metadata = {
  title: "Mijn boeking",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/inloggen");

  const { id } = await params;
  const booking = getBooking(id);

  const belongsToCustomer =
    booking && (booking.customerId === customer.id || booking.email.toLowerCase() === customer.email.toLowerCase());

  if (!booking || !belongsToCustomer) notFound();

  const remaining = booking.depositPaid ? booking.totalPrice - booking.depositAmount : booking.totalPrice;

  return (
    <AccountShell
      name={customer.name}
      title={`${booking.themeName} — ${booking.childName}`}
      subtitle={`Boekingsnummer ${booking.id}`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/account/bestellingen" className="text-sm font-semibold text-ink-soft hover:text-coral">
          ← Terug naar mijn boekingen
        </Link>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-coral">
          <Link href={`/draaiboek/${booking.id}`} className="hover:underline">
            📋 Draaiboek
          </Link>
          <Link href={`/account/facturen/${booking.id}`} className="hover:underline">
            🧾 Factuur
          </Link>
        </div>
      </div>

      <div className="rounded-[1.75rem] bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-ink-soft">Status van deze boeking</p>
          <StatusBadge status={booking.status} />
        </div>

        <div className="mt-6">
          <BookingTimeline status={booking.status} />
        </div>

        <div className="mt-8 grid gap-4 border-t border-ink/10 pt-6 sm:grid-cols-2">
          <Detail
            label="Datum"
            value={new Date(booking.date).toLocaleDateString("nl-NL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
          <Detail label="Tijd" value={booking.time || "-"} />
          <Detail label="Pakket" value={`${booking.packageName} (${booking.kids} kinderen)`} />
          <Detail
            label="Locatie"
            value={`${booking.locationType === "thuis" ? "Bij jullie thuis" : booking.locationType === "locatie" ? "Op locatie" : "Anders"}${booking.location ? ` · ${booking.location}` : ""}`}
          />
        </div>

        {booking.extras.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Extra&apos;s</p>
            <p className="mt-1 text-sm">
              {booking.extras.map((extraId) => getExtra(extraId)?.name ?? extraId).join(", ")}
            </p>
          </div>
        )}

        <div className="mt-8 space-y-2 border-t border-ink/10 pt-6 text-sm">
          <div className="flex items-center justify-between font-heading text-lg font-bold">
            <span>Totaal</span>
            <span className="text-coral">€{booking.totalPrice}</span>
          </div>
          <div className="flex items-center justify-between text-ink-soft">
            <span>Aanbetaling {booking.depositPaid ? "(betaald)" : "(nog niet betaald)"}</span>
            <span>€{booking.depositAmount}</span>
          </div>
          <div className="flex items-center justify-between text-ink-soft">
            <span>Restant</span>
            <span>€{Math.max(0, remaining)}</span>
          </div>
        </div>

        {!booking.depositPaid && booking.depositAmount > 0 && booking.status !== "Geannuleerd" && (
          <div className="mt-6">
            <PayDepositButton bookingId={booking.id} amount={booking.depositAmount} />
            <p className="mt-3 text-center text-xs text-ink-soft">
              Liever handmatig betalen? Mail ons via hallo@rosaencharlotte.nl.
            </p>
          </div>
        )}
      </div>
    </AccountShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
