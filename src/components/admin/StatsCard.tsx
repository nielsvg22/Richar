export default function StatsCard({
  label,
  value,
  emoji,
  accent = "bg-mint-soft",
}: {
  label: string;
  value: string;
  emoji: string;
  accent?: string;
}) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">
      <span className={`flex h-11 w-11 items-center justify-center rounded-full ${accent} text-lg`}>
        {emoji}
      </span>
      <p className="mt-5 font-heading text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-sm text-ink-soft">{label}</p>
    </div>
  );
}
