"use client";

import { useState, type FormEvent } from "react";

export default function AccountPasswordCard() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Wijzigen mislukt.");
      setStatus("saved");
      setCurrentPassword("");
      setNewPassword("");
      setOpen(false);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Wijzigen mislukt.");
    }
  }

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mint-soft text-lg">
          🔒
        </span>
        <div>
          <h2 className="font-heading text-lg font-bold">Wachtwoord</h2>
          <p className="text-sm text-ink-soft">Wijzig je inlogwachtwoord.</p>
        </div>
      </div>

      {!open ? (
        <button
          onClick={() => {
            setOpen(true);
            setStatus("idle");
          }}
          className="mt-4 text-sm font-semibold text-coral hover:underline"
        >
          Wachtwoord wijzigen
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label htmlFor="currentPassword" className="text-xs font-semibold text-ink-soft">
              Huidig wachtwoord
            </label>
            <input
              id="currentPassword"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/10 bg-cream-soft px-3 py-2 text-sm focus:border-coral focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="text-xs font-semibold text-ink-soft">
              Nieuw wachtwoord
            </label>
            <input
              id="newPassword"
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/10 bg-cream-soft px-3 py-2 text-sm focus:border-coral focus:outline-none"
              placeholder="Minimaal 8 tekens"
            />
          </div>

          {status === "error" && (
            <p className="rounded-xl bg-coral-soft px-4 py-2 text-sm text-ink">{error}</p>
          )}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-cream hover:bg-coral disabled:opacity-60"
            >
              {status === "loading" ? "Bezig..." : "Opslaan"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setError("");
              }}
              className="rounded-full px-5 py-2.5 text-xs font-semibold text-ink-soft hover:bg-cream-soft"
            >
              Annuleren
            </button>
          </div>
        </form>
      )}

      {status === "saved" && (
        <p className="mt-3 text-xs font-semibold text-ink">✓ Wachtwoord gewijzigd</p>
      )}
    </div>
  );
}
