import { NextRequest, NextResponse } from "next/server";
import { getSiteImageData } from "@/lib/siteImages";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slotId: string }> }
) {
  const { slotId } = await params;
  const image = await getSiteImageData(slotId);
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
