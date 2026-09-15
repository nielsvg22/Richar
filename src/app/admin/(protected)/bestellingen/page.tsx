import type { Metadata } from "next";
import Link from "next/link";
import { getOrders, type OrderStatus } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Bestellingen",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<OrderStatus, string> = {
  unpaid: "bg-coral-soft text-ink",
  paid: "bg-yellow-soft text-ink",
  fulfilled: "bg-mint-soft text-ink",
  cancelled: "bg-cream-soft text-ink-soft",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  unpaid: "Niet betaald",
  paid: "Betaald",
  fulfilled: "Afgehandeld",
  cancelled: "Geannuleerd",
};

export default async function BestellingenPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="font-heading text-3xl font-extrabold">Bestellingen</h1>
      <p className="mt-2 text-ink-soft">Alle bestellingen uit de webshop.</p>

      <div className="mt-8 overflow-x-auto rounded-[2rem] bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <th className="px-6 py-4">Bestelling</th>
              <th className="px-6 py-4">Klant</th>
              <th className="px-6 py-4">Datum</th>
              <th className="px-6 py-4">Bedrag</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-ink/5 last:border-0 hover:bg-cream-soft">
                <td className="px-6 py-4">
                  <Link href={`/admin/bestellingen/${order.id}`} className="font-semibold hover:text-coral">
                    {order.id}
                  </Link>
                </td>
                <td className="px-6 py-4">{order.customerName}</td>
                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString("nl-NL")}</td>
                <td className="px-6 py-4">€{order.totalPrice}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-ink-soft">
                  Nog geen bestellingen.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
