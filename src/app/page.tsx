import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ThemeGrid from "@/components/ThemeGrid";
import PricingSection from "@/components/PricingSection";
import HowItWorks from "@/components/HowItWorks";
import AboutSection from "@/components/AboutSection";
import ReviewSection from "@/components/ReviewSection";
import FAQAccordion from "@/components/FAQAccordion";
import CTASection from "@/components/CTASection";
import { getThemes } from "@/lib/themes";
import { faqItems } from "@/lib/faq";
import { getSiteContentMap } from "@/lib/siteContent";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const themes = await getThemes();
  const content = await getSiteContentMap();
  const homeThemes = [
    ...themes.filter((t) => t.featured),
    ...themes.filter((t) => !t.featured),
  ].slice(0, 8);

  return (
    <>
      <Hero />
      <TrustBar />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
            {content["home.themes.title"]}
          </h2>
          <Link href="/feestjes" className="text-sm font-semibold text-coral">
            Bekijk alle feestjes →
          </Link>
        </div>
        <div className="mt-12">
          <ThemeGrid themes={homeThemes} />
        </div>
      </section>

      <PricingSection />
      <HowItWorks />
      <AboutSection />
      <ReviewSection />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <h2 className="text-center font-heading text-3xl font-extrabold sm:text-4xl">
          {content["home.faq.title"]}
        </h2>
        <div className="mt-12">
          <FAQAccordion items={faqItems.slice(0, 5)} />
        </div>
        <div className="mt-8 text-center">
          <Link href="/faq" className="text-sm font-semibold text-coral">
            Bekijk alle vragen →
          </Link>
        </div>
      </section>

      <CTASection />
    </>
  );
}
