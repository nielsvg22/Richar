import type { Metadata } from "next";
import { CONTENT_FIELDS, getSiteContentMap } from "@/lib/siteContent";
import SiteContentEditor from "@/components/admin/SiteContentEditor";

export const metadata: Metadata = {
  title: "Teksten",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const values = await getSiteContentMap();

  const groups = new Map<string, typeof CONTENT_FIELDS>();
  for (const field of CONTENT_FIELDS) {
    if (!groups.has(field.group)) groups.set(field.group, []);
    groups.get(field.group)!.push(field);
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-extrabold">Teksten</h1>
      <p className="mt-2 text-ink-soft">
        Pas de teksten op de vaste pagina&apos;s van de website aan. Wijzigingen zijn direct
        zichtbaar.
      </p>

      <div className="mt-8">
        <SiteContentEditor groups={Array.from(groups.entries())} initialValues={values} />
      </div>
    </div>
  );
}
