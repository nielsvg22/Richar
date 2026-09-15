import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInvoiceForBooking } from "@/lib/invoices";
import { getExtra } from "@/lib/pricing";
import PrintInvoiceButton from "@/components/PrintInvoiceButton";

export const metadata: Metadata = {
  title: "Factuur",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  aanbetaald: "Aanbetaald — restant nog openstaand",
  betaald: "Volledig betaald",
};

export default async function PublicFactuurPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoiceForBooking(id);
  if (!invoice) notFound();

  const { booking, number, status } = invoice;
  const remaining = booking.depositPaid ? booking.totalPrice - booking.depositAmount : booking.totalPrice;

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex items-center justify-end print:hidden">
        <PrintInvoiceButton />
      </div>

      <div className="mt-6 rounded-[2.5rem] bg-white p-10 shadow-sm print:rounded-none print:shadow-none">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-heading text-xl font-extrabold">Rosa &amp; Charlotte</p>
            <p className="text-sm text-ink-soft">Kinderfeestjes</p>
            <p className="mt-2 text-xs text-ink-soft">
              hallo@rosaencharlotte.nl
              <br />
              06 - 123 456 78
              <br />
              Apeldoorn, Deventer, Arnhem e.o.
            </p>
          </div>
          <div className="text-right">
            <h1 className="font-heading text-2xl font-extrabold">Factuur</h1>
            <p className="mt-1 text-sm text-ink-soft">{number}</p>
            <p className="text-sm text-ink-soft">
              {new Date(booking.createdAt).toLocaleDateString("nl-NL")}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6 border-y border-ink/10 py-6 text-sm">
          <div>
            <p className="font-semibold uppercase tracking-wide text-ink-soft">Factuur aan</p>
            <p className="mt-2 font-semibold">{booking.parentName}</p>
            <p className="text-ink-soft">{booking.email}</p>
            <p className="text-ink-soft">{booking.phone}</p>
          </div>
          <div>
            <p className="font-semibold uppercase tracking-wide text-ink-soft">Feestje</p>
            <p className="mt-2 font-semibold">
              {booking.themeName} — {booking.childName}
            </p>
            <p className="text-ink-soft">
              {new Date(booking.date).toLocaleDateString("nl-NL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              {booking.time && `· ${booking.time}`}
            </p>
            <p className="text-ink-soft">Boekingsnummer {booking.id}</p>
          </div>
        </div>

        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <th className="pb-3">Omschrijving</th>
              <th className="pb-3 text-right">Bedrag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            <tr>
              <td className="py-3">{booking.packageName} pakket ({booking.kids} kinderen)</td>
              <td className="py-3 text-right">€{booking.basePrice}</td>
            </tr>
            {booking.extraKidsPrice > 0 && (
              <tr>
                <td className="py-3">Extra kinderen</td>
                <td className="py-3 text-right">€{booking.extraKidsPrice}</td>
              </tr>
            )}
            {booking.extras.map((extraId) => {
              const extra = getExtra(extraId);
              if (!extra) return null;
              const price = extra.unit === "per kind" ? extra.price * booking.kids : extra.price;
              return (
                <tr key={extraId}>
                  <td className="py-3">{extra.name}</td>
                  <td className="py-3 text-right">€{price}</td>
                </tr>
              );
            })}
            {booking.discountAmount > 0 && (
              <tr>
                <td className="py-3">Korting ({booking.discountCode})</td>
                <td className="py-3 text-right">−€{booking.discountAmount}</td>
              </tr>
            )}
            {booking.voucherAmount > 0 && (
              <tr>
                <td className="py-3">Cadeaubon ({booking.voucherCode})</td>
                <td className="py-3 text-right">−€{booking.voucherAmount}</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
          <div className="flex items-center justify-between font-heading text-lg font-bold">
            <span>Totaal</span>
            <span>€{booking.totalPrice}</span>
          </div>
          <div className="flex items-center justify-between text-ink-soft">
            <span>Aanbetaling {booking.depositPaid ? "(betaald)" : "(nog niet betaald)"}</span>
            <span>€{booking.depositAmount}</span>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span>Restant te betalen</span>
            <span>€{Math.max(0, remaining)}</span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-cream-soft p-4 text-center text-sm font-semibold">
          Status: {STATUS_LABELS[status]}
        </div>

        <p className="mt-8 text-center text-xs text-ink-soft">
          Vrijgesteld van btw op grond van de kleineondernemersregeling (KOR).
        </p>
      </div>
    </div>
  );
}
