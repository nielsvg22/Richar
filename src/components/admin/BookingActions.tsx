"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Booking, BookingStatus, EmailType } from "@/lib/bookings";
import StatusBadge from "./StatusBadge";

const NEXT_STATUS: Partial<Record<BookingStatus, BookingStatus>> = {
  Nieuw: "In behandeling",
  "In behandeling": "Bevestigd",
  Bevestigd: "Betaald",
  Betaald: "Afgerond",
};

const EMAIL_LABELS: Record<EmailType, { label: string; description: string }> = {
  confirmation: { label: "Bevestigingsmail", description: "Bedankt voor je boeking!" },
  reminder: { label: "Herinnering", description: "Bijna feest! 🎉" },
  review: { label: "Reviewverzoek", description: "Hoe vonden jullie het?" },
};

export default function BookingActions({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [emailsSent, setEmailsSent] = useState<EmailType[]>(booking.emailsSent ?? []);
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState<EmailType | null>(null);
  const [emailError, setEmailError] = useState("");

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

  async function sendEmail(type: EmailType) {
    setSendingEmail(type);
    setEmailError("");
    try {
      const res = await fetch(`/api/bookings/${booking.id}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Versturen mislukt.");
      }
      setEmailsSent((prev) => (prev.includes(type) ? prev : [...prev, type]));
      router.refresh();
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Versturen mislukt.");
    } finally {
      setSendingEmail(null);
    }
  }

  const next = NEXT_STATUS[status];

  return (
    <div className="space-y-6">
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

      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h3 className="font-heading text-lg font-bold">E-mails</h3>
        <p className="mt-1 text-sm text-ink-soft">
          Verstuur automatische e-mails naar {booking.email}.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {(Object.keys(EMAIL_LABELS) as EmailType[]).map((type) => {
            const isSent = emailsSent.includes(type);
            return (
              <button
                key={type}
                type="button"
                disabled={sendingEmail === type}
                onClick={() => sendEmail(type)}
                className="flex items-center justify-between rounded-2xl border-2 border-ink/10 px-4 py-3 text-left text-sm hover:border-coral disabled:opacity-60"
              >
                <span>
                  <span className="block font-semibold">{EMAIL_LABELS[type].label}</span>
                  <span className="block text-xs text-ink-soft">
                    {EMAIL_LABELS[type].description}
                  </span>
                </span>
                <span className="whitespace-nowrap text-xs font-semibold">
                  {sendingEmail === type
                    ? "Versturen..."
                    : isSent
                      ? "✓ Verstuurd"
                      : "Versturen"}
                </span>
              </button>
            );
          })}
        </div>

        {emailError && (
          <p className="mt-4 rounded-xl bg-coral-soft px-4 py-3 text-sm">{emailError}</p>
        )}
      </div>
    </div>
  );
}
