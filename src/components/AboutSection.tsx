import Link from "next/link";
import Image from "next/image";
import { getSiteImageSlot, siteImageUrl } from "@/lib/siteImages";

export default async function AboutSection() {
  const jungleSlot = getSiteImageSlot("team-jungle-party");
  const officeSlot = getSiteImageSlot("team-office");
  const jungleUrl = (jungleSlot && (await siteImageUrl(jungleSlot))) || "/images/team-jungle-party.jpg";
  const officeUrl = (officeSlot && (await siteImageUrl(officeSlot))) || "/images/team-office.jpg";

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] translate-y-6 overflow-hidden rounded-[2rem] blob">
              <Image
                src={jungleUrl}
                alt="Rosa & Charlotte tijdens een kinderfeestje"
                fill
                unoptimized
                sizes="(min-width: 1024px) 25vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] blob-2">
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
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-2xl bg-white px-5 py-3 text-center shadow-lg">
            <p className="font-heading text-sm font-bold">Rosa &amp; Charlotte</p>
            <p className="text-xs text-ink-soft">oprichters</p>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
            Hoi! Wij zijn Rosa &amp; Charlotte 👋
          </h2>
          <p className="mt-6 text-ink-soft">
            Wij zijn twee enthousiaste ondernemers met één missie: van ieder
            kinderfeestje een herinnering maken waar kinderen én ouders nog
            lang over napraten.
          </p>
          <p className="mt-4 text-ink-soft">
            We vinden het geweldig om thema&apos;s te bedenken, mooie
            decoraties te maken en kinderen een middag vol plezier te
            bezorgen. En misschien wel het belangrijkste: wij vinden dat een
            kinderfeestje voor ouders óók leuk moet zijn.
          </p>
          <Link
            href="/over-ons"
            className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-ink/10 px-6 py-3 text-sm font-semibold hover:border-coral hover:text-coral"
          >
            Lees ons verhaal →
          </Link>
        </div>
      </div>
    </section>
  );
}
