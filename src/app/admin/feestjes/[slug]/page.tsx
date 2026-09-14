import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTheme } from "@/lib/themes";
import ThemeForm from "@/components/admin/ThemeForm";

export const metadata: Metadata = {
  title: "Thema bewerken",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BewerkThemaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = getTheme(slug);
  if (!theme) notFound();

  return (
    <div>
      <Link href="/admin/feestjes" className="text-sm font-semibold text-ink-soft hover:text-coral">
        ← Terug naar feestjes
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <span className="text-2xl">{theme.emoji}</span>
        <h1 className="font-heading text-3xl font-extrabold">{theme.name}</h1>
      </div>
      <p className="mt-2 text-ink-soft">
        Bewerk dit thema. Wijzigingen zijn direct zichtbaar op de website.
      </p>

      <div className="mt-8 max-w-2xl rounded-[2.5rem] bg-white p-8 shadow-sm">
        <ThemeForm theme={theme} />
      </div>
    </div>
  );
}
