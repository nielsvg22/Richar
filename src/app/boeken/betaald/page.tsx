import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBooking } from "@/lib/bookings";
import PaymentStatusCheck from "@/components/PaymentStatusCheck";

export const metadata: Metadata = {
  title: "Betaling verwerken",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BetaaldPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const { bookingId } = await searchParams;
  if (!bookingId) notFound();

  const booking = getBooking(bookingId);
  if (!booking) notFound();

  return (
    <section className="mx-auto max-w-lg px-5 py-20 text-center sm:px-8">
      <p className="text-4xl">🎉</p>
      <h1 className="mt-4 font-heading text-3xl font-extrabold">
        {booking.themeName} van {booking.childName}
      </h1>
      <p className="mt-2 text-ink-soft">Boekingsnummer {booking.id}</p>

      <div className="mt-8">
        <PaymentStatusCheck bookingId={booking.id} />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="rounded-full border-2 border-ink/10 px-6 py-3 text-sm font-semibold hover:border-coral"
        >
          Naar de homepage
        </Link>
        <Link
          href="/contact"
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coral"
        >
          Contact opnemen
        </Link>
      </div>
    </section>
  );
}
