"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/product-constants";

export default function ProductTable({
  items,
}: {
  items: { product: Product; imageUrl: string }[];
}) {
  const router = useRouter();
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  async function togglePublished(product: Product) {
    setPendingSlug(product.slug);
    try {
      await fetch(`/api/products/${product.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !product.published }),
      });
      router.refresh();
    } finally {
      setPendingSlug(null);
    }
  }

  async function remove(product: Product) {
    if (!confirm(`Weet je zeker dat je "${product.name}" wilt verwijderen?`)) return;
    setPendingSlug(product.slug);
    try {
      await fetch(`/api/products/${product.slug}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setPendingSlug(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-[2rem] bg-white p-12 text-center">
        <p className="font-heading text-lg font-bold">Nog geen producten</p>
        <p className="mt-2 text-sm text-ink-soft">
          Voeg je eerste product toe en het verschijnt hier automatisch.
        </p>
        <Link
          href="/admin/webshop/nieuw"
          className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coral"
        >
          + Product toevoegen
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto rounded-[2rem] bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wide text-ink-soft">
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Prijs</th>
            <th className="px-6 py-4">Voorraad</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Acties</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ product, imageUrl }) => {
            const isPending = pendingSlug === product.slug;
            return (
              <tr key={product.slug} className="border-b border-ink/5 last:border-0">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt=""
                      className="h-12 w-12 flex-shrink-0 rounded-xl object-cover"
                    />
                    <Link
                      href={`/admin/webshop/${product.slug}`}
                      className="font-semibold hover:text-coral"
                    >
                      {product.name}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 text-ink-soft">€{product.price}</td>
                <td className="px-6 py-4">
                  <span
                    className={
                      product.stock === 0
                        ? "font-semibold text-coral"
                        : product.stock <= 5
                          ? "font-semibold text-ink"
                          : "text-ink-soft"
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      product.published ? "bg-mint-soft text-ink" : "bg-cream-soft text-ink-soft"
                    }`}
                  >
                    {product.published ? "Gepubliceerd" : "Verborgen"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap items-center justify-end gap-3 text-xs font-semibold">
                    <Link href={`/admin/webshop/${product.slug}`} className="hover:text-coral">
                      Bewerken
                    </Link>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => togglePublished(product)}
                      className="hover:text-coral disabled:opacity-40"
                    >
                      {product.published ? "Verbergen" : "Publiceren"}
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => remove(product)}
                      className="text-coral hover:underline disabled:opacity-40"
                    >
                      Verwijderen
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
