import fs from "fs";
import path from "path";

export type SiteImageSlot = {
  id: string;
  label: string;
  description: string;
  filename: string;
};

export const SITE_IMAGE_SLOTS: SiteImageSlot[] = [
  {
    id: "hero",
    label: "Hero-afbeelding",
    description: "Grote foto rechts bovenaan de homepage.",
    filename: "hero.jpg",
  },
  {
    id: "logo",
    label: "Logo",
    description: "Verschijnt in de navigatiebalk en de footer.",
    filename: "logo.png",
  },
  {
    id: "team-jungle-party",
    label: "Teamfoto — Jungle Party",
    description: "Gebruikt op de Over ons-pagina en homepage.",
    filename: "team-jungle-party.jpg",
  },
  {
    id: "team-office",
    label: "Teamfoto — Kantoor",
    description: "Gebruikt op de Over ons-pagina.",
    filename: "team-office.jpg",
  },
];

const IMAGES_DIR = path.join(process.cwd(), "public", "images");

export function getSiteImageSlot(id: string): SiteImageSlot | undefined {
  return SITE_IMAGE_SLOTS.find((slot) => slot.id === id);
}

export function siteImageExists(slot: SiteImageSlot): boolean {
  return fs.existsSync(path.join(IMAGES_DIR, slot.filename));
}

export function siteImageUrl(slot: SiteImageSlot): string | null {
  const filePath = path.join(IMAGES_DIR, slot.filename);
  try {
    const version = Math.floor(fs.statSync(filePath).mtimeMs);
    return `/images/${slot.filename}?v=${version}`;
  } catch {
    return null;
  }
}

export function saveSiteImage(slot: SiteImageSlot, buffer: Buffer) {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
  fs.writeFileSync(path.join(IMAGES_DIR, slot.filename), buffer);
}
