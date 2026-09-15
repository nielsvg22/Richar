"use client";

import { useState } from "react";

export default function SatisfactionRatingEditor({
  bookingId,
  initialRating,
}: {
  bookingId: string;
  initialRating: number | null;
}) {
  const [rating, setRating] = useState(initialRating);
  const [saving, setSaving] = useState(false);

  async function setValue(value: number) {
    const next = rating === value ? null : value;
    setRating(next);
    setSaving(true);
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ satisfactionRating: next }),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
      <h2 className="font-heading text-lg font-bold">Tevredenheid</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Hoe vond de klant dit feestje? Klik nogmaals op een ster om te wissen.
      </p>
      <div className="mt-4 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            disabled={saving}
            onClick={() => setValue(value)}
            aria-label={`${value} van de 5 sterren`}
            className="text-3xl leading-none transition-transform hover:scale-110 disabled:opacity-60"
          >
            {rating !== null && value <= rating ? "⭐" : "☆"}
          </button>
        ))}
      </div>
    </div>
  );
}
