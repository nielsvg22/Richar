export type Package = {
  id: "mini" | "fun" | "deluxe";
  name: string;
  price: number;
  duration: string;
  maxKids: number;
  description: string;
  highlight: boolean;
  includes: string[];
};

export const packages: Package[] = [
  {
    id: "mini",
    name: "Mini",
    price: 149,
    duration: "2 uur begeleiding",
    maxKids: 6,
    description: "Voor kleine en gezellige feestjes.",
    highlight: false,
    includes: [
      "2 uur begeleiding",
      "Eén activiteit",
      "Basisdecoratie",
      "Alle benodigdheden",
      "Klein cadeautje voor de jarige",
    ],
  },
  {
    id: "fun",
    name: "Fun",
    price: 199,
    duration: "2,5 uur begeleiding",
    maxKids: 8,
    description: "Voor een compleet georganiseerd feestje.",
    highlight: true,
    includes: [
      "2,5 uur begeleiding",
      "Uitgebreide activiteit",
      "Themadecoratie",
      "Materialen en muziek",
      "Spelletjes en traktatie",
      "Cadeautje voor de jarige",
    ],
  },
  {
    id: "deluxe",
    name: "Deluxe",
    price: 299,
    duration: "3 uur begeleiding",
    maxKids: 10,
    description: "Voor wie echt alles uit de kast wil halen.",
    highlight: false,
    includes: [
      "3 uur begeleiding",
      "Premium thema",
      "Uitgebreide decoratie",
      "Meerdere activiteiten",
      "Eten en drinken",
      "Goodiebags",
      "Cadeautje voor de jarige",
      "Professionele feestbegeleiding",
    ],
  },
];

export function getPackage(id: string) {
  return packages.find((p) => p.id === id);
}

export const EXTRA_CHILD_PRICE = 18;

export type Extra = {
  id: string;
  name: string;
  price: number;
  unit: "vast" | "per kind";
  description: string;
};

export const extras: Extra[] = [
  {
    id: "goodiebags",
    name: "Goodiebags",
    price: 7,
    unit: "per kind",
    description: "Een leuke tas vol kleine verrassingen om mee naar huis te nemen.",
  },
  {
    id: "ballonnenboog",
    name: "Ballonnenboog",
    price: 65,
    unit: "vast",
    description: "Een kleurrijke ballonnenboog passend bij het thema.",
  },
  {
    id: "taart",
    name: "Taart",
    price: 55,
    unit: "vast",
    description: "Een verse, versierde taart passend bij het thema van het feest.",
  },
  {
    id: "cupcakes",
    name: "Cupcakes",
    price: 35,
    unit: "vast",
    description: "Een doos vrolijk versierde cupcakes voor alle gasten.",
  },
  {
    id: "extra-activiteit",
    name: "Extra activiteit",
    price: 40,
    unit: "vast",
    description: "Nog een leuke activiteit toevoegen aan het programma.",
  },
  {
    id: "uitnodigingen",
    name: "Gepersonaliseerde uitnodigingen",
    price: 20,
    unit: "vast",
    description: "Digitale uitnodigingen op maat, passend bij het thema.",
  },
  {
    id: "fotografie",
    name: "Fotografie",
    price: 75,
    unit: "vast",
    description: "Een fotograaf legt de mooiste momenten van het feest vast.",
  },
  {
    id: "thema-aankleding",
    name: "Extra thema-aankleding",
    price: 90,
    unit: "vast",
    description: "Extra decoratie voor een nog rijkere aankleding van de ruimte.",
  },
];

export function getExtra(id: string) {
  return extras.find((e) => e.id === id);
}

export function calculatePrice(pkg: Package, kids: number, extraIds: string[]) {
  const extraKids = Math.max(0, kids - pkg.maxKids);
  const extraKidsPrice = extraKids * EXTRA_CHILD_PRICE;
  const extrasPrice = extraIds.reduce((sum, id) => {
    const extra = getExtra(id);
    if (!extra) return sum;
    return sum + (extra.unit === "per kind" ? extra.price * kids : extra.price);
  }, 0);
  const total = pkg.price + extraKidsPrice + extrasPrice;
  return { extraKids, extraKidsPrice, extrasPrice, total };
}
