import Link from "next/link";
import Image from "next/image";
import { getSiteImageSlot, siteImageUrl } from "@/lib/siteImages";
import { getSiteContentMap } from "@/lib/siteContent";

export default async function Hero() {
  const heroSlot = getSiteImageSlot("hero");
  const heroImageUrl = heroSlot ? await siteImageUrl(heroSlot) : null;
  const content = await getSiteContentMap();

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-lavender-soft blob animate-float-slow"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-10 h-56 w-56 rounded-full bg-mint-soft blob-2 animate-float"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-yellow-soft blob animate-float-slow"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-2 lg:items-center lg:pb-24 lg:pt-24">
        <div className="reveal">
          <span className="inline-flex items-center gap-2 rounded-full bg-pink-soft px-4 py-2 text-sm font-semibold text-ink/80">
            {content["home.hero.badge"]}
          </span>
          <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {content["home.hero.title1"]}
            <br />
            {content["home.hero.title2"]}
            <br />
            <span className="text-coral">{content["home.hero.title3"]}</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-ink-soft">{content["home.hero.subtitle"]}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/feestjes"
              className="rounded-full bg-ink px-8 py-4 text-center text-base font-semibold text-cream transition-transform hover:-translate-y-0.5 hover:bg-coral"
            >
              Bekijk de feestjes
            </Link>
            <Link
              href="/boeken"
              className="rounded-full border-2 border-ink/10 bg-white/60 px-8 py-4 text-center text-base font-semibold text-ink transition-transform hover:-translate-y-0.5 hover:border-coral hover:text-coral"
            >
              Bereken mijn prijs
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-4 text-sm text-ink-soft">
            <div className="flex -space-x-3">
              {["🦄", "👑", "🦸", "🎨"].map((e) => (
                <span
                  key={e}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cream bg-lavender-soft text-lg"
                >
                  {e}
                </span>
              ))}
            </div>
            <p>{content["home.hero.stat"]}</p>
          </div>
        </div>

        <div className="relative reveal">
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-[3rem] bg-gradient-to-br from-pink via-peach-soft to-lavender-soft blob shadow-2xl shadow-coral/10 lg:ml-auto">
            {heroImageUrl && (
              <Image
                src={heroImageUrl}
                alt="Kinderfeestje van Rosa & Charlotte"
                fill
                unoptimized
                priority
                className="object-cover"
              />
            )}
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-3xl bg-white px-6 py-4 shadow-xl">
            <p className="font-heading text-2xl font-extrabold text-coral">4.9★</p>
            <p className="text-xs text-ink-soft">gemiddelde beoordeling</p>
          </div>
          <div className="absolute -top-6 right-4 rounded-3xl bg-white px-6 py-4 shadow-xl">
            <p className="font-heading text-2xl font-extrabold text-ink">vanaf €149</p>
            <p className="text-xs text-ink-soft">compleet verzorgd</p>
          </div>
        </div>
      </div>
    </section>
  );
}
