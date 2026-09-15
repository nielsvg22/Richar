export type Workshop = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  minAge: number | null;
  maxAge: number | null;
  duration: string;
  minGroupSize: number | null;
  maxGroupSize: number | null;
  priceFrom: number | null;
  whatWeDo: string;
  includedItems: string[];
  published: boolean;
  featured: boolean;
  sortOrder: number;
  metaTitle: string;
  metaDescription: string;
  updatedAt: string;
};

export const DEFAULT_INCLUDED_ITEMS = [
  "Alle materialen",
  "Begeleiding",
  "Gebruik van materialen/gereedschap",
  "Opruimen",
  "Een eigen creatie mee naar huis",
];

export function formatAgeRange(workshop: Pick<Workshop, "minAge" | "maxAge">): string {
  if (workshop.minAge && workshop.maxAge) return `${workshop.minAge} - ${workshop.maxAge} jaar`;
  if (workshop.minAge) return `Vanaf ${workshop.minAge} jaar`;
  if (workshop.maxAge) return `Tot ${workshop.maxAge} jaar`;
  return "Alle leeftijden";
}

export function formatGroupSize(workshop: Pick<Workshop, "minGroupSize" | "maxGroupSize">): string {
  if (workshop.minGroupSize && workshop.maxGroupSize) {
    return `${workshop.minGroupSize} - ${workshop.maxGroupSize} kinderen`;
  }
  if (workshop.minGroupSize) return `Vanaf ${workshop.minGroupSize} kinderen`;
  if (workshop.maxGroupSize) return `Tot ${workshop.maxGroupSize} kinderen`;
  return "";
}

export function formatPrice(workshop: Pick<Workshop, "priceFrom">): string {
  return workshop.priceFrom != null ? `Vanaf €${workshop.priceFrom}` : "Prijs op aanvraag";
}
