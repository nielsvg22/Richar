"use client";

import { useState } from "react";

export default function PayDepositButton({
  bookingId,
  amount,
  compact = false,
}: {
  bookingId: string;
  amount: number;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handlePay() {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Betalen mislukt.");
      window.location.href = body.checkoutUrl;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handlePay}
        disabled={status === "loading"}
        className="whitespace-nowrap rounded-full bg-coral px-4 py-2 text-xs font-semibold text-white hover:bg-ink disabled:opacity-60"
      >
        {status === "loading" ? "Bezig..." : "Betaal nu"}
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handlePay}
        disabled={status === "loading"}
        className="w-full rounded-full bg-coral px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-ink disabled:opacity-60"
      >
        {status === "loading" ? "Bezig..." : `Betaal aanbetaling — €${amount}`}
      </button>
      {status === "error" && (
        <p className="mt-3 rounded-xl bg-coral-soft px-4 py-3 text-sm text-ink">{error}</p>
      )}
    </div>
  );
}
