import { NextRequest, NextResponse } from "next/server";
import { addWorkshopImage, getWorkshopImages } from "@/lib/workshopImages";
import { requireAdminApi } from "@/lib/adminAuth";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export async function GET(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const workshopSlug = request.nextUrl.searchParams.get("workshopSlug");
  if (!workshopSlug) {
    return NextResponse.json({ error: "workshopSlug is verplicht." }, { status: 400 });
  }
  return NextResponse.json(await getWorkshopImages(workshopSlug));
}

export async function POST(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const formData = await request.formData();
  const workshopSlug = formData.get("workshopSlug");
  const file = formData.get("file");

  if (typeof workshopSlug !== "string" || !(file instanceof File)) {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Alleen PNG, JPG, WebP of SVG bestanden zijn toegestaan." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Bestand is te groot (max 5MB)." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const image = await addWorkshopImage(workshopSlug, buffer, file.type);

  return NextResponse.json(image, { status: 201 });
}
