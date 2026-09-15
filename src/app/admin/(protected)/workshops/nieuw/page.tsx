import type { Metadata } from "next";
import Link from "next/link";
import WorkshopForm from "@/components/admin/WorkshopForm";

export const metadata: Metadata = {
  title: "Nieuwe workshop",
  robots: { index: false, follow: false },
};

export default function NieuweWorkshopPage() {
  return (
    <div>
      <Link href="/admin/workshops" className="text-sm font-semibold text-ink-soft hover:text-coral">
        ← Terug naar workshops
      </Link>
      <h1 className="mt-4 font-heading text-3xl font-extrabold">Nieuwe workshop</h1>
      <p className="mt-2 text-ink-soft">Voeg een nieuwe workshop toe aan de website.</p>

      <div className="mt-8 max-w-3xl">
        <WorkshopForm />
      </div>
    </div>
  );
}
