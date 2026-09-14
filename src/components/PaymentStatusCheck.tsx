"use client";

import { useEffect, useState } from "react";

type Status = "checking" | "paid" | "pending" | "failed";

export default function PaymentStatusCheck({ bookingId }: { bookingId: string }) {
  const [status, setStatus] = useState<Status>("checking");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (attempts > 5) {
      const timer = setTimeout(() => {
        if (!cancelled) setStatus((s) => (s === "checking" ? "pending" : s));
      }, 0);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    const timer = setTimeout(
      async () => {
        try {
          const res = await fetch(`/api/payments/status?bookingId=${bookingId}`);
          const body = await res.json();
          if (cancelled) return;
          if (body.depositPaid) {
            setStatus("paid");
          } else if (body.status === "failed" || body.status === "canceled" || body.status === "expired") {
            setStatus("failed");
          } else {
            setAttempts((a) => a + 1);
          }
        } catch {
          if (!cancelled) setAttempts((a) => a + 1);
        }
      },
      attempts === 0 ? 0 : 2000
    );

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [attempts, bookingId]);

  if (status === "checking") {
    return (
      <div className="rounded-2xl bg-cream-soft p-6 text-center">
        <p className="text-sm text-ink-soft">Betaalstatus controleren...</p>
      </div>
    );
  }

  if (status === "paid") {
    return (
      <div className="rounded-2xl bg-mint-soft p-6 text-center">
        <p className="text-3xl">✅</p>
        <p className="mt-2 font-semibold">Aanbetaling ontvangen!</p>
        <p className="mt-1 text-sm text-ink-soft">
          Jullie plek is definitief gereserveerd. We sturen een bevestiging per e-mail.
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="rounded-2xl bg-coral-soft p-6 text-center">
        <p className="text-3xl">😕</p>
        <p className="mt-2 font-semibold">De betaling is niet gelukt</p>
        <p className="mt-1 text-sm text-ink-soft">
          Geen zorgen, je boeking blijft staan. Neem contact met ons op om het opnieuw te
          proberen of op een andere manier te betalen.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-yellow-soft p-6 text-center">
      <p className="text-3xl">⏳</p>
      <p className="mt-2 font-semibold">Betaling wordt nog verwerkt</p>
      <p className="mt-1 text-sm text-ink-soft">
        Dit kan soms even duren. We laten je weten zodra de betaling binnen is.
      </p>
    </div>
  );
}
