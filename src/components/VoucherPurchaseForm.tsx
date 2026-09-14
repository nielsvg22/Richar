"use client";

import { useState } from "react";

const AMOUNTS = [50, 100, 150, 200];

export default function VoucherPurchaseForm() {
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const finalAmount = useCustom ? Number(customAmount) : amount;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/vouchers/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          purchaserName: form.get("purchaserName"),
          purchaserEmail: form.get("purchaserEmail"),
          recipientName: form.get("recipientName"),
          message: form.get("message"),
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Er ging iets mis.");
      window.location.href = body.checkoutUrl;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm font-semibold">Kies een bedrag</label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAmount(a);
                setUseCustom(false);
              }}
              className={`rounded-2xl border-2 py-3 text-sm font-semibold transition-colors ${
                !useCustom && amount === a
                  ? "border-coral bg-coral-soft/40"
                  : "border-ink/10 hover:border-ink/30"
              }`}
            >
              €{a}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="custom"
            checked={useCustom}
            onChange={(e) => setUseCustom(e.target.checked)}
            className="h-4 w-4 accent-coral"
          />
          <label htmlFor="custom" className="text-sm">
            Ander bedrag
          </label>
          {useCustom && (
            <input
              type="number"
              min={10}
              max={500}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="€"
              className="ml-2 w-28 rounded-xl border border-ink/10 px-3 py-2 text-sm focus:border-coral focus:outline-none"
            />
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Jouw naam</label>
          <input
            name="purchaserName"
            type="text"
            required
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Jouw e-mailadres</label>
          <input
            name="purchaserEmail"
            type="email"
            required
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          />
          <p className="mt-1 text-xs text-ink-soft">Hier sturen we de cadeaubon naartoe.</p>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">Voor wie is de cadeaubon? (optioneel)</label>
        <input
          name="recipientName"
          type="text"
          placeholder="Naam van de ontvanger"
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Persoonlijk berichtje (optioneel)</label>
        <textarea
          name="message"
          rows={3}
          placeholder="Bijv. Gefeliciteerd! Geniet van jullie feestje."
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
        />
      </div>

      {error && <p className="rounded-xl bg-coral-soft px-4 py-3 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading" || !finalAmount || finalAmount < 10}
        className="w-full rounded-full bg-coral px-6 py-4 text-sm font-semibold text-cream hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? "Bezig..." : `Cadeaubon kopen — €${finalAmount || 0}`}
      </button>
    </form>
  );
}
