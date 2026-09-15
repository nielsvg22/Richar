import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder, type OrderStatus } from "@/lib/orders";
import OrderActions from "@/components/admin/OrderActions";

export const metadata: Metadata = {
  title: "Bestelling",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<OrderStatus, string> = {
  unpaid: "Niet betaald",
  paid: "Betaald",
  fulfilled: "Afgehandeld",
  cancelled: "Geannuleerd",
};

export default async function BestellingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div>
      <Link href="/admin/bestellingen" className="text-sm font-semibold text-ink-soft hover:text-coral">
        ← Terug naar bestellingen
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
            <p className="text-sm text-ink-soft">Bestelling {order.id}</p>
            <h1 className="mt-1 font-heading text-3xl font-extrabold">{order.customerName}</h1>
            <p className="mt-1 text-ink-soft">
              {new Date(order.createdAt).toLocaleDateString("nl-NL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            <table className="mt-8 w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  <th className="pb-3">Product</th>
                  <th className="pb-3 text-right">Aantal</th>
                  <th className="pb-3 text-right">Bedrag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {order.items.map((item) => (
                  <tr key={item.slug}>
                    <td className="py-3">{item.name}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">€{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4 font-heading text-lg font-bold">
              <span>Totaal</span>
              <span className="text-coral">€{order.totalPrice}</span>
            </div>
          </div>

          <div className="mt-6 rounded-[2.5rem] bg-white p-8 shadow-sm">
            <h2 className="font-heading text-lg font-bold">Contactgegevens</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">E-mail</p>
                <p className="mt-1 text-sm font-semibold">{order.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Telefoon</p>
                <p className="mt-1 text-sm font-semibold">{order.phone || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h3 className="font-heading text-lg font-bold">Status</h3>
            <span className="mt-3 inline-flex rounded-full bg-cream-soft px-3 py-1 text-xs font-semibold">
              {STATUS_LABELS[order.status]}
            </span>
            <div className="mt-5">
              <OrderActions order={order} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
