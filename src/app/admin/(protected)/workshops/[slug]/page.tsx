import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkshop } from "@/lib/workshops";
import WorkshopForm from "@/components/admin/WorkshopForm";

export const metadata: Metadata = {
  title: "Workshop bewerken",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BewerkWorkshopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workshop = await getWorkshop(slug);
  if (!workshop) notFound();

  return (
    <div>
      <Link href="/admin/workshops" className="text-sm font-semibold text-ink-soft hover:text-coral">
        ← Terug naar workshops
      </Link>
      <h1 className="mt-4 font-heading text-3xl font-extrabold">{workshop.title}</h1>
      <p className="mt-2 text-ink-soft">
        Bewerk deze workshop. Wijzigingen zijn direct zichtbaar op de website.
      </p>

      <div className="mt-8 max-w-3xl">
        <WorkshopForm workshop={workshop} />
      </div>
    </div>
  );
}
