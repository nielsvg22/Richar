import type { MetadataRoute } from "next";
import { themes } from "@/lib/themes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.rosaencharlotte.nl";
  const staticRoutes = [
    "",
    "/feestjes",
    "/prijzen",
    "/over-ons",
    "/contact",
    "/boeken",
    "/faq",
  ].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));

  const themeRoutes = themes.map((theme) => ({
    url: `${base}/feestjes/${theme.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...themeRoutes];
}
