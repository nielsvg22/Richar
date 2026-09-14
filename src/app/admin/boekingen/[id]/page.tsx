import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBooking } from "@/lib/bookings";
import { getExtra } from "@/lib/pricing";
import BookingActions from "@/components/admin/BookingActions";
import InternalNotesEditor from "@/components/admin/InternalNotesEditor";

export const metadata: Metadata = {
  title: "Boekingsdetail",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = getBooking(id);
  if (!booking) notFound();

  return (
    <div>
      <Link href="/admin" className="text-sm font-semibold text-ink-soft hover:text-coral">
        ← Terug naar dashboard
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
            <p className="text-sm text-ink-soft">Boeking {booking.id}</p>
            <h1 className="mt-1 font-heading text-3xl font-extrabold">
              {booking.childName}, {booking.childAge} jaar
            </h1>
            <p className="mt-1 text-lg text-ink/70">
              {booking.themeName} feestje
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Detail label="Datum" value={new Date(booking.date).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })} />
              <Detail label="Tijd" value={booking.time || "-"} />
              <Detail label="Aantal kinderen" value={String(booking.kids)} />
              <Detail
                label="Locatie"
                value={`${booking.locationType === "thuis" ? "Bij de klant thuis" : booking.locationType === "locatie" ? "Op locatie" : "Anders"}${booking.location ? ` · ${booking.location}` : ""}`}
              />
              <Detail label="Pakket" value={booking.packageName} />
              <Detail
                label="Extra's"
                value={
                  booking.extras.length
                    ? booking.extras.map((id) => getExtra(id)?.name ?? id).join(", ")
                    : "Geen"
                }
              />
            </div>

            {booking.notes && (
              <div className="mt-6 rounded-2xl bg-yellow-soft p-5">
                <p className="text-sm font-semibold">Opmerkingen</p>
                <p className="mt-1 text-sm text-ink/80">{booking.notes}</p>
              </div>
            )}

            <div className="mt-8 border-t border-ink/10 pt-6">
              <h2 className="font-heading text-lg font-bold">Prijsopbouw</h2>
              <div className="mt-4 space-y-2 text-sm">
                <Row label={`Basis (${booking.packageName})`} value={booking.basePrice} />
                {booking.extraKidsPrice > 0 && (
                  <Row label="Extra kinderen" value={booking.extraKidsPrice} />
                )}
                {booking.extrasPrice > 0 && <Row label="Extra's" value={booking.extrasPrice} />}
                {booking.discountAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft">Korting ({booking.discountCode})</span>
                    <span>−€{booking.discountAmount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-ink/10 pt-3 font-heading text-lg font-bold">
                  <span>Totaal</span>
                  <span className="text-coral">€{booking.totalPrice}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-cream-soft p-4 text-sm">
                <div>
                  <p className="font-semibold">
                    Aanbetaling (50%): €{booking.depositAmount}
                  </p>
                  <p className="text-ink-soft">
                    Restant bij het feestje: €{booking.totalPrice - booking.depositAmount}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    booking.depositPaid ? "bg-mint-soft text-ink" : "bg-yellow-soft text-ink"
                  }`}
                >
                  {booking.depositPaid ? "✓ Aanbetaling voldaan" : "Nog niet betaald"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[2.5rem] bg-white p-8 shadow-sm">
            <h2 className="font-heading text-lg font-bold">Contactgegevens</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Detail label="Ouder/verzorger" value={booking.parentName} />
              <Detail label="E-mail" value={booking.email} />
              <Detail label="Telefoon" value={booking.phone} />
              <Detail
                label="Aangevraagd op"
                value={new Date(booking.createdAt).toLocaleDateString("nl-NL")}
              />
            </div>
          </div>

          <div className="mt-6">
            <InternalNotesEditor bookingId={booking.id} initialNotes={booking.internalNotes} />
          </div>
        </div>

        <div>
          <BookingActions booking={booking} />
        </div>
      </div>
    </div>
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

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-soft">{label}</span>
      <span>€{value}</span>
    </div>
  );
}
