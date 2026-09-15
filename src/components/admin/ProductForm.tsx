"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/product-constants";
import ProductImageManager from "./ProductImageManager";

type ProductFormValues = {
  name: string;
  description: string;
  price: string;
  stock: string;
  published: boolean;
};

function toFormValues(product?: Product): ProductFormValues {
  return {
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product ? String(product.price) : "10",
    stock: product ? String(product.stock) : "10",
    published: product?.published ?? true,
  };
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const [values, setValues] = useState<ProductFormValues>(() => toFormValues(product));
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const payload = {
      ...values,
      price: Number(values.price),
      stock: Number(values.stock),
    };

    try {
      const res = await fetch(isEdit ? `/api/products/${product!.slug}` : "/api/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Er ging iets mis.");
      }
      const saved = await res.json();
      router.push(`/admin/webshop/${saved.slug}`);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!confirm(`Weet je zeker dat je "${product.name}" wilt verwijderen?`)) return;
    setStatus("loading");
    try {
      const res = await fetch(`/api/products/${product.slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Verwijderen mislukt.");
      router.push("/admin/webshop");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold">Naam</label>
            <input
              required
              type="text"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              placeholder="Bijv. Extra goodiebag"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Omschrijving</label>
            <textarea
              rows={3}
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">Prijs (€)</label>
              <input
                required
                type="number"
                min={0}
                value={values.price}
                onChange={(e) => update("price", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Voorraad</label>
              <input
                required
                type="number"
                min={0}
                value={values.stock}
                onChange={(e) => update("stock", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {isEdit && product && (
        <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-lg font-bold">Afbeeldingen</h2>
          <div className="mt-5">
            <ProductImageManager slug={product.slug} />
          </div>
        </div>
      )}

      <label className="flex items-center gap-3 text-sm font-semibold">
        <input
          type="checkbox"
          checked={values.published}
          onChange={(e) => update("published", e.target.checked)}
          className="h-5 w-5 accent-coral"
        />
        Gepubliceerd (zichtbaar in de webshop)
      </label>

      {error && <p className="rounded-xl bg-coral-soft px-4 py-3 text-sm">{error}</p>}

      <div className="flex flex-wrap items-center gap-3 border-t border-ink/10 pt-6">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream hover:bg-coral disabled:opacity-60"
        >
          {status === "loading" ? "Opslaan..." : isEdit ? "Wijzigingen opslaan" : "Product toevoegen"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={status === "loading"}
            className="rounded-full px-7 py-3.5 text-sm font-semibold text-coral hover:bg-coral-soft disabled:opacity-60"
          >
            Product verwijderen
          </button>
        )}
      </div>
    </form>
  );
}
