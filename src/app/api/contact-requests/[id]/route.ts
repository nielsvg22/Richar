import { NextRequest, NextResponse } from "next/server";
import { getContactRequest, markContactRequestViewed } from "@/lib/contactRequests";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const contactRequest = await getContactRequest(id);
  if (!contactRequest) {
    return NextResponse.json({ error: "Niet gevonden." }, { status: 404 });
  }
  return NextResponse.json(contactRequest);
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const contactRequest = await markContactRequestViewed(id);
  if (!contactRequest) {
    return NextResponse.json({ error: "Niet gevonden." }, { status: 404 });
  }
  return NextResponse.json(contactRequest);
}
