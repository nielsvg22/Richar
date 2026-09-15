import type { Metadata } from "next";
import { getThemes } from "@/lib/themes";
import ThemeQuiz from "@/components/ThemeQuiz";

export const metadata: Metadata = {
  title: "Welk feestje past bij jouw kind?",
  description:
    "Doe de korte quiz en ontdek binnen 30 seconden welk kinderfeestje-thema perfect bij jullie jarige past.",
};

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const themes = await getThemes();

  return (
    <section className="mx-auto max-w-5xl px-5 pb-20 pt-14 sm:px-8 sm:pt-20">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-pink-soft px-4 py-2 text-sm font-semibold">
          🎁 Cadeauzoeker
        </span>
        <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
          Welk feestje past bij
          <br className="hidden sm:block" /> jullie jarige?
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          Beantwoord twee korte vragen en we laten je meteen de leukste thema&apos;s zien.
        </p>
      </div>

      <div className="mt-12">
        <ThemeQuiz themes={themes} />
      </div>
    </section>
  );
}
