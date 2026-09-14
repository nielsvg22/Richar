import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center sm:px-8">
      <p className="text-5xl">🎈</p>
      <h1 className="mt-6 font-heading text-3xl font-extrabold sm:text-4xl">
        Deze pagina is niet te vinden
      </h1>
      <p className="mt-4 text-ink-soft">
        Misschien is deze pagina verplaatst of bestaat de link niet meer.
        Bekijk in de tussentijd onze feestjes.
      </p>
      <Link
        href="/feestjes"
        className="mt-8 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream hover:bg-coral"
      >
        Bekijk de feestjes
      </Link>
    </section>
  );
}
