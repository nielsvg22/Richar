import type { Metadata } from "next";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Nieuw product",
  robots: { index: false, follow: false },
};

export default function NieuwProductPage() {
  return (
    <div>
      <Link href="/admin/webshop" className="text-sm font-semibold text-ink-soft hover:text-coral">
        ← Terug naar webshop
      </Link>
      <h1 className="mt-4 font-heading text-3xl font-extrabold">Nieuw product</h1>
      <p className="mt-2 text-ink-soft">Voeg een nieuw product toe aan de webshop.</p>

      <div className="mt-8 max-w-2xl">
        <ProductForm />
      </div>
    </div>
  );
}
