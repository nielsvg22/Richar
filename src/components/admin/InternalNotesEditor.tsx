"use client";

import { useState } from "react";

export default function InternalNotesEditor({
  bookingId,
  initialNotes,
}: {
  bookingId: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [saved, setSaved] = useState(initialNotes);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const dirty = notes !== saved;

  async function handleSave() {
    setStatus("loading");
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNotes: notes }),
      });
      if (!res.ok) throw new Error();
      setSaved(notes);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold">Interne notities</h2>
        <span className="rounded-full bg-lavender-soft px-3 py-1 text-xs font-semibold">
          Alleen zichtbaar voor jullie team
        </span>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Bijv. bijzonderheden over deze klant, hoe het feestje ging, of iets om
        volgende keer op te letten.
      </p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        placeholder="Nog geen notities..."
        className="mt-4 w-full rounded-2xl border border-ink/10 bg-cream-soft px-4 py-3 text-sm focus:border-coral focus:outline-none"
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || status === "loading"}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-coral disabled:opacity-40"
        >
          {status === "loading" ? "Opslaan..." : "Notitie opslaan"}
        </button>
        {status === "error" && (
          <span className="text-sm text-coral">Opslaan mislukt, probeer opnieuw.</span>
        )}
        {!dirty && status === "idle" && saved && (
          <span className="text-xs text-ink-soft">Opgeslagen</span>
        )}
      </div>
    </div>
  );
}
