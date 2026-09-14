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

export function siteImageUrl(slot: SiteImageSlot): string {
  const filePath = path.join(IMAGES_DIR, slot.filename);
  let version = 0;
  try {
    version = Math.floor(fs.statSync(filePath).mtimeMs);
  } catch {
    version = 0;
  }
  return `/images/${slot.filename}?v=${version}`;
}

export function saveSiteImage(slot: SiteImageSlot, buffer: Buffer) {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
  fs.writeFileSync(path.join(IMAGES_DIR, slot.filename), buffer);
}
