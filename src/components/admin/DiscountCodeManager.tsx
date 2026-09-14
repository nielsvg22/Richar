"use client";

import { useState } from "react";
import type { DiscountCode } from "@/lib/discounts";

type FormValues = {
  code: string;
  type: "percentage" | "fixed";
  value: string;
  description: string;
  expiresAt: string;
  usageLimit: string;
};

const emptyForm: FormValues = {
  code: "",
  type: "percentage",
  value: "10",
  description: "",
  expiresAt: "",
  usageLimit: "",
};

export default function DiscountCodeManager({ initial }: { initial: DiscountCode[] }) {
  const [discounts, setDiscounts] = useState(initial);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function refresh() {
    const res = await fetch("/api/discounts");
    setDiscounts(await res.json());
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          active: true,
          expiresAt: form.expiresAt || null,
          usageLimit: form.usageLimit || null,
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Aanmaken mislukt.");
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

  async function toggleActive(discount: DiscountCode) {
    await fetch(`/api/discounts/${discount.code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !discount.active }),
    });
    await refresh();
  }

  async function remove(code: string) {
    if (!confirm(`Kortingscode "${code}" verwijderen?`)) return;
    await fetch(`/api/discounts/${code}`, { method: "DELETE" });
    await refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft">{discounts.length} kortingscode(s)</p>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-coral"
        >
          {showForm ? "Annuleren" : "+ Nieuwe code"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-4 space-y-4 rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">Code</label>
              <input
                required
                type="text"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="ZOMER2026"
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "percentage" | "fixed" }))}
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Vast bedrag (€)</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-semibold">Waarde</label>
              <input
                required
                type="number"
                min={1}
                value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Verloopt op</label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Max. aantal keer</label>
              <input
                type="number"
                min={1}
                value={form.usageLimit}
                onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
                placeholder="Onbeperkt"
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Omschrijving</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Bijv. Actie voor de zomervakantie"
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>

          {error && <p className="rounded-xl bg-coral-soft px-4 py-3 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-cream hover:opacity-90 disabled:opacity-60"
          >
            {status === "loading" ? "Aanmaken..." : "Code aanmaken"}
          </button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-[2rem] bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Korting</th>
              <th className="px-6 py-4">Gebruikt</th>
              <th className="px-6 py-4">Verloopt</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Acties</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.code} className="border-b border-ink/5 last:border-0">
                <td className="px-6 py-4">
                  <p className="font-semibold">{d.code}</p>
                  {d.description && <p className="text-xs text-ink-soft">{d.description}</p>}
                </td>
                <td className="px-6 py-4">
                  {d.type === "percentage" ? `${d.value}%` : `€${d.value}`}
                </td>
                <td className="px-6 py-4">
                  {d.usageCount}
                  {d.usageLimit ? ` / ${d.usageLimit}` : ""}
                </td>
                <td className="px-6 py-4">
                  {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString("nl-NL") : "-"}
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => toggleActive(d)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      d.active ? "bg-mint-soft text-ink" : "bg-ink/10 text-ink-soft"
                    }`}
                  >
                    {d.active ? "Actief" : "Inactief"}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => remove(d.code)}
                    className="text-xs font-semibold text-coral hover:underline"
                  >
                    Verwijderen
                  </button>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-ink-soft">
                  Nog geen kortingscodes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
