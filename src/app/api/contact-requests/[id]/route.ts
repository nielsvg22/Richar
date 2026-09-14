import { NextRequest, NextResponse } from "next/server";
import { getContactRequest, markContactRequestViewed } from "@/lib/contactRequests";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contactRequest = getContactRequest(id);
  if (!contactRequest) {
    return NextResponse.json({ error: "Niet gevonden." }, { status: 404 });
  }
  return NextResponse.json(contactRequest);
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contactRequest = markContactRequestViewed(id);
  if (!contactRequest) {
    return NextResponse.json({ error: "Niet gevonden." }, { status: 404 });
  }
  return NextResponse.json(contactRequest);
}
