import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] translate-y-6 rounded-[2rem] bg-gradient-to-br from-pink to-lavender-soft blob" />
            <div className="aspect-[3/4] rounded-[2rem] bg-gradient-to-br from-mint to-yellow-soft blob-2" />
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-2xl bg-white px-5 py-3 text-center shadow-lg">
            <p className="font-heading text-sm font-bold">Rosa &amp; Charlotte</p>
            <p className="text-xs text-ink-soft">oprichters</p>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
            Hoi! Wij zijn Rosa &amp; Charlotte 👋
          </h2>
          <p className="mt-6 text-ink-soft">
            Wij zijn twee enthousiaste ondernemers met één missie: van ieder
            kinderfeestje een herinnering maken waar kinderen én ouders nog
            lang over napraten.
          </p>
          <p className="mt-4 text-ink-soft">
            We vinden het geweldig om thema&apos;s te bedenken, mooie
            decoraties te maken en kinderen een middag vol plezier te
            bezorgen. En misschien wel het belangrijkste: wij vinden dat een
            kinderfeestje voor ouders óók leuk moet zijn.
          </p>
          <Link
            href="/over-ons"
            className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-ink/10 px-6 py-3 text-sm font-semibold hover:border-coral hover:text-coral"
          >
            Lees ons verhaal →
          </Link>
        </div>
      </div>
    </section>
  );
}
