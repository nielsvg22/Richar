import type { Metadata } from "next";
import Link from "next/link";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";

export const metadata: Metadata = {
  title: "Beschikbaarheid",
  description:
    "Bekijk direct welke datums nog beschikbaar zijn voor een kinderfeestje bij Rosa & Charlotte.",
};

export default function BeschikbaarheidPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-5 pt-14 text-center sm:px-8 sm:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-mint-soft px-4 py-2 text-sm font-semibold">
          🗓️ Direct zien wat er nog kan
        </span>
        <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
          Beschikbaarheid
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">
          Kies een groene of gele datum en start direct met boeken. Twijfel je nog? Kies gewoon
          een datum, je kunt alles later nog aanpassen.
        </p>
      </section>

      <section className="mx-auto max-w-2xl px-5 py-12 sm:px-8">
        <AvailabilityCalendar />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="rounded-[2.5rem] bg-lavender-soft p-8 text-center sm:p-12">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            Liever eerst overleggen?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-ink/70">
            Geen probleem, we denken graag met je mee over de beste datum.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream hover:bg-coral"
          >
            Neem contact op
          </Link>
        </div>
      </section>
    </>
  );
}
