import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import VoucherStatusCheck from "@/components/VoucherStatusCheck";

export const metadata: Metadata = {
  title: "Bedankt voor je aankoop",
  robots: { index: false, follow: false },
};

export default async function CadeaubonBedanktPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  if (!code) notFound();

  return (
    <section className="mx-auto max-w-lg px-5 py-20 text-center sm:px-8">
      <h1 className="font-heading text-3xl font-extrabold">Bedankt voor je aankoop!</h1>

      <div className="mt-8">
        <VoucherStatusCheck code={code} />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="rounded-full border-2 border-ink/10 px-6 py-3 text-sm font-semibold hover:border-coral"
        >
          Naar de homepage
        </Link>
        <Link
          href="/boeken"
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coral"
        >
          Direct een feestje boeken
        </Link>
      </div>
    </section>
  );
}
