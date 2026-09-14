export type Location = {
  slug: string;
  name: string;
  intro: string;
  areas: string[];
  travelNote: string;
};

export const locations: Location[] = [
  {
    slug: "apeldoorn",
    name: "Apeldoorn",
    intro:
      "Apeldoorn is onze thuisbasis, en dat merk je: hier organiseren we de meeste kinderfeestjes. Of het nu bij jullie thuis is in de Maten, Zevenhuizen of het centrum, wij kennen de stad en zijn snel bij je binnen.",
    areas: ["Zevenhuizen", "De Maten", "Osseveld", "Zuidbroek", "Berg en Bos"],
    travelNote: "Geen reiskosten binnen Apeldoorn.",
  },
  {
    slug: "deventer",
    name: "Deventer",
    intro:
      "Ook in Deventer en omgeving komen we graag langs voor een kinderfeestje vol thema, plezier en decoratie. Van de binnenstad tot Colmschate: we regelen alles, jij geniet van de dag.",
    areas: ["Colmschate", "Keizerslanden", "Binnenstad", "Voorstad", "Borgele"],
    travelNote: "Kleine reiskostenbijdrage vanaf 20km, altijd vooraf duidelijk gecommuniceerd.",
  },
  {
    slug: "arnhem",
    name: "Arnhem",
    intro:
      "In Arnhem organiseren we kinderfeestjes voor gezinnen door de hele stad, van Presikhaaf tot Schuytgraaf. Compleet verzorgd, inclusief decoratie, activiteit en begeleiding.",
    areas: ["Presikhaaf", "Schuytgraaf", "Elden", "Malburgen", "Alteveer"],
    travelNote: "Kleine reiskostenbijdrage vanaf 20km, altijd vooraf duidelijk gecommuniceerd.",
  },
  {
    slug: "zutphen",
    name: "Zutphen",
    intro:
      "Zutphen en omstreken? Ook daar staan Rosa & Charlotte voor je klaar. We combineren onze liefde voor creatieve thema's met de gezelligheid van een kleinere stad.",
    areas: ["Waterkwartier", "Leesten", "Zutphen-Zuid", "Warnsveld"],
    travelNote: "Geen reiskosten binnen Zutphen en Warnsveld.",
  },
];

export function getLocation(slug: string) {
  return locations.find((l) => l.slug === slug);
}
