"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Workshop } from "@/lib/workshop-constants";
import { formatPrice } from "@/lib/workshop-constants";

export default function WorkshopTable({
  items,
}: {
  items: { workshop: Workshop; imageUrl: string }[];
}) {
  const router = useRouter();
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  async function togglePublished(workshop: Workshop) {
    setPendingSlug(workshop.slug);
    try {
      await fetch(`/api/workshops/${workshop.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !workshop.published }),
      });
      router.refresh();
    } finally {
      setPendingSlug(null);
    }
  }

  async function duplicate(workshop: Workshop) {
    setPendingSlug(workshop.slug);
    try {
      await fetch("/api/workshops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...workshop,
          title: `${workshop.title} (kopie)`,
          slug: undefined,
          published: false,
        }),
      });
      router.refresh();
    } finally {
      setPendingSlug(null);
    }
  }

  async function remove(workshop: Workshop) {
    if (!confirm(`Weet je zeker dat je "${workshop.title}" wilt verwijderen?`)) return;
    setPendingSlug(workshop.slug);
    try {
      await fetch(`/api/workshops/${workshop.slug}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setPendingSlug(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-[2rem] bg-white p-12 text-center">
        <p className="font-heading text-lg font-bold">Nog geen workshops</p>
        <p className="mt-2 text-sm text-ink-soft">
          Voeg je eerste workshop toe en hij verschijnt hier automatisch.
        </p>
        <Link
          href="/admin/workshops/nieuw"
          className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coral"
        >
          + Workshop toevoegen
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto rounded-[2rem] bg-white shadow-sm">
      <table className="w-full min-w-[880px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wide text-ink-soft">
            <th className="px-6 py-4">Workshop</th>
            <th className="px-6 py-4">Categorie</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Prijs</th>
            <th className="px-6 py-4">Volgorde</th>
            <th className="px-6 py-4">Laatst aangepast</th>
            <th className="px-6 py-4 text-right">Acties</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ workshop, imageUrl }) => {
            const isPending = pendingSlug === workshop.slug;
            return (
              <tr key={workshop.slug} className="border-b border-ink/5 last:border-0">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt=""
                      className="h-12 w-12 flex-shrink-0 rounded-xl object-cover"
                    />
                    <Link
                      href={`/admin/workshops/${workshop.slug}`}
                      className="font-semibold hover:text-coral"
                    >
                      {workshop.title}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 text-ink-soft">{workshop.category}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      workshop.published ? "bg-mint-soft text-ink" : "bg-cream-soft text-ink-soft"
                    }`}
                  >
                    {workshop.published ? "Gepubliceerd" : "Verborgen"}
                  </span>
                </td>
                <td className="px-6 py-4 text-ink-soft">{formatPrice(workshop)}</td>
                <td className="px-6 py-4 text-ink-soft">{workshop.sortOrder}</td>
                <td className="px-6 py-4 text-ink-soft">
                  {new Date(workshop.updatedAt).toLocaleDateString("nl-NL")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap items-center justify-end gap-3 text-xs font-semibold">
                    <Link href={`/admin/workshops/${workshop.slug}`} className="hover:text-coral">
                      Bewerken
                    </Link>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => duplicate(workshop)}
                      className="hover:text-coral disabled:opacity-40"
                    >
                      Dupliceren
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => togglePublished(workshop)}
                      className="hover:text-coral disabled:opacity-40"
                    >
                      {workshop.published ? "Verbergen" : "Publiceren"}
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => remove(workshop)}
                      className="text-coral hover:underline disabled:opacity-40"
                    >
                      Verwijderen
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
