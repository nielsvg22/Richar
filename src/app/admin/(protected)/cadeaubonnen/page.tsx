import type { Metadata } from "next";
import { getVouchers } from "@/lib/vouchers";

export const metadata: Metadata = {
  title: "Cadeaubonnen",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  unpaid: "bg-ink/10 text-ink-soft",
  active: "bg-mint-soft text-ink",
  redeemed: "bg-lavender-soft text-ink",
  expired: "bg-coral-soft text-ink",
};

const STATUS_LABELS: Record<string, string> = {
  unpaid: "Niet betaald",
  active: "Actief",
  redeemed: "Volledig gebruikt",
  expired: "Verlopen",
};

export default async function CadeaubonnenPage() {
  const vouchers = await getVouchers();

  return (
    <div>
      <h1 className="font-heading text-3xl font-extrabold">Cadeaubonnen</h1>
      <p className="mt-2 text-ink-soft">
        Overzicht van alle verkochte en ingewisselde cadeaubonnen.
      </p>

      <div className="mt-8 overflow-x-auto rounded-[2rem] bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Koper</th>
              <th className="px-6 py-4">Voor</th>
              <th className="px-6 py-4">Bedrag</th>
              <th className="px-6 py-4">Tegoed</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => (
              <tr key={v.code} className="border-b border-ink/5 last:border-0">
                <td className="px-6 py-4 font-semibold">{v.code}</td>
                <td className="px-6 py-4">
                  <p>{v.purchaserName}</p>
                  <p className="text-xs text-ink-soft">{v.purchaserEmail}</p>
                </td>
                <td className="px-6 py-4">{v.recipientName || "-"}</td>
                <td className="px-6 py-4">€{v.amount}</td>
                <td className="px-6 py-4">€{v.balance}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[v.status]}`}
                  >
                    {STATUS_LABELS[v.status]}
                  </span>
                </td>
              </tr>
            ))}
            {vouchers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-ink-soft">
                  Nog geen cadeaubonnen verkocht.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
