import { ImageResponse } from "next/og";
import { getBlogPost } from "@/lib/blog";
import { OgTemplate, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  return new ImageResponse(
    (
      <OgTemplate
        emoji={post?.emoji ?? "✍️"}
        title={post?.title ?? "Blog"}
        subtitle="Rosa & Charlotte Kinderfeestjes"
      />
    ),
    { ...size }
  );
}
