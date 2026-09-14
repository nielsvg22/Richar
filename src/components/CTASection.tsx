import Link from "next/link";

export default function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
      <div className="relative overflow-hidden rounded-[3rem] bg-ink px-8 py-16 text-center sm:px-16">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-coral/30 blob animate-float"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-lavender/30 blob-2 animate-float-slow"
          aria-hidden
        />
        <h2 className="relative font-heading text-3xl font-extrabold text-cream sm:text-4xl">
          Maak van de verjaardag een feestje om nooit te vergeten.
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-cream/70">
          Jij zorgt voor de slingers. Wij zorgen voor het feestje.
        </p>
        <Link
          href="/boeken"
          className="relative mt-8 inline-flex rounded-full bg-coral px-8 py-4 text-base font-semibold text-cream transition-transform hover:-translate-y-0.5"
        >
          Boek jouw feestje
        </Link>
      </div>
    </section>
  );
}
