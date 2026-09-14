import { NextRequest, NextResponse } from "next/server";
import { getSiteContentMap, saveSiteContent } from "@/lib/siteContent";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  return NextResponse.json(await getSiteContentMap());
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = await request.json();
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const values: Record<string, string> = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string") values[key] = value;
  }

  await saveSiteContent(values);
  return NextResponse.json(await getSiteContentMap());
}
