import Link from "next/link";
import type { Theme } from "@/lib/themes";

export default function ThemeCard({ theme, index = 0 }: { theme: Theme; index?: number }) {
  const rounded = index % 2 === 0 ? "rounded-[2.5rem]" : "rounded-[2.5rem] sm:rounded-tr-[5rem]";

  return (
    <Link
      href={`/feestjes/${theme.slug}`}
      className={`group relative flex flex-col overflow-hidden ${rounded} bg-gradient-to-br ${theme.gradient} p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/70 text-2xl">
        {theme.emoji}
      </span>
      <h3 className="mt-5 font-heading text-xl font-bold">{theme.name}</h3>
      <p className="mt-2 text-sm text-ink/70">{theme.tagline}</p>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink/80">
          vanaf €{theme.vanaf}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}
