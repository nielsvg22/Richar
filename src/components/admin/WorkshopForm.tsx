"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEFAULT_INCLUDED_ITEMS, type Workshop } from "@/lib/workshop-constants";
import WorkshopImageManager from "./WorkshopImageManager";

type WorkshopFormValues = {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  minAge: string;
  maxAge: string;
  duration: string;
  minGroupSize: string;
  maxGroupSize: string;
  priceFrom: string;
  whatWeDo: string;
  includedItems: string[];
  published: boolean;
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
};

function toFormValues(workshop?: Workshop): WorkshopFormValues {
  return {
    title: workshop?.title ?? "",
    shortDescription: workshop?.shortDescription ?? "",
    description: workshop?.description ?? "",
    category: workshop?.category ?? "Creatief",
    minAge: workshop?.minAge != null ? String(workshop.minAge) : "",
    maxAge: workshop?.maxAge != null ? String(workshop.maxAge) : "",
    duration: workshop?.duration ?? "90 minuten",
    minGroupSize: workshop?.minGroupSize != null ? String(workshop.minGroupSize) : "",
    maxGroupSize: workshop?.maxGroupSize != null ? String(workshop.maxGroupSize) : "",
    priceFrom: workshop?.priceFrom != null ? String(workshop.priceFrom) : "",
    whatWeDo: workshop?.whatWeDo ?? "",
    includedItems: workshop?.includedItems?.length ? workshop.includedItems : DEFAULT_INCLUDED_ITEMS,
    published: workshop?.published ?? true,
    featured: workshop?.featured ?? false,
    metaTitle: workshop?.metaTitle ?? "",
    metaDescription: workshop?.metaDescription ?? "",
  };
}

export default function WorkshopForm({ workshop }: { workshop?: Workshop }) {
  const router = useRouter();
  const isEdit = Boolean(workshop);
  const [values, setValues] = useState<WorkshopFormValues>(() => toFormValues(workshop));
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  function update<K extends keyof WorkshopFormValues>(key: K, value: WorkshopFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function updateItem(index: number, value: string) {
    setValues((v) => {
      const next = [...v.includedItems];
      next[index] = value;
      return { ...v, includedItems: next };
    });
  }

  function addItem() {
    setValues((v) => ({ ...v, includedItems: [...v.includedItems, ""] }));
  }

  function removeItem(index: number) {
    setValues((v) => ({ ...v, includedItems: v.includedItems.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    if (!values.title.trim() || !values.shortDescription.trim() || !values.category.trim()) {
      setStatus("error");
      setError("Vul in ieder geval titel, korte omschrijving en categorie in.");
      return;
    }

    const payload = {
      ...values,
      includedItems: values.includedItems.map((i) => i.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(isEdit ? `/api/workshops/${workshop!.slug}` : "/api/workshops", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Er ging iets mis.");
      }
      const saved = await res.json();
      router.push(`/admin/workshops/${saved.slug}`);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
  }

  async function handleDelete() {
    if (!workshop) return;
    if (!confirm(`Weet je zeker dat je "${workshop.title}" wilt verwijderen?`)) return;
    setStatus("loading");
    try {
      const res = await fetch(`/api/workshops/${workshop.slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Verwijderen mislukt.");
      router.push("/admin/workshops");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basis */}
      <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-heading text-lg font-bold">Basis</h2>
        <div className="mt-5 space-y-5">
          <div>
            <label className="text-sm font-semibold">Titel</label>
            <input
              required
              type="text"
              value={values.title}
              onChange={(e) => update("title", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              placeholder="Bijv. Sieraden Workshop"
            />
          </div>
          {isEdit && workshop && (
            <div>
              <label className="text-sm font-semibold">Slug</label>
              <p className="mt-2 rounded-2xl border border-ink/10 bg-cream-soft px-4 py-3 text-sm text-ink-soft">
                /workshops/{workshop.slug}
              </p>
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">Categorie</label>
              <input
                required
                type="text"
                value={values.category}
                onChange={(e) => update("category", e.target.value)}
                list="workshop-categories"
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
                placeholder="Creatief, Beauty, Bakken, ..."
              />
              <datalist id="workshop-categories">
                <option value="Creatief" />
                <option value="Beauty" />
                <option value="Bakken" />
              </datalist>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Korte omschrijving (op kaarten)</label>
            <textarea
              required
              rows={2}
              value={values.shortDescription}
              onChange={(e) => update("shortDescription", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Lange omschrijving (detailpagina)</label>
            <textarea
              rows={4}
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Afbeeldingen */}
      {isEdit && workshop && (
        <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-lg font-bold">Afbeeldingen</h2>
          <div className="mt-5">
            <WorkshopImageManager slug={workshop.slug} />
          </div>
        </div>
      )}

      {/* Praktisch */}
      <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-heading text-lg font-bold">Praktisch</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">Minimumleeftijd</label>
            <input
              type="number"
              min={0}
              value={values.minAge}
              onChange={(e) => update("minAge", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Maximumleeftijd</label>
            <input
              type="number"
              min={0}
              value={values.maxAge}
              onChange={(e) => update("maxAge", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Duur</label>
            <input
              type="text"
              value={values.duration}
              onChange={(e) => update("duration", e.target.value)}
              placeholder="Bijv. 90 minuten"
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Vanaf-prijs (€)</label>
            <input
              type="number"
              min={0}
              value={values.priceFrom}
              onChange={(e) => update("priceFrom", e.target.value)}
              placeholder="Leeg = prijs op aanvraag"
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Minimale groepsgrootte</label>
            <input
              type="number"
              min={0}
              value={values.minGroupSize}
              onChange={(e) => update("minGroupSize", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Maximale groepsgrootte</label>
            <input
              type="number"
              min={0}
              value={values.maxGroupSize}
              onChange={(e) => update("maxGroupSize", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Inhoud */}
      <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-heading text-lg font-bold">Inhoud</h2>
        <div className="mt-5 space-y-5">
          <div>
            <label className="text-sm font-semibold">Wat gaan we doen?</label>
            <textarea
              rows={4}
              value={values.whatWeDo}
              onChange={(e) => update("whatWeDo", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>

          <ListEditor
            label="Wat is inbegrepen?"
            items={values.includedItems}
            onChange={updateItem}
            onAdd={addItem}
            onRemove={removeItem}
          />
        </div>
      </div>

      {/* Instellingen */}
      <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-heading text-lg font-bold">Instellingen</h2>
        <div className="mt-5 flex flex-col gap-3">
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={values.published}
              onChange={(e) => update("published", e.target.checked)}
              className="h-5 w-5 accent-coral"
            />
            Gepubliceerd (zichtbaar op de website)
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="h-5 w-5 accent-coral"
            />
            Uitgelicht
          </label>
        </div>
      </div>

      {/* SEO */}
      <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-heading text-lg font-bold">SEO</h2>
        <div className="mt-5 space-y-5">
          <div>
            <label className="text-sm font-semibold">Meta title</label>
            <input
              type="text"
              value={values.metaTitle}
              onChange={(e) => update("metaTitle", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Meta description</label>
            <textarea
              rows={2}
              value={values.metaDescription}
              onChange={(e) => update("metaDescription", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>
        </div>
      </div>

      {error && <p className="rounded-xl bg-coral-soft px-4 py-3 text-sm">{error}</p>}

      <div className="flex flex-wrap items-center gap-3 border-t border-ink/10 pt-6">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream hover:bg-coral disabled:opacity-60"
        >
          {status === "loading" ? "Opslaan..." : isEdit ? "Wijzigingen opslaan" : "Workshop toevoegen"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={status === "loading"}
            className="rounded-full px-7 py-3.5 text-sm font-semibold text-coral hover:bg-coral-soft disabled:opacity-60"
          >
            Workshop verwijderen
          </button>
        )}
      </div>
    </form>
  );
}

function ListEditor({
  label,
  items,
  onChange,
  onAdd,
  onRemove,
}: {
  label: string;
  items: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <div className="mt-2 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => onChange(i, e.target.value)}
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-2.5 text-sm focus:border-coral focus:outline-none"
            />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-coral-soft text-sm"
              aria-label="Verwijder item"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={onAdd} className="mt-2 text-sm font-semibold text-coral">
        + Item toevoegen
      </button>
    </div>
  );
}
