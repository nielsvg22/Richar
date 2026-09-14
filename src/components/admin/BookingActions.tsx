"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Booking, BookingStatus } from "@/lib/bookings";
import StatusBadge from "./StatusBadge";

const NEXT_STATUS: Partial<Record<BookingStatus, BookingStatus>> = {
  Nieuw: "In behandeling",
  "In behandeling": "Bevestigd",
  Bevestigd: "Betaald",
  Betaald: "Afgerond",
};

export default function BookingActions({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: BookingStatus) {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  const next = NEXT_STATUS[status];

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold">Status</h3>
        <StatusBadge status={status} />
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {next && (
          <button
            type="button"
            disabled={loading}
            onClick={() => updateStatus(next)}
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream hover:bg-coral disabled:opacity-60"
          >
            Markeer als &ldquo;{next}&rdquo;
          </button>
        )}
        <a
          href={`mailto:${booking.email}`}
          className="rounded-full border-2 border-ink/10 px-5 py-3 text-center text-sm font-semibold hover:border-coral hover:text-coral"
        >
          Contact opnemen
        </a>
        {status !== "Geannuleerd" && status !== "Afgerond" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => updateStatus("Geannuleerd")}
            className="rounded-full px-5 py-3 text-sm font-semibold text-coral hover:bg-coral-soft disabled:opacity-60"
          >
            Boeking annuleren
          </button>
        )}
      </div>
    </div>
  );
}
