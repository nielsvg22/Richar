import { packages } from "@/lib/pricing";
import PricingCard from "./PricingCard";

export default function PricingSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
          Een feestje voor ieder budget
        </h2>
        <p className="mt-4 text-ink-soft">
          Alle pakketten zijn all-in: geen verrassingen achteraf. Kies wat bij
          jullie past en vul eventueel aan met extra&apos;s.
        </p>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {packages.map((pkg) => (
          <PricingCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </section>
  );
}
