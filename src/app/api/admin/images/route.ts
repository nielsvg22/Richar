import { NextRequest, NextResponse } from "next/server";
import { getSiteImageSlot, saveSiteImage } from "@/lib/siteImages";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const slotId = formData.get("slotId");
  const file = formData.get("file");

  if (typeof slotId !== "string" || !(file instanceof File)) {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const slot = getSiteImageSlot(slotId);
  if (!slot) {
    return NextResponse.json({ error: "Onbekende afbeelding." }, { status: 404 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Alleen PNG, JPG of WebP bestanden zijn toegestaan." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Bestand is te groot (max 5MB)." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  saveSiteImage(slot, buffer);

  return NextResponse.json({ success: true });
}
