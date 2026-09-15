import type { Metadata } from "next";
import Link from "next/link";
import ThemeGrid from "@/components/ThemeGrid";
import CTASection from "@/components/CTASection";
import { getThemes } from "@/lib/themes";

export const metadata: Metadata = {
  title: "Alle kinderfeestjes thema's",
  description:
    "Bekijk alle kinderfeestjes thema's van Rosa & Charlotte: van prinsessenfeest tot wetenschapsfeest. Compleet verzorgd, voor kinderen van 4 t/m 12 jaar.",
};

export const dynamic = "force-dynamic";

export default async function FeestjesPage() {
  const themes = await getThemes();

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-4 pt-14 sm:px-8 sm:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-mint-soft px-4 py-2 text-sm font-semibold">
          🎈 {themes.length} thema&apos;s om uit te kiezen
        </span>
        <h1 className="mt-6 max-w-2xl font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
          Welk feestje past bij jouw jarige?
        </h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Van glitters en glamour tot dino&apos;s en wetenschapsproefjes. Kies
          een thema, of laat je inspireren, en wij maken er een onvergetelijk
          feestje van.
        </p>
        <Link
          href="/quiz"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coral"
        >
          🎁 Twijfel je nog? Doe de quiz
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <ThemeGrid themes={themes} />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-4 sm:px-8">
        <div className="rounded-[2.5rem] bg-lavender-soft p-8 text-center sm:p-12">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            Jouw favoriete thema staat er niet bij?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-ink/70">
            Geen probleem! We denken graag mee over een thema op maat.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream hover:bg-coral"
          >
            Vraag een thema op maat aan
          </Link>
        </div>
      </section>

      <CTASection />
    </>
  );
}
