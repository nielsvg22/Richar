import type { Metadata } from "next";
import Link from "next/link";
import ThemeForm from "@/components/admin/ThemeForm";

export const metadata: Metadata = {
  title: "Nieuw thema",
  robots: { index: false, follow: false },
};

export default function NieuwThemaPage() {
  return (
    <div>
      <Link href="/admin/feestjes" className="text-sm font-semibold text-ink-soft hover:text-coral">
        ← Terug naar feestjes
      </Link>
      <h1 className="mt-4 font-heading text-3xl font-extrabold">Nieuw thema</h1>
      <p className="mt-2 text-ink-soft">Voeg een nieuw kinderfeestje-thema toe aan de website.</p>

      <div className="mt-8 max-w-2xl rounded-[2.5rem] bg-white p-8 shadow-sm">
        <ThemeForm />
      </div>
    </div>
  );
}
