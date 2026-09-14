import type { Metadata } from "next";
import Image from "next/image";
import CTASection from "@/components/CTASection";
import ReviewSection from "@/components/ReviewSection";
import { getSiteImageSlot, siteImageUrl } from "@/lib/siteImages";

export const metadata: Metadata = {
  title: "Over ons",
  description:
    "Maak kennis met Rosa & Charlotte: twee enthousiaste ondernemers die kinderfeestjes organiseren die niemand snel vergeet.",
};

export const dynamic = "force-dynamic";

const values = [
  {
    emoji: "💛",
    title: "Persoonlijk",
    text: "Wij zijn zelf aanwezig bij ieder feestje. Geen anoniem bureau, maar Rosa en Charlotte in eigen persoon.",
  },
  {
    emoji: "🎨",
    title: "Creatief",
    text: "Wij bedenken zelf onze thema's, decoraties en activiteiten. Alles met liefde en oog voor detail gemaakt.",
  },
  {
    emoji: "🤝",
    title: "Betrouwbaar",
    text: "Duidelijke afspraken, transparante prijzen en een team dat altijd op tijd en goed voorbereid aanwezig is.",
  },
];

export default function OverOnsPage() {
  const jungleSlot = getSiteImageSlot("team-jungle-party");
  const officeSlot = getSiteImageSlot("team-office");
  const jungleUrl = (jungleSlot && siteImageUrl(jungleSlot)) || "/images/team-jungle-party.jpg";
  const officeUrl = (officeSlot && siteImageUrl(officeSlot)) || "/images/team-office.jpg";

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-coral-soft px-4 py-2 text-sm font-semibold">
              👋 Over ons
            </span>
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
              Wij zijn Rosa &amp; Charlotte
            </h1>
            <p className="mt-6 text-lg text-ink-soft">
              Wij leerden elkaar kennen tijdens het organiseren van een
              verjaardagsfeest voor onze eigen kinderen &ndash; en merkten al
              snel dat we allebei hetzelfde vonden: kinderfeestjes mogen best
              wat meer glans hebben, zonder dat ouders zich rot moeten
              organiseren.
            </p>
            <p className="mt-4 text-ink-soft">
              Vanuit die gedachte startten we Rosa &amp; Charlotte
              Kinderfeestjes. Inmiddels hebben we honderden feestjes vol
              glitters, confetti en blije kindergezichten georganiseerd &ndash;
              en dat aantal groeit iedere maand.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] translate-y-8 overflow-hidden rounded-[2.5rem] blob">
              <Image
                src={jungleUrl}
                alt="Rosa & Charlotte tijdens een kinderfeestje"
                fill
                unoptimized
                sizes="(min-width: 1024px) 25vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] blob-2">
              <Image
                src={officeUrl}
                alt="Rosa & Charlotte aan het werk"
                fill
                unoptimized
                sizes="(min-width: 1024px) 25vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <h2 className="text-center font-heading text-3xl font-extrabold sm:text-4xl">
          Waar wij voor staan
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-[2.5rem] bg-white p-8">
              <span className="text-3xl">{value.emoji}</span>
              <h3 className="mt-4 font-heading text-xl font-bold">
                {value.title}
              </h3>
              <p className="mt-2 text-ink-soft">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-4 sm:px-8">
        <div className="rounded-[3rem] bg-lavender-soft p-10 text-center sm:p-16">
          <p className="mx-auto max-w-2xl font-heading text-2xl font-bold leading-snug sm:text-3xl">
            &ldquo;Wij vinden dat een kinderfeestje voor ouders óók leuk moet
            zijn.&rdquo;
          </p>
          <p className="mt-4 text-sm font-semibold text-ink/60">
            &mdash; Rosa &amp; Charlotte
          </p>
        </div>
      </section>

      <ReviewSection />
      <CTASection />
    </>
  );
}
