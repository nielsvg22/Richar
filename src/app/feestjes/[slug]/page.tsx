import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTheme, getThemes } from "@/lib/themes";
import { packages } from "@/lib/pricing";
import ThemeGrid from "@/components/ThemeGrid";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const theme = await getTheme(slug);
  if (!theme) return {};

  return {
    title: `${theme.name} organiseren | Rosa & Charlotte`,
    description: `${theme.description} Compleet verzorgd door Rosa & Charlotte, geschikt voor ${theme.ageRange}. Bekijk het ${theme.name.toLowerCase()} en boek direct.`,
    openGraph: {
      title: `${theme.name} | Rosa & Charlotte`,
      description: theme.description,
    },
  };
}

export default async function ThemeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = await getTheme(slug);
  if (!theme) notFound();

  const otherThemes = (await getThemes()).filter((t) => t.slug !== theme.slug).slice(0, 4);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: theme.name,
          name: `${theme.name} — Rosa & Charlotte Kinderfeestjes`,
          description: theme.description,
          provider: { "@type": "LocalBusiness", name: "Rosa & Charlotte Kinderfeestjes" },
          areaServed: ["Apeldoorn", "Deventer", "Arnhem", "Zutphen"],
          offers: {
            "@type": "Offer",
            price: theme.vanaf,
            priceCurrency: "EUR",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.rosaencharlotte.nl/" },
            {
              "@type": "ListItem",
              position: 2,
              name: "Feestjes",
              item: "https://www.rosaencharlotte.nl/feestjes",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: theme.name,
              item: `https://www.rosaencharlotte.nl/feestjes/${theme.slug}`,
            },
          ],
        }}
      />
      <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-14">
        <Link href="/feestjes" className="text-sm font-semibold text-ink-soft hover:text-coral">
          ← Alle feestjes
        </Link>
      </section>

      <section className={`mx-auto mt-6 max-w-7xl px-5 sm:px-8`}>
        <div
          className={`grid gap-10 rounded-[3rem] bg-gradient-to-br ${theme.gradient} p-8 sm:p-12 lg:grid-cols-2 lg:items-center`}
        >
          <div>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/70 text-3xl">
              {theme.emoji}
            </span>
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
              {theme.name}
            </h1>
            <p className="mt-4 text-lg text-ink/70">{theme.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
              <span className="rounded-full bg-white/70 px-4 py-2">
                {theme.ageRange}
              </span>
              <span className="rounded-full bg-white/70 px-4 py-2">
                vanaf €{theme.vanaf}
              </span>
            </div>
            <Link
              href={`/boeken?thema=${theme.slug}`}
              className="mt-8 inline-flex rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5 hover:bg-coral"
            >
              Boek het {theme.name.toLowerCase()}
            </Link>
          </div>
          <div className="aspect-video w-full rounded-[2.5rem] bg-white/40" />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-heading text-2xl font-bold">Over dit feestje</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            {theme.longDescription}
          </p>

          <h3 className="mt-10 font-heading text-xl font-bold">Programma</h3>
          <ul className="mt-4 space-y-3">
            {theme.activities.map((activity) => (
              <li key={activity} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-mint-soft text-xs">
                  ✓
                </span>
                <span className="text-ink-soft">{activity}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-10 font-heading text-xl font-bold">Inbegrepen</h3>
          <ul className="mt-4 space-y-3">
            {theme.includes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-soft text-xs">
                  🎉
                </span>
                <span className="text-ink-soft">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded-[2.5rem] bg-white p-7 shadow-sm lg:sticky lg:top-24">
          <h3 className="font-heading text-lg font-bold">Kies je pakket</h3>
          <div className="mt-5 space-y-3">
            {packages.map((pkg) => (
              <Link
                key={pkg.id}
                href={`/boeken?thema=${theme.slug}&pakket=${pkg.id}`}
                className="flex items-center justify-between rounded-2xl border border-ink/10 px-4 py-3 text-sm hover:border-coral"
              >
                <span className="font-semibold">{pkg.name}</span>
                <span className="text-ink-soft">vanaf €{pkg.price}</span>
              </Link>
            ))}
          </div>
          <p className="mt-5 text-xs text-ink-soft">
            De uiteindelijke prijs is afhankelijk van het aantal kinderen en
            gekozen extra&apos;s. Je ziet de totaalprijs live tijdens het
            boeken.
          </p>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <h2 className="font-heading text-2xl font-bold">
          Andere populaire thema&apos;s
        </h2>
        <div className="mt-8">
          <ThemeGrid themes={otherThemes} />
        </div>
      </section>

      <CTASection />
    </>
  );
}
