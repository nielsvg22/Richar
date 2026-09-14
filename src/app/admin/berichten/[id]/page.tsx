import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContactRequest, markContactRequestViewed } from "@/lib/contactRequests";

export const metadata: Metadata = {
  title: "Bericht",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const SOURCE_LABELS: Record<string, string> = {
  contact: "Contactformulier",
  account: "Klantportaal",
};

export default async function BerichtDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const existing = getContactRequest(id);
  if (!existing) notFound();

  const request = markContactRequestViewed(id) ?? existing;

  return (
    <div>
      <Link href="/admin/berichten" className="text-sm font-semibold text-ink-soft hover:text-coral">
        ← Terug naar berichten
      </Link>

      <div className="mx-auto mt-6 max-w-2xl">
        <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
          <p className="text-sm text-ink-soft">
            {SOURCE_LABELS[request.source] ?? request.source} ·{" "}
            {new Date(request.createdAt).toLocaleString("nl-NL", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <h1 className="mt-1 font-heading text-3xl font-extrabold">{request.name}</h1>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">E-mail</p>
              <p className="mt-1 text-sm font-semibold">
                <a href={`mailto:${request.email}`} className="hover:text-coral">
                  {request.email}
                </a>
              </p>
            </div>
            {request.phone && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Telefoon</p>
                <p className="mt-1 text-sm font-semibold">{request.phone}</p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-2xl bg-yellow-soft p-5">
            <p className="text-sm font-semibold">Bericht</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-ink/80">{request.message}</p>
          </div>

          <a
            href={`mailto:${request.email}?subject=${encodeURIComponent(
              "Re: je bericht aan Rosa & Charlotte"
            )}`}
            className="mt-6 inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coral"
          >
            Beantwoorden per e-mail
          </a>
        </div>
      </div>
    </div>
  );
}
