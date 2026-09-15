import { NextRequest, NextResponse } from "next/server";
import { getThemeMaterials, setThemeMaterials, type ThemeMaterial } from "@/lib/themeMaterials";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const themeSlug = request.nextUrl.searchParams.get("themeSlug");
  if (!themeSlug) {
    return NextResponse.json({ error: "themeSlug is verplicht." }, { status: 400 });
  }
  return NextResponse.json(await getThemeMaterials(themeSlug));
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = await request.json();
  const { themeSlug, materials } = body;

  if (!themeSlug || !Array.isArray(materials)) {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const clean: ThemeMaterial[] = materials
    .filter((m: { itemId?: string; quantity?: number }) => m.itemId)
    .map((m: { itemId: string; quantity: number }) => ({
      itemId: m.itemId,
      quantity: Number(m.quantity) || 1,
    }));

  await setThemeMaterials(themeSlug, clean);
  return NextResponse.json(await getThemeMaterials(themeSlug));
}
