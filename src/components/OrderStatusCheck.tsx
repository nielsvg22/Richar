"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartContext";

type Status = "checking" | "paid" | "pending" | "failed";

export default function OrderStatusCheck({ orderId }: { orderId: string }) {
  const { clear } = useCart();
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
          const res = await fetch(`/api/webshop/orders/status?order=${orderId}`);
          const body = await res.json();
          if (cancelled) return;
          if (body.paid) {
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
  }, [attempts, orderId]);

  useEffect(() => {
    if (status === "paid") clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === "checking") {
    return (
      <div className="rounded-2xl bg-cream-soft p-6 text-center">
        <p className="text-sm text-ink-soft">Betaalstatus controleren...</p>
      </div>
    );
  }

  if (status === "paid") {
    return (
      <div className="rounded-[2rem] bg-mint-soft p-8 text-center">
        <p className="text-3xl">🎁</p>
        <p className="mt-2 font-semibold">Bedankt voor je bestelling!</p>
        <p className="mt-2 text-sm text-ink-soft">
          We hebben een bevestiging gestuurd naar je e-mailadres.
        </p>
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
        Dit kan soms even duren, we mailen de bevestiging zodra deze binnen is.
      </p>
    </div>
  );
}
