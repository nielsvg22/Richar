import type { Metadata } from "next";
import { getDiscounts } from "@/lib/discounts";
import DiscountCodeManager from "@/components/admin/DiscountCodeManager";

export const metadata: Metadata = {
  title: "Kortingscodes",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function KortingscodesPage() {
  const discounts = await getDiscounts();

  return (
    <div>
      <h1 className="font-heading text-3xl font-extrabold">Kortingscodes</h1>
      <p className="mt-2 text-ink-soft">
        Maak actiecodes aan die klanten kunnen gebruiken tijdens het boeken.
      </p>

      <div className="mt-8">
        <DiscountCodeManager initial={discounts} />
      </div>
    </div>
  );
}
