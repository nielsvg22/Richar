"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const [form, setForm] = useState({ customerName: "", email: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/webshop/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, ...form }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Er ging iets mis.");
      window.location.href = body.checkoutUrl;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
        <p className="text-4xl">🛍️</p>
        <h1 className="mt-4 font-heading text-2xl font-bold">Je winkelwagen is leeg</h1>
        <p className="mt-2 text-ink-soft">Tijd om iets leuks uit te zoeken!</p>
        <Link
          href="/webshop"
          className="mt-6 inline-flex rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream hover:bg-coral"
        >
          Naar de webshop
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
      <h1 className="font-heading text-3xl font-extrabold sm:text-4xl">Winkelwagen</h1>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
            key={item.slug}
            className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-white p-5 shadow-sm"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-ink-soft">€{item.price} per stuk</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border-2 border-ink/10 px-2 py-1">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-cream-soft"
                  aria-label="Minder"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-cream-soft"
                  aria-label="Meer"
                >
                  +
                </button>
              </div>
              <p className="w-16 text-right font-semibold">€{item.price * item.quantity}</p>
              <button
                type="button"
                onClick={() => removeItem(item.slug)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-soft text-sm"
                aria-label="Verwijderen"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between font-heading text-lg font-bold">
          <span>Totaal</span>
          <span>€{totalPrice}</span>
        </div>

        <form onSubmit={handleCheckout} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">Naam</label>
              <input
                required
                type="text"
                value={form.customerName}
                onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Telefoonnummer</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">E-mailadres</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>

          {error && <p className="rounded-xl bg-coral-soft px-4 py-3 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-full bg-ink px-6 py-4 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5 hover:bg-coral disabled:opacity-60"
          >
            {status === "loading" ? "Bezig..." : `Afrekenen — €${totalPrice}`}
          </button>
        </form>
      </div>
    </section>
  );
}
