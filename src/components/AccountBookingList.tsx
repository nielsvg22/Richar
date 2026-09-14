import Link from "next/link";
import type { Booking } from "@/lib/bookings";
import StatusBadge from "@/components/admin/StatusBadge";
import PayDepositButton from "@/components/PayDepositButton";

export default function AccountBookingList({
  bookings,
  emptyTitle = "Nog geen boekingen",
  emptyHint = "Tijd om het eerste feestje te plannen!",
}: {
  bookings: Booking[];
  emptyTitle?: string;
  emptyHint?: string;
}) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-[1.75rem] bg-white p-10 text-center shadow-sm">
        <p className="text-3xl">🎈</p>
        <p className="mt-3 font-semibold">{emptyTitle}</p>
        <p className="mt-1 text-sm text-ink-soft">{emptyHint}</p>
        <Link
          href="/boeken"
          className="mt-5 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coral"
        >
          Boek een feestje
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm">
      <div className="hidden items-center gap-4 border-b border-ink/10 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-ink-soft sm:flex">
        <span className="w-11 flex-shrink-0" aria-hidden />
        <span className="flex-1">Feestje</span>
        <span className="w-32 flex-shrink-0">Status</span>
        <span className="w-20 flex-shrink-0 text-right">Bedrag</span>
        <span className="w-24 flex-shrink-0 text-right">Actie</span>
        <span className="w-4 flex-shrink-0" aria-hidden />
      </div>
      <div className="divide-y divide-ink/5">
        {bookings.map((booking) => {
          const showPay =
            !booking.depositPaid && booking.depositAmount > 0 && booking.status !== "Geannuleerd";
          return (
            <div
              key={booking.id}
              className="relative px-5 py-4 transition-colors hover:bg-cream-soft/60 sm:px-6"
            >
              <Link
                href={`/account/boekingen/${booking.id}`}
                className="absolute inset-0"
                aria-label={`Bekijk boeking ${booking.themeName} van ${booking.childName}`}
              />

              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-yellow-soft text-lg">
                  🎈
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {booking.themeName} — {booking.childName}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-ink-soft">
                    {new Date(booking.date).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {booking.time && ` · ${booking.time}`}
                  </p>
                  <div className="mt-1.5 sm:hidden">
                    <StatusBadge status={booking.status} />
                  </div>
                </div>

                <div className="hidden w-32 flex-shrink-0 sm:block">
                  <StatusBadge status={booking.status} />
                </div>

                <div className="hidden w-20 flex-shrink-0 text-right font-heading font-bold text-coral sm:block">
                  €{booking.totalPrice}
                </div>

                <div className="relative z-10 hidden w-24 flex-shrink-0 text-right sm:block">
                  {showPay && (
                    <PayDepositButton bookingId={booking.id} amount={booking.depositAmount} compact />
                  )}
                </div>

                <svg
                  className="hidden h-4 w-4 flex-shrink-0 text-ink-soft sm:block"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                </svg>
              </div>

              <div className="relative z-10 mt-3 flex items-center justify-between sm:hidden">
                <span className="font-heading font-bold text-coral">€{booking.totalPrice}</span>
                {showPay && (
                  <PayDepositButton bookingId={booking.id} amount={booking.depositAmount} compact />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
