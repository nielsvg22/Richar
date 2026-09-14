import Link from "next/link";
import type { Booking } from "@/lib/bookings";
import StatusBadge from "./StatusBadge";

export default function BookingTable({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-[2rem] bg-white p-10 text-center text-ink-soft">
        Nog geen boekingen gevonden.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[2rem] bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wide text-ink-soft">
            <th className="px-6 py-4">Datum</th>
            <th className="px-6 py-4">Kind</th>
            <th className="px-6 py-4">Thema</th>
            <th className="px-6 py-4">Klant</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Bedrag</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-ink/5 last:border-0 hover:bg-cream-soft">
              <td className="px-6 py-4">
                <Link href={`/admin/boekingen/${booking.id}`} className="block">
                  {new Date(booking.date).toLocaleDateString("nl-NL", {
                    day: "2-digit",
                    month: "short",
                  })}
                </Link>
              </td>
              <td className="px-6 py-4">
                <Link href={`/admin/boekingen/${booking.id}`} className="block font-semibold">
                  {booking.childName} ({booking.childAge})
                </Link>
              </td>
              <td className="px-6 py-4">
                <Link href={`/admin/boekingen/${booking.id}`} className="block">
                  {booking.themeName}
                </Link>
              </td>
              <td className="px-6 py-4">
                <Link href={`/admin/boekingen/${booking.id}`} className="block">
                  {booking.parentName}
                </Link>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={booking.status} />
              </td>
              <td className="px-6 py-4 text-right font-semibold">
                €{booking.totalPrice}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
