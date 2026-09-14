import Link from "next/link";
import type { Package } from "@/lib/pricing";

export default function PricingCard({ pkg }: { pkg: Package }) {
  return (
    <div
      className={`relative flex flex-col rounded-[2.5rem] p-8 shadow-sm transition-transform hover:-translate-y-1 ${
        pkg.highlight
          ? "bg-ink text-cream shadow-xl lg:scale-105"
          : "bg-white text-ink"
      }`}
    >
      {pkg.highlight && (
        <span className="absolute -top-4 left-8 rounded-full bg-coral px-4 py-1.5 text-xs font-bold text-cream">
          Meest gekozen
        </span>
      )}
      <h3 className="font-heading text-2xl font-bold">{pkg.name}</h3>
      <p className={`mt-2 text-sm ${pkg.highlight ? "text-cream/70" : "text-ink-soft"}`}>
        {pkg.description}
      </p>
      <p className="mt-6 font-heading text-5xl font-extrabold">
        €{pkg.price}
      </p>
      <p className={`mt-1 text-sm ${pkg.highlight ? "text-cream/70" : "text-ink-soft"}`}>
        {pkg.duration} · max {pkg.maxKids} kinderen
      </p>

      <ul className="mt-8 flex-1 space-y-3 text-sm">
        {pkg.includes.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs ${
                pkg.highlight ? "bg-coral text-cream" : "bg-mint-soft text-ink"
              }`}
            >
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      <Link
        href={`/boeken?pakket=${pkg.id}`}
        className={`mt-8 rounded-full px-6 py-3.5 text-center text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
          pkg.highlight ? "bg-coral text-cream" : "bg-ink text-cream"
        }`}
      >
        Kies {pkg.name}
      </Link>
    </div>
  );
}
