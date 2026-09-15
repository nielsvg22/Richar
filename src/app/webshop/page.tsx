import type { Metadata } from "next";
import { getPublishedProducts } from "@/lib/products";
import { getProductMainImageUrl } from "@/lib/productImages";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Webshop",
  description:
    "Bestel extra goodiebags, decoratie en leuke items van Rosa & Charlotte om je kinderfeestje compleet te maken.",
};

export const dynamic = "force-dynamic";

export default async function WebshopPage() {
  const products = await getPublishedProducts();
  const items = await Promise.all(
    products.map(async (product) => ({
      product,
      imageUrl: await getProductMainImageUrl(product.slug),
    }))
  );

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-4 pt-14 sm:px-8 sm:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-soft px-4 py-2 text-sm font-semibold">
          🎁 {products.length} leuke extra&apos;s
        </span>
        <h1 className="mt-6 max-w-2xl font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
          Maak het feestje nog compleeter
        </h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Extra goodiebags, decoratie of een blijvende herinnering — bestel het
          los en we zorgen dat het op tijd bij jullie is.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        {items.length === 0 ? (
          <div className="rounded-[2.5rem] bg-white p-12 text-center text-ink-soft">
            Binnenkort vind je hier onze leukste extra&apos;s ✨
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(({ product, imageUrl }) => (
              <ProductCard key={product.slug} product={product} imageUrl={imageUrl} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
