"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Inloggen mislukt.");
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
        <label className="text-sm font-semibold">E-mailadres</label>
        <input
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
        />
      </div>
      <div>
        <label className="text-sm font-semibold">Wachtwoord</label>
        <input
          name="password"
          type="password"
          required
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
        />
      </div>

      {error && <p className="rounded-xl bg-coral-soft px-4 py-3 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-ink px-6 py-4 text-sm font-semibold text-cream hover:bg-coral disabled:opacity-60"
      >
        {status === "loading" ? "Bezig..." : "Inloggen"}
      </button>

      <p className="text-center text-sm text-ink-soft">
        Nog geen account?{" "}
        <Link href="/account/registreren" className="font-semibold text-coral">
          Maak er een aan
        </Link>
      </p>
    </form>
  );
}
