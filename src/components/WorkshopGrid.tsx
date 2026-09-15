"use client";

import { useMemo, useState } from "react";
import type { Workshop } from "@/lib/workshop-constants";
import WorkshopCard from "./WorkshopCard";

export default function WorkshopGrid({
  items,
}: {
  items: { workshop: Workshop; imageUrl: string }[];
}) {
  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.workshop.category).filter(Boolean))),
    [items]
  );
  const [active, setActive] = useState<string | null>(null);

  const filtered = active ? items.filter((i) => i.workshop.category === active) : items;

  if (items.length === 0) {
    return (
      <div className="rounded-[2.5rem] bg-white p-12 text-center text-ink-soft">
        Binnenkort vind je hier onze leukste workshops ✨
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setActive(null)}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
            active === null ? "bg-ink text-cream" : "bg-white text-ink/70 hover:bg-cream-soft"
          }`}
        >
          Alle workshops
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              active === category ? "bg-ink text-cream" : "bg-white text-ink/70 hover:bg-cream-soft"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(({ workshop, imageUrl }) => (
          <WorkshopCard key={workshop.slug} workshop={workshop} imageUrl={imageUrl} />
        ))}
      </div>
    </div>
  );
}
