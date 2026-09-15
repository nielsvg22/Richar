"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Order } from "@/lib/orders";

export default function OrderActions({ order }: { order: Order }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function markFulfilled() {
    setLoading(true);
    try {
      await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "fulfilled" }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (order.status !== "paid") return null;

  return (
    <button
      type="button"
      onClick={markFulfilled}
      disabled={loading}
      className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coral disabled:opacity-60"
    >
      {loading ? "Bezig..." : "Markeer als afgehandeld"}
    </button>
  );
}
