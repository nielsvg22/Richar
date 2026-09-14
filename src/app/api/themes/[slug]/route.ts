import { NextRequest, NextResponse } from "next/server";
import { getTheme, updateTheme, deleteTheme } from "@/lib/themes";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const theme = getTheme(slug);
  if (!theme) {
    return NextResponse.json({ error: "Thema niet gevonden." }, { status: 404 });
  }
  return NextResponse.json(theme);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();

  const {
    name,
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

  const updated = updateTheme(slug, {
    name,
    emoji,
    tagline,
    description,
    longDescription,
    ageRange,
    vanaf: vanaf !== undefined ? Number(vanaf) : undefined,
    gradient,
    activities: Array.isArray(activities) ? activities.filter(Boolean) : undefined,
    includes: Array.isArray(includes) ? includes.filter(Boolean) : undefined,
    featured: featured !== undefined ? Boolean(featured) : undefined,
  });

  if (!updated) {
    return NextResponse.json({ error: "Thema niet gevonden." }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const deleted = deleteTheme(slug);
  if (!deleted) {
    return NextResponse.json({ error: "Thema niet gevonden." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
