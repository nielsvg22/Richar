import { ImageResponse } from "next/og";
import { OgTemplate, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return new ImageResponse(
    (
      <OgTemplate
        emoji="🎉"
        title="Het leukste kinderfeestje? Dat regelen wij."
        subtitle="Creatieve, compleet verzorgde kinderfeestjes"
      />
    ),
    { ...size }
  );
}
