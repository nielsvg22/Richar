import Link from "next/link";
import type { Product } from "@/lib/product-constants";

export default function ProductCard({
  product,
  imageUrl,
}: {
  product: Product;
  imageUrl: string;
}) {
  return (
    <Link
      href={`/webshop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-square w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-lg font-bold">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm text-ink-soft">{product.description}</p>
        <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
          <span className="font-heading text-lg font-bold text-coral">€{product.price}</span>
          {product.stock === 0 ? (
            <span className="text-xs font-semibold text-ink-soft">Uitverkocht</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              Bekijk
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
