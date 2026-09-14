"use client";

import { useEffect, useState } from "react";

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

export default function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (date: string) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initial = value ? new Date(value) : today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [availability, setAvailability] = useState<Record<string, DayInfo>>({});

  useEffect(() => {
    let cancelled = false;
    const monthParam = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;
    fetch(`/api/availability?month=${monthParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAvailability(data.days ?? {});
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

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream-soft"
          aria-label="Vorige maand"
        >
          ←
        </button>
        <p className="text-sm font-semibold capitalize">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </p>
        <button
          type="button"
          onClick={goNext}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream-soft"
          aria-label="Volgende maand"
        >
          →
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink-soft">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const key = toDateKey(date);
          const isPast = date < today;
          const info = availability[key];
          const isFull = Boolean(info?.full);
          const disabled = isPast || isFull;
          const isSelected = value === key;

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onChange(key)}
              title={info?.blocked ? "Deze dag is niet beschikbaar" : isFull ? "Deze dag zit al vol" : undefined}
              className={`relative flex h-9 items-center justify-center rounded-xl text-sm transition-colors ${
                isSelected
                  ? "bg-coral text-cream font-semibold"
                  : disabled
                    ? "cursor-not-allowed text-ink/20 line-through"
                    : "hover:bg-mint-soft"
              }`}
            >
              {date.getDate()}
              {info && !isFull && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-yellow-500" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-yellow-500" /> bijna vol
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ink/20" /> volgeboekt
        </span>
      </div>
    </div>
  );
}
