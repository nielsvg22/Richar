import type { Metadata } from "next";
import Link from "next/link";
import { getInvoices, type InvoiceStatus } from "@/lib/invoices";

export const metadata: Metadata = {
  title: "Facturen",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  open: "bg-coral-soft text-ink",
  aanbetaald: "bg-yellow-soft text-ink",
  betaald: "bg-mint-soft text-ink",
};

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  open: "Open",
  aanbetaald: "Aanbetaald",
  betaald: "Betaald",
};

export default async function FacturenPage() {
  const invoices = await getInvoices();
  const totalOpen = invoices
    .filter((i) => i.status !== "betaald")
    .reduce((sum, i) => sum + (i.booking.totalPrice - (i.booking.depositPaid ? i.booking.depositAmount : 0)), 0);

  return (
    <div>
      <h1 className="font-heading text-3xl font-extrabold">Facturen</h1>
      <p className="mt-2 text-ink-soft">
        Alle facturen op basis van boekingen. €{totalOpen} nog openstaand.
      </p>

      <div className="mt-8 overflow-x-auto rounded-[2rem] bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <th className="px-6 py-4">Factuurnummer</th>
              <th className="px-6 py-4">Klant</th>
              <th className="px-6 py-4">Feestje</th>
              <th className="px-6 py-4">Datum</th>
              <th className="px-6 py-4">Bedrag</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.number} className="border-b border-ink/5 last:border-0 hover:bg-cream-soft">
                <td className="px-6 py-4">
                  <Link href={`/admin/facturen/${inv.booking.id}`} className="font-semibold hover:text-coral">
                    {inv.number}
                  </Link>
                </td>
                <td className="px-6 py-4">{inv.booking.parentName}</td>
                <td className="px-6 py-4">{inv.booking.themeName}</td>
                <td className="px-6 py-4">
                  {new Date(inv.booking.date).toLocaleDateString("nl-NL")}
                </td>
                <td className="px-6 py-4">€{inv.booking.totalPrice}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[inv.status]}`}>
                    {STATUS_LABELS[inv.status]}
                  </span>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-ink-soft">
                  Nog geen facturen.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
