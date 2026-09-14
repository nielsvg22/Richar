import type { Metadata } from "next";
import FAQAccordion from "@/components/FAQAccordion";
import CTASection from "@/components/CTASection";
import { faqItems } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Veelgestelde vragen",
  description:
    "Antwoorden op de meest gestelde vragen over het boeken van een kinderfeestje bij Rosa & Charlotte.",
};

export default function FAQPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-5 pt-14 text-center sm:px-8 sm:pt-20">
        <h1 className="font-heading text-4xl font-extrabold sm:text-5xl">
          Veelgestelde vragen
        </h1>
        <p className="mt-4 text-ink-soft">
          Staat je vraag er niet bij? Neem gerust contact met ons op, we
          helpen je graag verder.
        </p>
      </section>

      <section className="px-5 py-14 sm:px-8">
        <FAQAccordion items={faqItems} />
      </section>

      <CTASection />
    </>
  );
}
