import type { Metadata } from "next";
import Link from "next/link";
import { getThemes } from "@/lib/themes";
import ManualBookingForm from "@/components/admin/ManualBookingForm";

export const metadata: Metadata = {
  title: "Nieuwe boeking",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function NieuweBoekingPage() {
  const themes = getThemes();

  return (
    <div>
      <Link href="/admin" className="text-sm font-semibold text-ink-soft hover:text-coral">
        ← Terug naar dashboard
      </Link>
      <h1 className="mt-4 font-heading text-3xl font-extrabold">Nieuwe boeking</h1>
      <p className="mt-2 text-ink-soft">
        Handmatig een boeking toevoegen, bijvoorbeeld na een telefonische aanvraag.
      </p>

      <div className="mt-8 max-w-2xl rounded-[2.5rem] bg-white p-8 shadow-sm">
        <ManualBookingForm themes={themes} />
      </div>
    </div>
  );
}
