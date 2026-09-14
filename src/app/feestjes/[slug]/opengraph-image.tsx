import { ImageResponse } from "next/og";
import { getTheme } from "@/lib/themes";
import { OgTemplate, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const theme = await getTheme(slug);

  return new ImageResponse(
    (
      <OgTemplate
        emoji={theme?.emoji ?? "🎉"}
        title={theme?.name ?? "Kinderfeestje"}
        subtitle={theme?.tagline ?? "Compleet verzorgd door Rosa & Charlotte"}
      />
    ),
    { ...size }
  );
}
