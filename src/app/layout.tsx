import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/JsonLd";
import { CartProvider } from "@/components/CartContext";
import { getSiteImageSlot, siteImageUrl } from "@/lib/siteImages";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rosaencharlotte.nl"),
  title: {
    default: "Rosa & Charlotte Kinderfeestjes | Complete kinderfeestjes",
    template: "%s | Rosa & Charlotte Kinderfeestjes",
  },
  description:
    "Rosa & Charlotte organiseren creatieve, vrolijke en compleet verzorgde kinderfeestjes voor kinderen van 4 t/m 12 jaar. Jij geniet van de verjaardag, wij regelen de rest.",
  keywords: [
    "kinderfeestje",
    "kinderfeestje organiseren",
    "kinderfeestje thuis",
    "unicorn kinderfeestje",
    "beauty kinderfeestje",
    "kinderfeestje Apeldoorn",
  ],
  openGraph: {
    title: "Rosa & Charlotte Kinderfeestjes",
    description:
      "Creatieve, vrolijke en compleet verzorgde kinderfeestjes. Jij geniet van de verjaardag, wij regelen de rest.",
    locale: "nl_NL",
    type: "website",
    siteName: "Rosa & Charlotte Kinderfeestjes",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const logoSlot = getSiteImageSlot("logo");
  const logoUrl = (logoSlot && (await siteImageUrl(logoSlot))) || "/images/logo.png";

  return (
    <html
      lang="nl"
      className={`${jakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Rosa & Charlotte Kinderfeestjes",
            description:
              "Creatieve, vrolijke en compleet verzorgde kinderfeestjes voor kinderen van 4 t/m 12 jaar.",
            url: "https://www.rosaencharlotte.nl",
            telephone: "+31612345678",
            email: "hallo@rosaencharlotte.nl",
            priceRange: "€149-€299",
            areaServed: ["Apeldoorn", "Deventer", "Arnhem", "Zutphen"],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Apeldoorn",
              addressCountry: "NL",
            },
          }}
        />
        <CartProvider>
          <Navbar logoUrl={logoUrl} />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer logoUrl={logoUrl} />
          <StickyMobileCTA />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
