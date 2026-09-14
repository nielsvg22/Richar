import type { Metadata } from "next";
import { getInventory } from "@/lib/inventory";
import InventoryManager from "@/components/admin/InventoryManager";

export const metadata: Metadata = {
  title: "Voorraad",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function VoorraadPage() {
  const items = await getInventory();

  return (
    <div>
      <h1 className="font-heading text-3xl font-extrabold">Voorraad &amp; materiaal</h1>
      <p className="mt-2 text-ink-soft">
        Houd bij hoeveel decoratie en materialen er nog zijn, zodat je op tijd kunt
        bijbestellen.
      </p>

      <div className="mt-8">
        <InventoryManager initial={items} />
      </div>
    </div>
  );
}
