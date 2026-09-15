import { NextRequest, NextResponse } from "next/server";
import { getProductImageData } from "@/lib/productImages";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const image = await getProductImageData(id);
  if (!image) {
    return NextResponse.json({ error: "Afbeelding niet gevonden." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
