import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locations, getLocation } from "@/lib/locations";
import { getThemes } from "@/lib/themes";
import ThemeGrid from "@/components/ThemeGrid";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return locations.map((l) => ({ plaats: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ plaats: string }>;
}): Promise<Metadata> {
  const { plaats } = await params;
  const location = getLocation(plaats);
  if (!location) return {};

  return {
    title: `Kinderfeestje ${location.name} | Rosa & Charlotte`,
    description: `Op zoek naar een compleet verzorgd kinderfeestje in ${location.name}? Rosa & Charlotte regelen thema, decoratie en begeleiding. Bekijk de mogelijkheden.`,
  };
}

export default async function KinderfeestjePlaatsPage({
  params,
}: {
  params: Promise<{ plaats: string }>;
}) {
  const { plaats } = await params;
  const location = getLocation(plaats);
  if (!location) notFound();

  const themes = (await getThemes()).slice(0, 8);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: `Rosa & Charlotte Kinderfeestjes — ${location.name}`,
          areaServed: location.name,
          priceRange: "€149-€299",
        }}
      />

      <section className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-mint-soft px-4 py-2 text-sm font-semibold">
          📍 {location.name}
        </span>
        <h1 className="mt-6 max-w-2xl font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
          Kinderfeestje organiseren in {location.name}
        </h1>
        <p className="mt-4 max-w-xl text-ink-soft">{location.intro}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/boeken"
            className="rounded-full bg-ink px-8 py-4 text-center text-base font-semibold text-cream hover:bg-coral"
          >
            Boek jouw feestje in {location.name}
          </Link>
          <Link
            href="/feestjes"
            className="rounded-full border-2 border-ink/10 bg-white/60 px-8 py-4 text-center text-base font-semibold hover:border-coral hover:text-coral"
          >
            Bekijk alle thema&apos;s
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="rounded-[2.5rem] bg-white p-8 sm:p-10">
          <h2 className="font-heading text-xl font-bold">
            Actief in heel {location.name}
          </h2>
          <p className="mt-3 text-ink-soft">
            We komen bij jullie thuis of op locatie, in onder andere:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {location.areas.map((area) => (
              <span
                key={area}
                className="rounded-full bg-cream-soft px-4 py-2 text-sm font-semibold"
              >
                {area}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink-soft">{location.travelNote}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8">
        <h2 className="font-heading text-2xl font-bold">
          Populaire thema&apos;s voor een kinderfeestje in {location.name}
        </h2>
        <div className="mt-8">
          <ThemeGrid themes={themes} />
        </div>
      </section>

      <PricingSection />

      <section className="mx-auto max-w-4xl px-5 pb-4 sm:px-8">
        <h2 className="font-heading text-2xl font-bold">
          Veelgestelde vragen over kinderfeestjes in {location.name}
        </h2>
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-white p-6">
            <p className="font-semibold">Komen jullie ook buiten {location.name}?</p>
            <p className="mt-2 text-sm text-ink-soft">
              Ja, we zijn ook actief in de rest van de regio. Neem contact op om de
              mogelijkheden voor jouw adres te bespreken.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6">
            <p className="font-semibold">Kunnen jullie ook op locatie in {location.name} feesten?</p>
            <p className="mt-2 text-sm text-ink-soft">
              Zeker, naast feestjes bij jullie thuis organiseren we ook feestjes op een
              gehuurde locatie of feestzaal in {location.name}.
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
