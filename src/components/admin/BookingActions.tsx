"use client";

import Link from "next/link";
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
  const [paymentLinkStatus, setPaymentLinkStatus] = useState<"idle" | "loading" | "error">("idle");
  const [paymentLinkMessage, setPaymentLinkMessage] = useState("");

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

  async function createPaymentLink() {
    setPaymentLinkStatus("loading");
    setPaymentLinkMessage("");
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Betaallink aanmaken mislukt.");

      try {
        await navigator.clipboard.writeText(body.checkoutUrl);
        setPaymentLinkMessage("Betaallink gekopieerd naar klembord!");
      } catch {
        setPaymentLinkMessage(body.checkoutUrl);
      }
      setPaymentLinkStatus("idle");
    } catch (err) {
      setPaymentLinkStatus("error");
      setPaymentLinkMessage(err instanceof Error ? err.message : "Er ging iets mis.");
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
          <Link
            href={`/admin/facturen/${booking.id}`}
            className="rounded-full border-2 border-ink/10 px-5 py-3 text-center text-sm font-semibold hover:border-coral hover:text-coral"
          >
            Bekijk factuur
          </Link>
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

      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h3 className="font-heading text-lg font-bold">Aanbetaling</h3>
        <p className="mt-1 text-sm text-ink-soft">
          €{booking.depositAmount} aanbetaling via Mollie.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              booking.depositPaid ? "bg-mint-soft text-ink" : "bg-yellow-soft text-ink"
            }`}
          >
            {booking.depositPaid ? "✓ Betaald" : "Nog niet betaald"}
          </span>
        </div>

        {!booking.depositPaid && (
          <button
            type="button"
            onClick={createPaymentLink}
            disabled={paymentLinkStatus === "loading"}
            className="mt-4 w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream hover:bg-coral disabled:opacity-60"
          >
            {paymentLinkStatus === "loading" ? "Bezig..." : "Genereer betaallink"}
          </button>
        )}
        {paymentLinkMessage && (
          <p
            className={`mt-3 break-all text-xs ${
              paymentLinkStatus === "error" ? "text-coral" : "text-ink-soft"
            }`}
          >
            {paymentLinkMessage}
          </p>
        )}
      </div>
    </div>
  );
}
