import type { Metadata } from "next";
import Link from "next/link";
import { getContactRequests } from "@/lib/contactRequests";

export const metadata: Metadata = {
  title: "Berichten",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const SOURCE_LABELS: Record<string, string> = {
  contact: "Contactformulier",
  account: "Klantportaal",
  bedrijven: "Zakelijk",
};

export default async function BerichtenPage() {
  const requests = await getContactRequests();
  const unviewedCount = requests.filter((r) => !r.viewedAt).length;

  return (
    <div>
      <h1 className="font-heading text-3xl font-extrabold">Berichten</h1>
      <p className="mt-2 text-ink-soft">
        {unviewedCount > 0
          ? `${unviewedCount} nieuw${unviewedCount === 1 ? "" : "e"} bericht${unviewedCount === 1 ? "" : "en"} binnengekomen.`
          : "Alle berichten zijn bekeken."}
      </p>

      <div className="mt-8 overflow-x-auto rounded-[2rem] bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4">Naam</th>
              <th className="px-6 py-4">E-mail</th>
              <th className="px-6 py-4">Bron</th>
              <th className="px-6 py-4">Ontvangen</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr
                key={request.id}
                className={`border-b border-ink/5 last:border-0 hover:bg-cream-soft ${
                  !request.viewedAt ? "bg-coral-soft/40" : ""
                }`}
              >
                <td className="px-6 py-4">
                  {!request.viewedAt && (
                    <span className="inline-flex items-center rounded-full bg-coral px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      Nieuw
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/berichten/${request.id}`}
                    className="block font-semibold hover:text-coral"
                  >
                    {request.name}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/berichten/${request.id}`} className="block">
                    {request.email}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  {SOURCE_LABELS[request.source] ?? request.source}
                </td>
                <td className="px-6 py-4">
                  {new Date(request.createdAt).toLocaleString("nl-NL", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-ink-soft">
                  Nog geen berichten ontvangen.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
