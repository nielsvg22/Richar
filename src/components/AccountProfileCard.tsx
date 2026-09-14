"use client";

import { useState, type FormEvent } from "react";

export default function AccountProfileCard({
  name,
  email,
  phone,
  memberSince,
}: {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
}) {
  const [editing, setEditing] = useState(false);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [status, setStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneValue }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      setEditing(false);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-[1.75rem] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-lavender-soft text-2xl font-heading font-extrabold">
          {name.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="font-heading text-lg font-bold">{name}</p>
          <p className="text-sm text-ink-soft">Klant sinds {memberSince}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 border-t border-ink/10 pt-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            E-mailadres
          </p>
          <p className="mt-1 text-sm font-semibold">{email}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Telefoonnummer
          </p>
          {editing ? (
            <form onSubmit={handleSubmit} className="mt-2 flex flex-wrap items-center gap-2">
              <input
                type="tel"
                value={phoneValue}
                onChange={(e) => setPhoneValue(e.target.value)}
                placeholder="06-12345678"
                className="min-w-0 flex-1 rounded-xl border border-ink/10 bg-cream-soft px-3 py-2 text-sm focus:border-coral focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-cream hover:bg-coral disabled:opacity-60"
              >
                Opslaan
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setPhoneValue(phone);
                }}
                className="rounded-full px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-cream-soft"
              >
                Annuleren
              </button>
            </form>
          ) : (
            <div className="mt-1 flex items-center gap-3">
              <p className="text-sm font-semibold">{phoneValue || "Nog niet ingevuld"}</p>
              <button
                onClick={() => setEditing(true)}
                className="text-xs font-semibold text-coral hover:underline"
              >
                Bewerken
              </button>
            </div>
          )}
          {status === "saved" && !editing && (
            <p className="mt-2 text-xs font-semibold text-ink">✓ Opgeslagen</p>
          )}
          {status === "error" && (
            <p className="mt-2 text-xs font-semibold text-coral">
              Opslaan mislukt, probeer het opnieuw.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
