export default function ThemeRevenueChart({
  data,
}: {
  data: { name: string; revenue: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.revenue));

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h3 className="font-heading text-base font-bold">Omzet per thema</h3>
      <p className="text-xs text-ink-soft">Top {data.length} thema&apos;s</p>

      <div className="mt-6 space-y-3">
        {data.map((d) => {
          const widthPct = Math.max(4, (d.revenue / max) * 100);
          return (
            <div key={d.name}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-semibold">{d.name}</span>
                <span className="text-ink-soft">€{d.revenue.toLocaleString("nl-NL")}</span>
              </div>
              <div className="h-[10px] w-full rounded-r-[4px] bg-cream-soft">
                <div
                  title={`${d.name}: €${d.revenue.toLocaleString("nl-NL")}`}
                  className="h-[10px] rounded-r-[4px] bg-mint transition-opacity hover:opacity-80"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
        {data.length === 0 && (
          <p className="text-sm text-ink-soft">Nog geen boekingen om weer te geven.</p>
        )}
      </div>
    </div>
  );
}
