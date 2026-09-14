"use client";

import { useState, type FormEvent } from "react";

export default function AccountMessageForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, name, email, source: "account" }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Er ging iets mis, probeer het opnieuw.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[2rem] bg-mint-soft p-6 text-center sm:p-8">
        <p className="text-3xl">💌</p>
        <h3 className="mt-3 font-heading text-lg font-bold">Bericht verstuurd!</h3>
        <p className="mt-2 text-sm text-ink-soft">
          We reageren binnen 1 werkdag op {email}.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-xs font-semibold text-coral hover:underline"
        >
          Nog een bericht sturen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="phone" className="text-sm font-semibold">
          Telefoonnummer (optioneel)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-cream-soft px-4 py-3 text-sm focus:border-coral focus:outline-none"
          placeholder="06-12345678"
        />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-semibold">
          Bericht
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-cream-soft px-4 py-3 text-sm focus:border-coral focus:outline-none"
          placeholder="Waar kunnen we je mee helpen?"
        />
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-coral-soft px-4 py-3 text-sm text-ink">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5 hover:bg-coral disabled:opacity-60"
      >
        {status === "loading" ? "Versturen..." : "Bericht versturen"}
      </button>
    </form>
  );
}
