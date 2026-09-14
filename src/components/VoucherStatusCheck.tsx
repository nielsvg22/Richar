"use client";

import { useEffect, useState } from "react";

type Status = "checking" | "active" | "pending" | "failed";

export default function VoucherStatusCheck({ code }: { code: string }) {
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
          const res = await fetch(`/api/vouchers/status?code=${code}`);
          const body = await res.json();
          if (cancelled) return;
          if (body.active) {
            setStatus("active");
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
  }, [attempts, code]);

  if (status === "checking") {
    return (
      <div className="rounded-2xl bg-cream-soft p-6 text-center">
        <p className="text-sm text-ink-soft">Betaalstatus controleren...</p>
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="rounded-[2rem] bg-mint-soft p-8 text-center">
        <p className="text-3xl">🎁</p>
        <p className="mt-2 font-semibold">Cadeaubon is actief!</p>
        <p className="mt-2 text-sm text-ink-soft">
          We hebben de cadeaubon met code
        </p>
        <p className="mt-1 font-heading text-2xl font-extrabold tracking-wide">{code}</p>
        <p className="mt-2 text-sm text-ink-soft">verstuurd naar je e-mailadres.</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="rounded-[2rem] bg-coral-soft p-8 text-center">
        <p className="text-3xl">😕</p>
        <p className="mt-2 font-semibold">De betaling is niet gelukt</p>
        <p className="mt-1 text-sm text-ink-soft">
          Probeer het opnieuw of neem contact met ons op.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] bg-yellow-soft p-8 text-center">
      <p className="text-3xl">⏳</p>
      <p className="mt-2 font-semibold">Betaling wordt nog verwerkt</p>
      <p className="mt-1 text-sm text-ink-soft">
        Dit kan soms even duren, we mailen de cadeaubon zodra deze binnen is.
      </p>
    </div>
  );
}
