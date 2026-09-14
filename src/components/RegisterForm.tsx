"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Registreren mislukt.");
      router.push("/account");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-sm font-semibold">Naam</label>
        <input
          name="name"
          type="text"
          required
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
        />
      </div>
      <div>
        <label className="text-sm font-semibold">E-mailadres</label>
        <input
          name="email"
          type="email"
          required
          defaultValue={searchParams.get("email") ?? ""}
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
        />
        <p className="mt-1 text-xs text-ink-soft">
          Gebruik hetzelfde e-mailadres als bij je boeking, dan zie je deze automatisch terug.
        </p>
      </div>
      <div>
        <label className="text-sm font-semibold">Wachtwoord</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
        />
        <p className="mt-1 text-xs text-ink-soft">Minimaal 8 tekens.</p>
      </div>

      {error && <p className="rounded-xl bg-coral-soft px-4 py-3 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-ink px-6 py-4 text-sm font-semibold text-cream hover:bg-coral disabled:opacity-60"
      >
        {status === "loading" ? "Bezig..." : "Account aanmaken"}
      </button>

      <p className="text-center text-sm text-ink-soft">
        Heb je al een account?{" "}
        <Link href="/account/inloggen" className="font-semibold text-coral">
          Log in
        </Link>
      </p>
    </form>
  );
}
