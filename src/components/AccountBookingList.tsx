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
      <div className="divide-y divide-ink/5">
        {bookings.map((booking) => {
          const showPay =
            !booking.depositPaid && booking.depositAmount > 0 && booking.status !== "Geannuleerd";
          return (
            <div
              key={booking.id}
              className="relative flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 transition-colors hover:bg-cream-soft/60 sm:px-6"
            >
              <Link
                href={`/account/boekingen/${booking.id}`}
                className="absolute inset-0"
                aria-label={`Bekijk boeking ${booking.themeName} van ${booking.childName}`}
              />

              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-yellow-soft text-lg">
                🎈
              </span>

              <div className="min-w-[10rem] flex-1">
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
              </div>

              <div className="flex flex-shrink-0 items-center gap-3">
                <StatusBadge status={booking.status} />

                <span className="font-heading font-bold text-coral">€{booking.totalPrice}</span>

                {showPay && (
                  <span className="relative z-10">
                    <PayDepositButton bookingId={booking.id} amount={booking.depositAmount} compact />
                  </span>
                )}

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
            </div>
          );
        })}
      </div>
    </div>
  );
}
