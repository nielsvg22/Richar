import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import ProductForm from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Product bewerken",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BewerkProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/webshop" className="text-sm font-semibold text-ink-soft hover:text-coral">
        ← Terug naar webshop
      </Link>
      <h1 className="mt-4 font-heading text-3xl font-extrabold">{product.name}</h1>
      <p className="mt-2 text-ink-soft">Bewerk dit product. Wijzigingen zijn direct zichtbaar.</p>

      <div className="mt-8 max-w-2xl">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
