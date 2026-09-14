const CHART_HEIGHT = 180;
const BAR_MAX_WIDTH = 24;

export default function RevenueChart({
  data,
}: {
  data: { key: string; label: string; revenue: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.revenue));
  const niceMax = Math.ceil(max / 500) * 500 || 500;

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h3 className="font-heading text-base font-bold">Omzet per maand</h3>
      <p className="text-xs text-ink-soft">Laatste {data.length} maanden</p>

      <div className="mt-6 flex items-end gap-3" style={{ height: CHART_HEIGHT }}>
        {data.map((d) => {
          const barHeight = Math.max(2, (d.revenue / niceMax) * (CHART_HEIGHT - 24));
          return (
            <div key={d.key} className="flex flex-1 flex-col items-center justify-end">
              {d.revenue > 0 && (
                <span className="mb-1 text-[11px] font-semibold text-ink">
                  €{d.revenue.toLocaleString("nl-NL")}
                </span>
              )}
              <div
                title={`${d.label}: €${d.revenue.toLocaleString("nl-NL")}`}
                className="w-full rounded-t-[4px] bg-coral transition-opacity hover:opacity-80"
                style={{
                  height: barHeight,
                  maxWidth: BAR_MAX_WIDTH,
                  marginInline: "auto",
                }}
              />
              <span className="mt-2 text-[11px] font-semibold uppercase text-ink-soft">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 border-t border-ink/10" />
    </div>
  );
}
