import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedWorkshop, getPublishedWorkshops } from "@/lib/workshops";
import { getWorkshopImages, getWorkshopMainImageUrl } from "@/lib/workshopImages";
import { formatAgeRange, formatGroupSize, formatPrice } from "@/lib/workshop-constants";
import WorkshopCard from "@/components/WorkshopCard";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const workshop = await getPublishedWorkshop(slug);
  if (!workshop) return {};

  return {
    title: workshop.metaTitle || `${workshop.title} | Rosa & Charlotte`,
    description: workshop.metaDescription || workshop.shortDescription,
    openGraph: {
      title: workshop.metaTitle || `${workshop.title} | Rosa & Charlotte`,
      description: workshop.metaDescription || workshop.shortDescription,
    },
  };
}

export default async function WorkshopDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workshop = await getPublishedWorkshop(slug);
  if (!workshop) notFound();

  const images = await getWorkshopImages(workshop.slug);
  const mainImageUrl = await getWorkshopMainImageUrl(workshop.slug, workshop.category);

  const otherWorkshops = await getPublishedWorkshops();
  const otherItems = await Promise.all(
    otherWorkshops
      .filter((w) => w.slug !== workshop.slug)
      .slice(0, 3)
      .map(async (w) => ({ workshop: w, imageUrl: await getWorkshopMainImageUrl(w.slug, w.category) }))
  );

  const groupSize = formatGroupSize(workshop);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: workshop.title,
          name: `${workshop.title} — Rosa & Charlotte Kinderfeestjes`,
          description: workshop.shortDescription,
          provider: { "@type": "LocalBusiness", name: "Rosa & Charlotte Kinderfeestjes" },
          areaServed: ["Apeldoorn", "Deventer", "Arnhem", "Zutphen"],
        }}
      />

      <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-14">
        <Link href="/workshops" className="text-sm font-semibold text-ink-soft hover:text-coral">
          ← Alle workshops
        </Link>
      </section>

      <section className="mx-auto mt-6 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-[3rem] shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mainImageUrl} alt={workshop.title} className="h-full w-full object-cover" />
          </div>
          <div>
            <span className="inline-flex items-center rounded-full bg-mint-soft px-4 py-2 text-sm font-semibold uppercase tracking-wide">
              {workshop.category}
            </span>
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
              {workshop.title}
            </h1>
            <p className="mt-4 text-lg text-ink/70">{workshop.shortDescription}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
              <span className="rounded-full bg-cream-soft px-4 py-2">
                👧 {formatAgeRange(workshop)}
              </span>
              {workshop.duration && (
                <span className="rounded-full bg-cream-soft px-4 py-2">⏱ {workshop.duration}</span>
              )}
              {groupSize && <span className="rounded-full bg-cream-soft px-4 py-2">👥 {groupSize}</span>}
              <span className="rounded-full bg-cream-soft px-4 py-2">{formatPrice(workshop)}</span>
            </div>
            <Link
              href="/contact"
              className="mt-8 inline-flex rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5 hover:bg-coral"
            >
              Workshop aanvragen
            </Link>
          </div>
        </div>
      </section>

      {images.length > 1 && (
        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
            {images.slice(1).map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.id}
                src={`/api/workshop-images/${img.id}`}
                alt={workshop.title}
                className="aspect-square w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-heading text-2xl font-bold">Over deze workshop</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">{workshop.description}</p>

          {workshop.whatWeDo && (
            <>
              <h3 className="mt-10 font-heading text-xl font-bold">Wat gaan we doen?</h3>
              <p className="mt-4 leading-relaxed text-ink-soft">{workshop.whatWeDo}</p>
            </>
          )}
        </div>

        <aside className="h-fit rounded-[2.5rem] bg-white p-7 shadow-sm lg:sticky lg:top-24">
          <h3 className="font-heading text-lg font-bold">Dit is inbegrepen</h3>
          <ul className="mt-5 space-y-3">
            {workshop.includedItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-mint-soft text-xs">
                  ✓
                </span>
                <span className="text-ink-soft">{item}</span>
              </li>
            ))}
            {workshop.includedItems.length === 0 && (
              <p className="text-sm text-ink-soft">Neem contact op voor de details.</p>
            )}
          </ul>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-4 sm:px-8">
        <div className="rounded-[2.5rem] bg-lavender-soft p-8 text-center sm:p-12">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            Ook leuk voor een kinderfeestje?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-ink/70">
            Deze workshop is ook perfect als activiteit tijdens een verjaardag.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream hover:bg-coral"
          >
            Vraag deze workshop aan
          </Link>
        </div>
      </section>

      {otherItems.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <h2 className="font-heading text-2xl font-bold">Andere workshops</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherItems.map(({ workshop: w, imageUrl }) => (
              <WorkshopCard key={w.slug} workshop={w} imageUrl={imageUrl} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
