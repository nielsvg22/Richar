import { NextRequest, NextResponse } from "next/server";
import { getWorkshop, updateWorkshop, deleteWorkshop } from "@/lib/workshops";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { slug } = await params;
  const workshop = await getWorkshop(slug);
  if (!workshop) {
    return NextResponse.json({ error: "Workshop niet gevonden." }, { status: 404 });
  }
  return NextResponse.json(workshop);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { slug } = await params;
  const body = await request.json();

  const {
    title,
    shortDescription,
    description,
    category,
    minAge,
    maxAge,
    duration,
    minGroupSize,
    maxGroupSize,
    priceFrom,
    whatWeDo,
    includedItems,
    published,
    featured,
    metaTitle,
    metaDescription,
  } = body;

  const updated = await updateWorkshop(slug, {
    title,
    shortDescription,
    description,
    category,
    minAge: minAge !== undefined ? (minAge !== "" && minAge != null ? Number(minAge) : null) : undefined,
    maxAge: maxAge !== undefined ? (maxAge !== "" && maxAge != null ? Number(maxAge) : null) : undefined,
    duration,
    minGroupSize:
      minGroupSize !== undefined
        ? minGroupSize !== "" && minGroupSize != null
          ? Number(minGroupSize)
          : null
        : undefined,
    maxGroupSize:
      maxGroupSize !== undefined
        ? maxGroupSize !== "" && maxGroupSize != null
          ? Number(maxGroupSize)
          : null
        : undefined,
    priceFrom:
      priceFrom !== undefined ? (priceFrom !== "" && priceFrom != null ? Number(priceFrom) : null) : undefined,
    whatWeDo,
    includedItems: Array.isArray(includedItems) ? includedItems.filter(Boolean) : undefined,
    published: published !== undefined ? Boolean(published) : undefined,
    featured: featured !== undefined ? Boolean(featured) : undefined,
    metaTitle,
    metaDescription,
  });

  if (!updated) {
    return NextResponse.json({ error: "Workshop niet gevonden." }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { slug } = await params;
  const deleted = await deleteWorkshop(slug);
  if (!deleted) {
    return NextResponse.json({ error: "Workshop niet gevonden." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
