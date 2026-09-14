import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBooking } from "@/lib/bookings";
import { getExtra } from "@/lib/pricing";
import { getTheme } from "@/lib/themes";

export const metadata: Metadata = {
  title: "Draaiboek van jullie feestje",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DraaiboekPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBooking(id);
  if (!booking) notFound();

  const theme = await getTheme(booking.themeSlug);
  const eventDate = new Date(booking.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <section className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="text-center">
        <span className="text-5xl">{theme?.emoji ?? "🎉"}</span>
        <h1 className="mt-4 font-heading text-3xl font-extrabold sm:text-4xl">
          Draaiboek: {booking.themeName}
        </h1>
        <p className="mt-2 text-ink-soft">Voor {booking.childName}</p>

        {daysUntil > 0 ? (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-coral-soft px-5 py-2.5 text-sm font-semibold">
            🎉 Nog {daysUntil} {daysUntil === 1 ? "dag" : "dagen"} te gaan!
          </div>
        ) : daysUntil === 0 ? (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-mint-soft px-5 py-2.5 text-sm font-semibold">
            🎉 Vandaag is het zover!
          </div>
        ) : null}
      </div>

      <div className="mt-10 rounded-[2.5rem] bg-white p-8 shadow-sm">
        <h2 className="font-heading text-lg font-bold">Wanneer & waar</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Detail
            label="Datum"
            value={eventDate.toLocaleDateString("nl-NL", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
          <Detail label="Tijd" value={booking.time || "-"} />
          <Detail
            label="Locatie"
            value={`${booking.locationType === "thuis" ? "Bij jullie thuis" : booking.locationType === "locatie" ? "Op locatie" : "Anders"}${booking.location ? ` · ${booking.location}` : ""}`}
          />
          <Detail label="Aantal kinderen" value={String(booking.kids)} />
          <Detail label="Pakket" value={booking.packageName} />
          {booking.extras.length > 0 && (
            <Detail
              label="Extra's"
              value={booking.extras.map((extraId) => getExtra(extraId)?.name ?? extraId).join(", ")}
            />
          )}
        </div>
      </div>

      <div className="mt-6 rounded-[2.5rem] bg-white p-8 shadow-sm">
        <h2 className="font-heading text-lg font-bold">Checklist voor jullie</h2>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-mint-soft text-xs">
              ✓
            </span>
            Zorg voor een vrije tafel of ruimte voor de activiteit.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-mint-soft text-xs">
              ✓
            </span>
            Geef eventuele allergieën van gasten tijdig aan ons door.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-mint-soft text-xs">
              ✓
            </span>
            Zorg dat er een plek is waar jassen en tassen neergelegd kunnen worden.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-mint-soft text-xs">
              ✓
            </span>
            Wij zorgen voor de rest: decoratie, activiteit en begeleiding. Jullie hoeven alleen te genieten!
          </li>
        </ul>

        {booking.notes && (
          <div className="mt-6 rounded-2xl bg-yellow-soft p-4">
            <p className="text-sm font-semibold">Jullie opmerking</p>
            <p className="mt-1 text-sm text-ink/80">{booking.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-[2.5rem] bg-lavender-soft p-8 text-center">
        <p className="font-semibold">Vragen? Neem gerust contact op.</p>
        <p className="mt-2 text-sm text-ink/70">
          hallo@rosaencharlotte.nl · 06 - 123 456 78
        </p>
        <p className="mt-4 text-xs text-ink-soft">
          Boekingsnummer {booking.id} · Deel deze pagina gerust met wie er ook bij het
          feestje betrokken is.
        </p>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
