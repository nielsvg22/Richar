import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Zakelijk & scholen",
  description:
    "Rosa & Charlotte organiseren ook workshops en activiteiten voor kinderopvang, scholen en bedrijfsevenementen. Flexibel, professioneel en op locatie.",
};

const usps = [
  {
    emoji: "📍",
    title: "Altijd op locatie",
    text: "Bij jullie op de kinderopvang, school of het bedrijfsevenement.",
  },
  {
    emoji: "👥",
    title: "Schaalbaar",
    text: "Van een klas van 15 kinderen tot een groot bedrijfsevenement.",
  },
  {
    emoji: "🧾",
    title: "Zakelijke facturatie",
    text: "Duidelijke facturen, eenvoudig te verwerken in jullie administratie.",
  },
  {
    emoji: "🕒",
    title: "Flexibele tijden",
    text: "Ook doordeweeks overdag, buiten de reguliere feestjes-uren.",
  },
];

export default function ZakelijkPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-lavender-soft px-4 py-2 text-sm font-semibold">
              🏢 Zakelijk &amp; scholen
            </span>
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
              Ook voor kinderopvang,
              <br className="hidden sm:block" /> scholen &amp; bedrijven
            </h1>
            <p className="mt-6 text-lg text-ink-soft">
              Dezelfde creatieve workshops en feestjes die kinderen zo blij maken,
              nu ook professioneel georganiseerd voor kinderopvang, basisscholen
              en bedrijfsevenementen met kinderen erbij.
            </p>
          </div>
          <div className="aspect-square w-full rounded-[3rem] bg-gradient-to-br from-lavender via-mint-soft to-yellow-soft blob shadow-2xl shadow-coral/10" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {usps.map((usp) => (
            <div key={usp.title} className="rounded-[2rem] bg-white p-6">
              <span className="text-2xl">{usp.emoji}</span>
              <h3 className="mt-3 font-heading text-base font-bold">{usp.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{usp.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-20 sm:px-8">
        <div className="rounded-[2.5rem] bg-white p-8 shadow-sm sm:p-10">
          <h2 className="font-heading text-2xl font-bold">Vertel ons over jullie plan</h2>
          <p className="mt-2 text-ink-soft">
            Laat weten voor hoeveel kinderen, welke leeftijd, en wanneer — dan maken
            we een voorstel op maat.
          </p>
          <div className="mt-6">
            <ContactForm
              source="bedrijven"
              messagePlaceholder="Vertel ons over jullie kinderopvang, school of bedrijfsevenement..."
              submitLabel="Vraag een voorstel aan"
            />
          </div>
        </div>
      </section>
    </>
  );
}
