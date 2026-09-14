import type { Metadata } from "next";
import { SITE_IMAGE_SLOTS, siteImageUrl } from "@/lib/siteImages";
import ImageSlotUploader from "@/components/admin/ImageSlotUploader";

export const metadata: Metadata = {
  title: "Afbeeldingen",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AfbeeldingenPage() {
  const slotsWithUrls = await Promise.all(
    SITE_IMAGE_SLOTS.map(async (slot) => ({ slot, url: await siteImageUrl(slot) }))
  );

  return (
    <div>
      <h1 className="font-heading text-3xl font-extrabold">Afbeeldingen</h1>
      <p className="mt-2 text-ink-soft">
        Vervang het logo en de teamfoto&apos;s die op de website getoond worden.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {slotsWithUrls.map(({ slot, url }) => (
          <ImageSlotUploader key={slot.id} slot={slot} currentUrl={url} />
        ))}
      </div>
    </div>
  );
}
