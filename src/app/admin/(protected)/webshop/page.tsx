import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { getProductMainImageUrl } from "@/lib/productImages";
import ProductTable from "@/components/admin/ProductTable";

export const metadata: Metadata = {
  title: "Webshop beheren",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminWebshopPage() {
  const products = await getProducts();
  const items = await Promise.all(
    products.map(async (product) => ({
      product,
      imageUrl: await getProductMainImageUrl(product.slug),
    }))
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold">Webshop</h1>
          <p className="mt-2 text-ink-soft">Beheer de producten die in de webshop te koop zijn.</p>
        </div>
        <Link
          href="/admin/webshop/nieuw"
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coral"
        >
          + Nieuw product
        </Link>
      </div>

      <ProductTable items={items} />
    </div>
  );
}
