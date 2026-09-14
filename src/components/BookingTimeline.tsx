import type { BookingStatus } from "@/lib/bookings";

const STEPS: BookingStatus[] = ["Nieuw", "In behandeling", "Bevestigd", "Betaald", "Afgerond"];

const STEP_LABELS: Record<BookingStatus, string> = {
  Nieuw: "Aangevraagd",
  "In behandeling": "In behandeling",
  Bevestigd: "Bevestigd",
  Betaald: "Betaald",
  Afgerond: "Afgerond",
  Geannuleerd: "Geannuleerd",
};

export default function BookingTimeline({ status }: { status: BookingStatus }) {
  if (status === "Geannuleerd") {
    return (
      <div className="rounded-2xl bg-coral-soft px-4 py-3 text-center text-sm font-semibold">
        Deze boeking is geannuleerd.
      </div>
    );
  }

  const activeIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => (
        <div key={step} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                i <= activeIndex ? "bg-coral text-white" : "bg-ink/10 text-ink-soft"
              }`}
            >
              {i < activeIndex ? "✓" : i + 1}
            </span>
            <span
              className={`hidden text-center text-[11px] font-semibold sm:block ${
                i <= activeIndex ? "text-ink" : "text-ink-soft"
              }`}
            >
              {STEP_LABELS[step]}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`mx-2 h-1 flex-1 rounded-full ${
                i < activeIndex ? "bg-coral" : "bg-ink/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
