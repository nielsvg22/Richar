import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrderStatusCheck from "@/components/OrderStatusCheck";

export const metadata: Metadata = {
  title: "Bedankt voor je bestelling",
  robots: { index: false, follow: false },
};

export default async function WebshopBedanktPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  if (!order) notFound();

  return (
    <section className="mx-auto max-w-lg px-5 py-20 text-center sm:px-8">
      <h1 className="font-heading text-3xl font-extrabold">Bedankt voor je bestelling!</h1>

      <div className="mt-8">
        <OrderStatusCheck orderId={order} />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="rounded-full border-2 border-ink/10 px-6 py-3 text-sm font-semibold hover:border-coral"
        >
          Naar de homepage
        </Link>
        <Link
          href="/webshop"
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coral"
        >
          Verder shoppen
        </Link>
      </div>
    </section>
  );
}
