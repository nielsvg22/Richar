import { NextRequest, NextResponse } from "next/server";
import { getWorkshops, createWorkshop, type Workshop } from "@/lib/workshops";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  return NextResponse.json(await getWorkshops());
}

export async function POST(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = await request.json();
  const {
    title,
    slug,
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

  if (!title || !shortDescription || !category) {
    return NextResponse.json(
      { error: "Vul in ieder geval titel, korte omschrijving en categorie in." },
      { status: 400 }
    );
  }

  const workshop: Omit<Workshop, "slug" | "sortOrder" | "updatedAt"> & { slug?: string } = {
    slug,
    title,
    shortDescription,
    description: description ?? "",
    category,
    minAge: minAge !== "" && minAge != null ? Number(minAge) : null,
    maxAge: maxAge !== "" && maxAge != null ? Number(maxAge) : null,
    duration: duration ?? "",
    minGroupSize: minGroupSize !== "" && minGroupSize != null ? Number(minGroupSize) : null,
    maxGroupSize: maxGroupSize !== "" && maxGroupSize != null ? Number(maxGroupSize) : null,
    priceFrom: priceFrom !== "" && priceFrom != null ? Number(priceFrom) : null,
    whatWeDo: whatWeDo ?? "",
    includedItems: Array.isArray(includedItems) ? includedItems.filter(Boolean) : [],
    published: published !== undefined ? Boolean(published) : true,
    featured: Boolean(featured),
    metaTitle: metaTitle ?? "",
    metaDescription: metaDescription ?? "",
  };

  const created = await createWorkshop(workshop);
  return NextResponse.json(created, { status: 201 });
}
