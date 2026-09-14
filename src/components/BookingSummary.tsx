import type { Theme } from "@/lib/themes";
import type { Package } from "@/lib/pricing";
import { calculatePrice, getExtra } from "@/lib/pricing";

export default function BookingSummary({
  theme,
  pkg,
  kids,
  extraIds,
}: {
  theme?: Theme;
  pkg?: Package;
  kids: number;
  extraIds: string[];
}) {
  if (!pkg) {
    return (
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h3 className="font-heading text-lg font-bold">Jouw feestje</h3>
        <p className="mt-3 text-sm text-ink-soft">
          Kies een thema en pakket om de prijs te zien.
        </p>
      </div>
    );
  }

  const { extraKids, extraKidsPrice, extrasPrice, total } = calculatePrice(
    pkg,
    kids,
    extraIds
  );

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h3 className="font-heading text-lg font-bold">Jouw feestje</h3>
      <div className="mt-4 space-y-1 text-sm">
        {theme && (
          <p className="font-semibold">
            {theme.emoji} {theme.name}
          </p>
        )}
        <p className="text-ink-soft">
          {pkg.name} pakket · {kids} kinderen
        </p>
      </div>

      <div className="mt-5 space-y-2 border-t border-ink/10 pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-ink-soft">Basis ({pkg.name})</span>
          <span>€{pkg.price}</span>
        </div>
        {extraKids > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-ink-soft">{extraKids} extra kind(eren)</span>
            <span>€{extraKidsPrice}</span>
          </div>
        )}
        {extraIds.map((id) => {
          const extra = getExtra(id);
          if (!extra) return null;
          const price = extra.unit === "per kind" ? extra.price * kids : extra.price;
          return (
            <div key={id} className="flex items-center justify-between">
              <span className="text-ink-soft">{extra.name}</span>
              <span>€{price}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
        <span className="font-heading text-base font-bold">Totaal</span>
        <span className="font-heading text-2xl font-extrabold text-coral">
          €{total}
        </span>
      </div>
      {extrasPrice + extraKidsPrice > 0 && (
        <p className="mt-3 text-xs text-ink-soft">
          Inclusief gekozen extra&apos;s. Eventuele reiskosten buiten ons
          werkgebied worden apart besproken.
        </p>
      )}
    </div>
  );
}
