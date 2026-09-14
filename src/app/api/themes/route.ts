import { NextRequest, NextResponse } from "next/server";
import { getThemes, createTheme, type Theme } from "@/lib/themes";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  return NextResponse.json(await getThemes());
}

export async function POST(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = await request.json();
  const {
    name,
    slug,
    emoji,
    tagline,
    description,
    longDescription,
    ageRange,
    vanaf,
    gradient,
    activities,
    includes,
    featured,
  } = body;

  if (!name || !emoji || !tagline || !description || !longDescription || !ageRange || !gradient) {
    return NextResponse.json(
      { error: "Vul alle verplichte velden in." },
      { status: 400 }
    );
  }

  const theme: Omit<Theme, "slug"> & { slug?: string } = {
    slug,
    name,
    emoji,
    tagline,
    description,
    longDescription,
    ageRange,
    vanaf: Number(vanaf) || 0,
    gradient,
    activities: Array.isArray(activities) ? activities.filter(Boolean) : [],
    includes: Array.isArray(includes) ? includes.filter(Boolean) : [],
    featured: Boolean(featured),
  };

  const created = await createTheme(theme);
  return NextResponse.json(created, { status: 201 });
}
