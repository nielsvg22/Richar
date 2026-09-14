const steps = [
  {
    number: "1",
    title: "Kies je thema",
    description: "Kies het favoriete thema van de jarige uit ons ruime aanbod.",
    color: "bg-pink-soft",
  },
  {
    number: "2",
    title: "Kies je pakket",
    description: "Selecteer het arrangement dat bij jullie budget en wensen past.",
    color: "bg-mint-soft",
  },
  {
    number: "3",
    title: "Kies datum & locatie",
    description: "Geef aan wanneer en waar het feestje plaatsvindt.",
    color: "bg-yellow-soft",
  },
  {
    number: "4",
    title: "Wij regelen de rest",
    description: "Rosa & Charlotte nemen het over. Jij hoeft alleen te genieten.",
    color: "bg-lavender-soft",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white/60 py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
            Van &ldquo;wanneer is het feestje?&rdquo; naar &ldquo;wat was dit
            leuk!&rdquo;
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className={`rounded-[2rem] ${step.color} p-7`}>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-heading text-lg font-bold text-cream">
                {step.number}
              </span>
              <h3 className="mt-5 font-heading text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
