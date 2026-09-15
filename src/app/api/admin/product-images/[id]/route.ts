import { NextRequest, NextResponse } from "next/server";
import { deleteProductImage } from "@/lib/productImages";
import { requireAdminApi } from "@/lib/adminAuth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const deleted = await deleteProductImage(id);
  if (!deleted) {
    return NextResponse.json({ error: "Afbeelding niet gevonden." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
