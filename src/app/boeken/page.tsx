import type { Metadata } from "next";
import { Suspense } from "react";
import BookingWizard from "@/components/BookingWizard";
import { getThemes } from "@/lib/themes";

export const metadata: Metadata = {
  title: "Boek jouw feestje",
  description:
    "Boek eenvoudig jullie kinderfeestje in een paar stappen: kies een thema, pakket, datum en extra's. Zie direct de totaalprijs.",
};

export const dynamic = "force-dynamic";

export default async function BoekenPage() {
  const themes = await getThemes();

  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <h1 className="font-heading text-4xl font-extrabold sm:text-5xl">
          Boek jouw feestje
        </h1>
        <p className="mt-4 text-ink-soft">
          In een paar minuten geregeld. Geen gedoe, gewoon een vrolijk
          feestje.
        </p>
      </div>
      <Suspense fallback={<div className="text-center text-ink-soft">Laden...</div>}>
        <BookingWizard themes={themes} />
      </Suspense>
    </section>
  );
}
