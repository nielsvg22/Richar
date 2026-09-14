import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — tips voor kinderfeestjes",
  description:
    "Inspiratie, checklists en praktische tips voor het organiseren van een onvergetelijk kinderfeestje, door Rosa & Charlotte.",
};

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-lavender-soft px-4 py-2 text-sm font-semibold">
          ✍️ Blog
        </span>
        <h1 className="mt-6 font-heading text-4xl font-extrabold sm:text-5xl">
          Tips &amp; inspiratie voor kinderfeestjes
        </h1>
        <p className="mt-4 text-ink-soft">
          Checklists, thema-ideeën en praktische tips, geschreven door Rosa &amp; Charlotte.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex flex-col rounded-[2rem] bg-white p-7 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
          >
            <span className="text-3xl">{post.emoji}</span>
            <h2 className="mt-4 font-heading text-xl font-bold">{post.title}</h2>
            <p className="mt-2 flex-1 text-sm text-ink-soft">{post.description}</p>
            <div className="mt-5 flex items-center justify-between text-xs text-ink-soft">
              <span>
                {new Date(post.publishedAt).toLocaleDateString("nl-NL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span>{post.readingTime} leestijd</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
