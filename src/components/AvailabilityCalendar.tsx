"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const WEEKDAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
const MONTH_NAMES = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

type DayInfo = { count: number; full: boolean; blocked?: boolean };

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function AvailabilityCalendar() {
  const router = useRouter();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [availability, setAvailability] = useState<Record<string, DayInfo>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const monthParam = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;
    fetch(`/api/availability?month=${monthParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAvailability(data.days ?? {});
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [viewYear, viewMonth]);

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function goPrev() {
    const d = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  function goNext() {
    const d = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  function selectDate(key: string) {
    router.push(`/boeken?datum=${key}`);
  }

  return (
    <div className="rounded-[2.5rem] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-soft"
          aria-label="Vorige maand"
        >
          ←
        </button>
        <p className="font-heading text-lg font-bold capitalize">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </p>
        <button
          type="button"
          onClick={goNext}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-soft"
          aria-label="Volgende maand"
        >
          →
        </button>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-ink-soft">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-1.5 grid grid-cols-7 gap-1.5">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const key = toDateKey(date);
          const isPast = date < today;
          const info = availability[key];
          const isFull = Boolean(info?.full);
          const disabled = isPast || isFull || loading;
          const isAlmostFull = Boolean(info) && !isFull;

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => selectDate(key)}
              title={
                info?.blocked
                  ? "Niet beschikbaar"
                  : isFull
                    ? "Deze dag zit al vol"
                    : isAlmostFull
                      ? "Nog een beperkt aantal plekken"
                      : "Beschikbaar"
              }
              className={`relative flex h-11 items-center justify-center rounded-2xl text-sm font-semibold transition-colors ${
                isPast
                  ? "cursor-not-allowed text-ink/15"
                  : isFull
                    ? "cursor-not-allowed bg-coral-soft/40 text-ink/30 line-through"
                    : isAlmostFull
                      ? "bg-yellow-soft hover:-translate-y-0.5 hover:shadow-md"
                      : "bg-mint-soft hover:-translate-y-0.5 hover:shadow-md"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-mint-soft" /> Beschikbaar
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-yellow-soft" /> Bijna vol
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-coral-soft/40" /> Volgeboekt
        </span>
      </div>
    </div>
  );
}
