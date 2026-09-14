import type { Metadata } from "next";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import { extras, EXTRA_CHILD_PRICE } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Prijzen",
  description:
    "Transparante prijzen voor kinderfeestjes: Mini vanaf €149, Fun vanaf €199 en Deluxe vanaf €299. Geen verborgen kosten, alles inclusief.",
};

export default function PrijzenPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-14 text-center sm:px-8 sm:pt-20">
        <h1 className="font-heading text-4xl font-extrabold sm:text-5xl">
          Transparante prijzen,
          <br className="hidden sm:block" /> geen verrassingen
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">
          Onze pakketten zijn all-in. Wil je nog iets extra&apos;s? Dat kan
          altijd, met duidelijke prijzen vooraf.
        </p>
      </section>

      <PricingSection />

      <section className="mx-auto max-w-4xl px-5 pb-20 sm:px-8">
        <div className="rounded-[2.5rem] bg-white p-8 sm:p-10">
          <h2 className="font-heading text-2xl font-bold">Extra&apos;s</h2>
          <p className="mt-2 text-ink-soft">
            Maak je feestje nog completer met onderstaande extra&apos;s.
          </p>
          <div className="mt-6 divide-y divide-ink/10">
            {extras.map((extra) => (
              <div
                key={extra.id}
                className="flex items-center justify-between gap-6 py-4"
              >
                <div>
                  <p className="font-semibold">{extra.name}</p>
                  <p className="text-sm text-ink-soft">{extra.description}</p>
                </div>
                <p className="whitespace-nowrap font-heading font-bold text-coral">
                  €{extra.price}
                  {extra.unit === "per kind" && (
                    <span className="text-xs font-normal text-ink-soft">
                      {" "}
                      /kind
                    </span>
                  )}
                </p>
              </div>
            ))}
            <div className="flex items-center justify-between gap-6 py-4">
              <div>
                <p className="font-semibold">Extra kind</p>
                <p className="text-sm text-ink-soft">
                  Boven het maximaal aantal kinderen van je pakket.
                </p>
              </div>
              <p className="whitespace-nowrap font-heading font-bold text-coral">
                €{EXTRA_CHILD_PRICE}
                <span className="text-xs font-normal text-ink-soft"> /kind</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
