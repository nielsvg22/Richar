import type { MetadataRoute } from "next";
import { getThemes } from "@/lib/themes";
import { blogPosts } from "@/lib/blog";
import { locations } from "@/lib/locations";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const themes = await getThemes();
  const base = "https://www.rosaencharlotte.nl";
  const staticRoutes = [
    "",
    "/feestjes",
    "/prijzen",
    "/over-ons",
    "/contact",
    "/boeken",
    "/faq",
    "/blog",
    "/cadeaubon",
  ].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));

  const themeRoutes = themes.map((theme) => ({
    url: `${base}/feestjes/${theme.slug}`,
    lastModified: new Date(),
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.publishedAt,
  }));

  const locationRoutes = locations.map((loc) => ({
    url: `${base}/kinderfeestje/${loc.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...themeRoutes, ...blogRoutes, ...locationRoutes];
}
