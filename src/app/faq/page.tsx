import type { Metadata } from "next";
import FAQAccordion from "@/components/FAQAccordion";
import CTASection from "@/components/CTASection";
import { faqItems } from "@/lib/faq";
import { getSiteContentMap } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Veelgestelde vragen",
  description:
    "Antwoorden op de meest gestelde vragen over het boeken van een kinderfeestje bij Rosa & Charlotte.",
};

export const dynamic = "force-dynamic";

export default async function FAQPage() {
  const content = await getSiteContentMap();

  return (
    <>
      <section className="mx-auto max-w-3xl px-5 pt-14 text-center sm:px-8 sm:pt-20">
        <h1 className="font-heading text-4xl font-extrabold sm:text-5xl">
          {content["faq.title"]}
        </h1>
        <p className="mt-4 text-ink-soft">{content["faq.subtitle"]}</p>
      </section>

      <section className="px-5 py-14 sm:px-8">
        <FAQAccordion items={faqItems} />
      </section>

      <CTASection />
    </>
  );
}
