"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import type { Product } from "@/lib/product-constants";

export default function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (product.stock === 0) {
    return (
      <p className="rounded-2xl bg-cream-soft px-4 py-3 text-sm font-semibold text-ink-soft">
        Helaas, dit item is tijdelijk uitverkocht.
      </p>
    );
  }

  function handleAdd() {
    addItem({ slug: product.slug, name: product.name, price: product.price }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 rounded-full border-2 border-ink/10 px-2 py-1.5">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream-soft"
          aria-label="Minder"
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream-soft"
          aria-label="Meer"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5 hover:bg-coral"
      >
        {added ? "✓ Toegevoegd!" : "In winkelwagen"}
      </button>
      {added && (
        <Link href="/webshop/winkelwagen" className="text-sm font-semibold text-coral hover:underline">
          Naar winkelwagen →
        </Link>
      )}
    </div>
  );
}
