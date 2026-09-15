"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm({
  source = "contact",
  messagePlaceholder = "Vertel ons over het feestje dat je in gedachten hebt...",
  submitLabel = "Vraag beschikbaarheid",
}: {
  source?: "contact" | "bedrijven";
  messagePlaceholder?: string;
  submitLabel?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const data = { ...Object.fromEntries(new FormData(form).entries()), source };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
      <div className="rounded-[2rem] bg-mint-soft p-8 text-center">
        <p className="text-3xl">🎉</p>
        <h3 className="mt-3 font-heading text-xl font-bold">
          Bedankt voor je bericht!
        </h3>
        <p className="mt-2 text-ink-soft">
          We nemen binnen 1 werkdag contact met je op.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-semibold">
            Naam
          </label>
          <input
            id="name"
            name="name"
            required
            type="text"
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            placeholder="Jouw naam"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-semibold">
            Telefoonnummer
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            placeholder="06-12345678"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-semibold">
          E-mailadres
        </label>
        <input
          id="email"
          name="email"
          required
          type="email"
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          placeholder="jij@voorbeeld.nl"
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
          rows={5}
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          placeholder={messagePlaceholder}
        />
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-coral-soft px-4 py-3 text-sm text-ink">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-ink px-6 py-4 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5 hover:bg-coral disabled:opacity-60"
      >
        {status === "loading" ? "Versturen..." : submitLabel}
      </button>
    </form>
  );
}
