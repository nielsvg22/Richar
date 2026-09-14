import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/lib/blog";
import JsonLd from "@/components/JsonLd";
import CTASection from "@/components/CTASection";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.publishedAt,
          author: { "@type": "Organization", name: "Rosa & Charlotte Kinderfeestjes" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.rosaencharlotte.nl/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.rosaencharlotte.nl/blog" },
            {
              "@type": "ListItem",
              position: 3,
              name: post.title,
              item: `https://www.rosaencharlotte.nl/blog/${post.slug}`,
            },
          ],
        }}
      />

      <article className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
          <Link href="/blog" className="hover:text-coral">
            Blog
          </Link>{" "}
          / <span>{post.title}</span>
        </nav>

        <span className="mt-6 inline-flex text-4xl">{post.emoji}</span>
        <h1 className="mt-4 font-heading text-3xl font-extrabold sm:text-4xl">{post.title}</h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-ink-soft">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("nl-NL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <span>·</span>
          <span>{post.readingTime} leestijd</span>
        </div>

        <p className="mt-8 text-lg text-ink-soft">{post.intro}</p>

        <div className="mt-8 space-y-8">
          {post.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-heading text-xl font-bold">{section.heading}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="mt-3 leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] bg-lavender-soft p-8 text-center">
          <p className="font-heading text-xl font-bold">Klaar om te boeken?</p>
          <p className="mt-2 text-ink/70">
            Bekijk onze thema&apos;s en boek in een paar minuten een compleet verzorgd kinderfeestje.
          </p>
          <Link
            href="/feestjes"
            className="mt-5 inline-flex rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream hover:bg-coral"
          >
            Bekijk de feestjes
          </Link>
        </div>
      </article>

      {otherPosts.length > 0 && (
        <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
          <h2 className="font-heading text-2xl font-bold">Meer lezen</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {otherPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="rounded-[2rem] bg-white p-6 shadow-sm hover:-translate-y-1 transition-transform"
              >
                <span className="text-2xl">{p.emoji}</span>
                <h3 className="mt-3 font-heading text-base font-bold">{p.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
