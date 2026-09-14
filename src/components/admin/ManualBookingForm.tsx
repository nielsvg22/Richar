"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Theme } from "@/lib/theme-constants";
import { packages, extras, getPackage, calculatePrice, type Package } from "@/lib/pricing";

export default function ManualBookingForm({ themes }: { themes: Theme[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [themeSlug, setThemeSlug] = useState(themes[0]?.slug ?? "");
  const [packageId, setPackageId] = useState<Package["id"]>(packages[1]?.id ?? packages[0].id);
  const [kids, setKids] = useState(8);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const pkg = getPackage(packageId);
  const { total } = pkg ? calculatePrice(pkg, kids, selectedExtras) : { total: 0 };

  function toggleExtra(id: string) {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      themeSlug,
      packageId,
      kids,
      date: form.get("date"),
      time: form.get("time"),
      locationType: form.get("locationType"),
      location: form.get("location"),
      extras: selectedExtras,
      parentName: form.get("parentName"),
      email: form.get("email"),
      phone: form.get("phone"),
      childName: form.get("childName"),
      childAge: form.get("childAge"),
      notes: form.get("notes"),
      force: true,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Er ging iets mis.");
      }
      const booking = await res.json();
      router.push(`/admin/boekingen/${booking.id}`);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Thema</label>
          <select
            value={themeSlug}
            onChange={(e) => setThemeSlug(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          >
            {themes.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.emoji} {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold">Pakket</label>
          <select
            value={packageId}
            onChange={(e) => setPackageId(e.target.value as Package["id"])}
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          >
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (€{p.price})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="text-sm font-semibold">Aantal kinderen</label>
          <input
            type="number"
            min={1}
            max={20}
            value={kids}
            onChange={(e) => setKids(Number(e.target.value))}
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Datum</label>
          <input
            name="date"
            type="date"
            required
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Tijd</label>
          <input
            name="time"
            type="text"
            placeholder="14:00 - 16:30"
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Locatietype</label>
          <select
            name="locationType"
            defaultValue="thuis"
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          >
            <option value="thuis">Bij klant thuis</option>
            <option value="locatie">Op locatie</option>
            <option value="anders">Anders</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold">Adres / plaatsnaam</label>
          <input
            name="location"
            type="text"
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">Extra&apos;s</label>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {extras.map((extra) => (
            <label
              key={extra.id}
              className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm ${
                selectedExtras.includes(extra.id) ? "border-coral bg-coral-soft/40" : "border-ink/10"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedExtras.includes(extra.id)}
                onChange={() => toggleExtra(extra.id)}
                className="h-4 w-4 accent-coral"
              />
              {extra.name}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Naam ouder/verzorger</label>
          <input
            name="parentName"
            type="text"
            required
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Telefoonnummer</label>
          <input
            name="phone"
            type="tel"
            required
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">E-mailadres</label>
        <input
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Naam jarige</label>
          <input
            name="childName"
            type="text"
            required
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Leeftijd jarige</label>
          <input
            name="childAge"
            type="number"
            min={1}
            max={14}
            required
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">Opmerkingen</label>
        <textarea
          name="notes"
          rows={3}
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-cream-soft px-5 py-4">
        <span className="text-sm font-semibold">Totaalprijs</span>
        <span className="font-heading text-xl font-extrabold text-coral">€{total}</span>
      </div>

      {error && <p className="rounded-xl bg-coral-soft px-4 py-3 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-ink px-6 py-4 text-sm font-semibold text-cream hover:bg-coral disabled:opacity-60"
      >
        {status === "loading" ? "Opslaan..." : "Boeking toevoegen"}
      </button>
    </form>
  );
}
