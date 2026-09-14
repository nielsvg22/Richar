"use client";

import { useState } from "react";
import type { InventoryItem } from "@/lib/inventory";

const emptyForm = { name: "", quantity: "1", unit: "stuks", lowStockThreshold: "5" };

export default function InventoryManager({ initial }: { initial: InventoryItem[] }) {
  const [items, setItems] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function refresh() {
    const res = await fetch("/api/inventory");
    setItems(await res.json());
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Toevoegen mislukt.");
      }
      setForm(emptyForm);
      setShowForm(false);
      setStatus("idle");
      await refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
  }

  async function adjustQuantity(item: InventoryItem, delta: number) {
    setPendingId(item.id);
    try {
      await fetch(`/api/inventory/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: Math.max(0, item.quantity + delta) }),
      });
      await refresh();
    } finally {
      setPendingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Dit item verwijderen uit de voorraad?")) return;
    await fetch(`/api/inventory/${id}`, { method: "DELETE" });
    await refresh();
  }

  const lowStockCount = items.filter((i) => i.quantity <= i.lowStockThreshold).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft">
          {items.length} items
          {lowStockCount > 0 && (
            <span className="ml-2 rounded-full bg-coral-soft px-3 py-1 text-xs font-semibold">
              {lowStockCount} bijna op
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-coral"
        >
          {showForm ? "Annuleren" : "+ Nieuw item"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-4 space-y-4 rounded-[2rem] bg-white p-6 shadow-sm">
          <div>
            <label className="text-sm font-semibold">Naam</label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Bijv. Ballonnenboog sets"
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-semibold">Aantal</label>
              <input
                type="number"
                min={0}
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Eenheid</label>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                placeholder="stuks / sets / kits"
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Lage voorraad vanaf</label>
              <input
                type="number"
                min={0}
                value={form.lowStockThreshold}
                onChange={(e) => setForm((f) => ({ ...f, lowStockThreshold: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="rounded-xl bg-coral-soft px-4 py-3 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-cream hover:opacity-90 disabled:opacity-60"
          >
            {status === "loading" ? "Toevoegen..." : "Item toevoegen"}
          </button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-[2rem] bg-white shadow-sm">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Voorraad</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Acties</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isLow = item.quantity <= item.lowStockThreshold;
              return (
                <tr key={item.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-6 py-4 font-semibold">{item.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={pendingId === item.id}
                        onClick={() => adjustQuantity(item, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-cream-soft hover:bg-coral-soft disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="w-16 text-center">
                        {item.quantity} {item.unit}
                      </span>
                      <button
                        type="button"
                        disabled={pendingId === item.id}
                        onClick={() => adjustQuantity(item, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-cream-soft hover:bg-mint-soft disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isLow ? "bg-coral-soft text-ink" : "bg-mint-soft text-ink"
                      }`}
                    >
                      {isLow ? "Bijna op" : "Op voorraad"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="text-xs font-semibold text-coral hover:underline"
                    >
                      Verwijderen
                    </button>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-ink-soft">
                  Nog geen items in de voorraad.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
