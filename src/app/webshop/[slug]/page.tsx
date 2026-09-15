import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedProduct, getPublishedProducts } from "@/lib/products";
import { getProductMainImageUrl } from "@/lib/productImages";
import AddToCartForm from "@/components/AddToCartForm";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  if (!product) notFound();

  const imageUrl = await getProductMainImageUrl(product.slug);

  const otherProducts = await getPublishedProducts();
  const otherItems = await Promise.all(
    otherProducts
      .filter((p) => p.slug !== product.slug)
      .slice(0, 4)
      .map(async (p) => ({ product: p, imageUrl: await getProductMainImageUrl(p.slug) }))
  );

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-14">
        <Link href="/webshop" className="text-sm font-semibold text-ink-soft hover:text-coral">
          ← Alle producten
        </Link>
      </section>

      <section className="mx-auto mt-6 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="aspect-square w-full overflow-hidden rounded-[3rem] shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-lg text-ink/70">{product.description}</p>
            <p className="mt-6 font-heading text-3xl font-bold text-coral">€{product.price}</p>
            <div className="mt-8">
              <AddToCartForm product={product} />
            </div>
          </div>
        </div>
      </section>

      {otherItems.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <h2 className="font-heading text-2xl font-bold">Ook leuk</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {otherItems.map(({ product: p, imageUrl: url }) => (
              <ProductCard key={p.slug} product={p} imageUrl={url} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
