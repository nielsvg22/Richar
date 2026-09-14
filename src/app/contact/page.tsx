import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Neem contact op met Rosa & Charlotte voor vragen over kinderfeestjes of vraag de beschikbaarheid van jouw datum aan.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="font-heading text-4xl font-extrabold sm:text-5xl">
            Laten we praten
            <br /> over jullie feestje
          </h1>
          <p className="mt-6 max-w-md text-ink-soft">
            Heb je een vraag, wil je de beschikbaarheid van een datum weten of
            twijfel je nog tussen twee thema&apos;s? Stuur ons een bericht,
            we reageren binnen één werkdag.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-4 rounded-2xl bg-white p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mint-soft text-lg">
                ✉️
              </span>
              <div>
                <p className="text-sm text-ink-soft">E-mail</p>
                <p className="font-semibold">hallo@rosaencharlotte.nl</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-white p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-soft text-lg">
                📞
              </span>
              <div>
                <p className="text-sm text-ink-soft">Telefoon</p>
                <p className="font-semibold">06 - 123 456 78</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-white p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-soft text-lg">
                📍
              </span>
              <div>
                <p className="text-sm text-ink-soft">Werkgebied</p>
                <p className="font-semibold">Apeldoorn, Deventer, Arnhem e.o.</p>
              </div>
            </div>
          </div>

          <p className="mt-10 text-sm text-ink-soft">
            Wil je direct een feestje boeken?{" "}
            <Link href="/boeken" className="font-semibold text-coral">
              Ga naar de boekingspagina →
            </Link>
          </p>
        </div>

        <div className="rounded-[2.5rem] bg-cream-soft p-8 sm:p-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
