import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedWorkshops } from "@/lib/workshops";
import { getWorkshopMainImageUrl } from "@/lib/workshopImages";
import { getSiteImageSlot, siteImageUrl } from "@/lib/siteImages";
import WorkshopGrid from "@/components/WorkshopGrid";

export const metadata: Metadata = {
  title: "Workshops",
  description:
    "Creatieve workshops voor kinderen: van sieraden maken tot beauty en bakken. Wij zorgen voor alle materialen, begeleiding en heel veel plezier.",
};

export const dynamic = "force-dynamic";

const usps = [
  {
    emoji: "🎨",
    title: "Alles staat klaar",
    text: "Wij nemen alle materialen mee.",
  },
  {
    emoji: "💗",
    title: "Persoonlijke begeleiding",
    text: "Rustig, gezellig en afgestemd op de groep.",
  },
  {
    emoji: "✨",
    title: "Creatieve workshops",
    text: "Van knutselen tot beauty en bakken.",
  },
  {
    emoji: "🎉",
    title: "Ook voor feestjes",
    text: "Perfect als activiteit tijdens een verjaardag.",
  },
];

export default async function WorkshopsPage() {
  const workshops = await getPublishedWorkshops();
  const items = await Promise.all(
    workshops.map(async (workshop) => ({
      workshop,
      imageUrl: await getWorkshopMainImageUrl(workshop.slug, workshop.category),
    }))
  );

  const heroSlot = getSiteImageSlot("workshops-hero");
  const heroImageUrl = heroSlot ? await siteImageUrl(heroSlot) : null;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-mint-soft blob animate-float-slow"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 top-10 h-56 w-56 rounded-full bg-yellow-soft blob-2 animate-float"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-2 lg:items-center lg:pb-24 lg:pt-24">
          <div className="reveal">
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-soft px-4 py-2 text-sm font-semibold text-ink/80">
              ✨ Creatief, gezellig &amp; compleet verzorgd
            </span>
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Workshops waar kinderen
              <br />
              <span className="text-coral">blij van worden.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink-soft">
              Van schilderen en sieraden maken tot beauty en bakken. Wij zorgen
              voor alle materialen, begeleiding en vooral heel veel plezier.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#workshops"
                className="rounded-full bg-ink px-8 py-4 text-center text-base font-semibold text-cream transition-transform hover:-translate-y-0.5 hover:bg-coral"
              >
                Bekijk workshops
              </Link>
              <Link
                href="/contact"
                className="rounded-full border-2 border-ink/10 bg-white/60 px-8 py-4 text-center text-base font-semibold text-ink transition-transform hover:-translate-y-0.5 hover:border-coral hover:text-coral"
              >
                Workshop aanvragen
              </Link>
            </div>
          </div>

          <div className="relative reveal">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-[3rem] bg-gradient-to-br from-mint via-yellow-soft to-pink-soft blob shadow-2xl shadow-coral/10 lg:ml-auto">
              {heroImageUrl && (
                <Image
                  src={heroImageUrl}
                  alt="Workshop van Rosa & Charlotte"
                  fill
                  unoptimized
                  priority
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {usps.map((usp) => (
            <div key={usp.title} className="rounded-[2rem] bg-white p-6">
              <span className="text-2xl">{usp.emoji}</span>
              <h3 className="mt-3 font-heading text-base font-bold">{usp.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{usp.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Overview */}
      <section id="workshops" className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
            Welke workshop past bij jullie?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-soft">
            Kies een workshop en maak er samen iets bijzonders van.
          </p>
        </div>

        <div className="mt-12">
          <WorkshopGrid items={items} />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="relative overflow-hidden rounded-[3rem] bg-ink px-8 py-16 text-center sm:px-16">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-coral/30 blob animate-float"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-mint/30 blob-2 animate-float-slow"
            aria-hidden
          />
          <h2 className="relative font-heading text-3xl font-extrabold text-cream sm:text-4xl">
            Klaar om samen iets leuks te maken?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-cream/70">
            Vertel ons voor hoeveel kinderen, welke leeftijd en wanneer. Dan
            maken wij er een workshop van om niet te vergeten.
          </p>
          <Link
            href="/contact"
            className="relative mt-8 inline-flex rounded-full bg-coral px-8 py-4 text-base font-semibold text-cream transition-transform hover:-translate-y-0.5"
          >
            Workshop aanvragen
          </Link>
          <p className="relative mt-4 text-sm text-cream/60">
            Nog niet zeker welke workshop? We denken graag mee.
          </p>
        </div>
      </section>
    </>
  );
}
