"use client";

import { useEffect, useState } from "react";

type InventoryItem = { id: string; name: string; unit: string };
type Row = { itemId: string; quantity: string };

export default function ThemeMaterialsEditor({ slug }: { slug: string }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/inventory").then((res) => (res.ok ? res.json() : [])),
      fetch(`/api/admin/theme-materials?themeSlug=${encodeURIComponent(slug)}`).then((res) =>
        res.ok ? res.json() : []
      ),
    ]).then(([inv, materials]) => {
      if (cancelled) return;
      setInventory(inv);
      setRows(
        materials.length
          ? materials.map((m: { itemId: string; quantity: number }) => ({
              itemId: m.itemId,
              quantity: String(m.quantity),
            }))
          : []
      );
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  function addRow() {
    setRows((r) => [...r, { itemId: inventory[0]?.id ?? "", quantity: "1" }]);
  }

  function updateRow(index: number, field: keyof Row, value: string) {
    setRows((r) => {
      const next = [...r];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function removeRow(index: number) {
    setRows((r) => r.filter((_, i) => i !== index));
  }

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/theme-materials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeSlug: slug,
          materials: rows
            .filter((r) => r.itemId)
            .map((r) => ({ itemId: r.itemId, quantity: Number(r.quantity) || 1 })),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  if (loading) return <p className="text-sm text-ink/60">Laden...</p>;

  if (inventory.length === 0) {
    return (
      <p className="text-sm text-ink-soft">
        Er staan nog geen items in de voorraad. Voeg eerst voorraaditems toe via{" "}
        <a href="/admin/voorraad" className="font-semibold text-coral">
          Voorraad
        </a>
        .
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4">
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <select
              value={row.itemId}
              onChange={(e) => updateRow(i, "itemId", e.target.value)}
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-2.5 text-sm focus:border-coral focus:outline-none"
            >
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={row.quantity}
              onChange={(e) => updateRow(i, "quantity", e.target.value)}
              className="w-24 flex-shrink-0 rounded-2xl border border-ink/10 bg-white px-3 py-2.5 text-center text-sm focus:border-coral focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-coral-soft text-sm"
              aria-label="Verwijder item"
            >
              ✕
            </button>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-ink-soft">Nog geen materialen gekoppeld aan dit thema.</p>
        )}
      </div>

      <div className="mt-3 flex items-center gap-4">
        <button type="button" onClick={addRow} className="text-sm font-semibold text-coral">
          + Materiaal toevoegen
        </button>
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="ml-auto rounded-full bg-ink px-5 py-2 text-xs font-semibold text-cream hover:bg-coral disabled:opacity-60"
        >
          {status === "saving" ? "Opslaan..." : status === "saved" ? "✓ Opgeslagen" : "Materialen opslaan"}
        </button>
      </div>
      {status === "error" && <p className="mt-2 text-sm text-coral">Opslaan mislukt.</p>}
    </div>
  );
}
