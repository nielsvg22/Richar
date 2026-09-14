import { NextRequest, NextResponse } from "next/server";
import { getThemes, createTheme, type Theme } from "@/lib/themes";

export async function GET() {
  return NextResponse.json(getThemes());
}

export async function POST(request: NextRequest) {
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

  const created = createTheme(theme);
  return NextResponse.json(created, { status: 201 });
}
