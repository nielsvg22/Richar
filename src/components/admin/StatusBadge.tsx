import type { BookingStatus } from "@/lib/bookings";

const STATUS_STYLES: Record<BookingStatus, string> = {
  Nieuw: "bg-lavender-soft text-ink",
  "In behandeling": "bg-yellow-soft text-ink",
  Bevestigd: "bg-mint-soft text-ink",
  Betaald: "bg-mint text-ink",
  Afgerond: "bg-ink/10 text-ink-soft",
  Geannuleerd: "bg-coral-soft text-ink",
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
