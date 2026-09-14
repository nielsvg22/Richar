"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Booking } from "@/lib/bookings";
import type { BlockedDate } from "@/lib/blockedDates";

const WEEKDAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

const STATUS_DOT: Record<Booking["status"], string> = {
  Nieuw: "bg-lavender",
  "In behandeling": "bg-yellow-500",
  Bevestigd: "bg-mint",
  Betaald: "bg-mint",
  Afgerond: "bg-ink/30",
  Geannuleerd: "bg-coral",
};

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function CalendarMonth({
  year,
  month,
  bookings,
  blockedDates,
}: {
  year: number;
  month: number; // 0-indexed
  bookings: Booking[];
  blockedDates: BlockedDate[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const bookingsByDate = new Map<string, Booking[]>();
  for (const booking of bookings) {
    const key = booking.date;
    const list = bookingsByDate.get(key) ?? [];
    list.push(booking);
    bookingsByDate.set(key, list);
  }

  const blockedByDate = new Map(blockedDates.map((b) => [b.date, b]));

  const cells: (Date | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const todayKey = toDateKey(new Date());

  async function toggleBlock(key: string, isBlocked: boolean) {
    setPending(key);
    try {
      if (isBlocked) {
        await fetch(`/api/blocked-dates/${key}`, { method: "DELETE" });
      } else {
        const reason = window.prompt("Reden voor het blokkeren (optioneel):", "") ?? "";
        await fetch("/api/blocked-dates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: key, reason }),
        });
      }
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
      <div className="grid grid-cols-7 border-b border-ink/10 text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {WEEKDAYS.map((day) => (
          <div key={day} className="px-3 py-3 text-center">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((date, i) => {
          if (!date) {
            return <div key={i} className="min-h-[120px] border-b border-r border-ink/5 bg-cream-soft/40" />;
          }
          const key = toDateKey(date);
          const dayBookings = bookingsByDate.get(key) ?? [];
          const blocked = blockedByDate.get(key);
          const isToday = key === todayKey;
          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <div
              key={i}
              className={`group relative min-h-[120px] border-b border-r border-ink/5 p-2 last:border-r-0 ${
                blocked ? "bg-coral-soft/30" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    isToday ? "bg-coral text-cream" : "text-ink-soft"
                  }`}
                >
                  {date.getDate()}
                </span>
                {!isPast && (
                  <button
                    type="button"
                    disabled={pending === key}
                    onClick={() => toggleBlock(key, Boolean(blocked))}
                    title={blocked ? "Deblokkeer deze dag" : "Blokkeer deze dag"}
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs opacity-0 transition-opacity hover:bg-ink/10 group-hover:opacity-100 ${
                      blocked ? "opacity-100 text-coral" : "text-ink-soft"
                    }`}
                  >
                    {blocked ? "🚫" : "🔓"}
                  </button>
                )}
              </div>

              {blocked && (
                <p className="mt-1 truncate text-[11px] font-semibold text-coral" title={blocked.reason}>
                  Geblokkeerd{blocked.reason ? `: ${blocked.reason}` : ""}
                </p>
              )}

              <div className="mt-1 space-y-1">
                {dayBookings.slice(0, 3).map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/admin/boekingen/${booking.id}`}
                    className="flex items-center gap-1.5 truncate rounded-lg bg-cream-soft px-1.5 py-1 text-[11px] font-medium hover:bg-mint-soft"
                    title={`${booking.themeName} · ${booking.childName}`}
                  >
                    <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${STATUS_DOT[booking.status]}`} />
                    <span className="truncate">{booking.childName}</span>
                  </Link>
                ))}
                {dayBookings.length > 3 && (
                  <p className="px-1.5 text-[11px] text-ink-soft">
                    +{dayBookings.length - 3} meer
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
