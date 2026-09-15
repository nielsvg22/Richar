import type { Metadata } from "next";
import Link from "next/link";
import { getWorkshops } from "@/lib/workshops";
import { getWorkshopMainImageUrl } from "@/lib/workshopImages";
import WorkshopTable from "@/components/admin/WorkshopTable";

export const metadata: Metadata = {
  title: "Workshops beheren",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminWorkshopsPage() {
  const workshops = await getWorkshops();
  const items = await Promise.all(
    workshops.map(async (workshop) => ({
      workshop,
      imageUrl: await getWorkshopMainImageUrl(workshop.slug, workshop.category),
    }))
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold">Workshops</h1>
          <p className="mt-2 text-ink-soft">
            Beheer de workshops die op de website te zien zijn.
          </p>
        </div>
        <Link
          href="/admin/workshops/nieuw"
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coral"
        >
          + Nieuwe workshop
        </Link>
      </div>

      <WorkshopTable items={items} />
    </div>
  );
}
