import type { Metadata } from "next";
import Link from "next/link";
import { getThemes } from "@/lib/themes";

export const metadata: Metadata = {
  title: "Feestjes beheren",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminFeestjesPage() {
  const themes = await getThemes();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold">Feestjes</h1>
          <p className="mt-2 text-ink-soft">
            Beheer alle thema&apos;s die op de website te boeken zijn.
          </p>
        </div>
        <Link
          href="/admin/feestjes/nieuw"
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coral"
        >
          + Nieuw thema
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <Link
            key={theme.slug}
            href={`/admin/feestjes/${theme.slug}`}
            className={`rounded-[2rem] bg-gradient-to-br ${theme.gradient} p-6 transition-transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-xl">
                {theme.emoji}
              </span>
              {theme.featured && (
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">
                  Uitgelicht
                </span>
              )}
            </div>
            <h3 className="mt-4 font-heading text-lg font-bold">{theme.name}</h3>
            <p className="mt-1 text-sm text-ink/70">{theme.ageRange}</p>
            <p className="mt-3 text-sm font-semibold">vanaf €{theme.vanaf}</p>
          </Link>
        ))}
      </div>

      {themes.length === 0 && (
        <div className="mt-8 rounded-[2rem] bg-white p-10 text-center text-ink-soft">
          Nog geen thema&apos;s. Voeg het eerste thema toe.
        </div>
      )}
    </div>
  );
}
