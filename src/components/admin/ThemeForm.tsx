"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GRADIENT_OPTIONS, DEFAULT_CHECKLIST, type Theme } from "@/lib/theme-constants";
import ThemeImageManager from "./ThemeImageManager";

type ThemeFormValues = {
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  longDescription: string;
  ageRange: string;
  vanaf: string;
  gradient: string;
  activities: string[];
  includes: string[];
  featured: boolean;
  checklist: string[];
};

function toFormValues(theme?: Theme): ThemeFormValues {
  return {
    name: theme?.name ?? "",
    emoji: theme?.emoji ?? "🎉",
    tagline: theme?.tagline ?? "",
    description: theme?.description ?? "",
    longDescription: theme?.longDescription ?? "",
    ageRange: theme?.ageRange ?? "4 - 12 jaar",
    vanaf: theme ? String(theme.vanaf) : "149",
    gradient: theme?.gradient ?? GRADIENT_OPTIONS[0].value,
    activities: theme?.activities?.length ? theme.activities : [""],
    includes: theme?.includes?.length ? theme.includes : [""],
    featured: theme?.featured ?? false,
    checklist: theme?.checklist?.length ? theme.checklist : DEFAULT_CHECKLIST,
  };
}

export default function ThemeForm({ theme }: { theme?: Theme }) {
  const router = useRouter();
  const isEdit = Boolean(theme);
  const [values, setValues] = useState<ThemeFormValues>(() => toFormValues(theme));
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  function update<K extends keyof ThemeFormValues>(key: K, value: ThemeFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function updateListItem(
    list: "activities" | "includes" | "checklist",
    index: number,
    value: string
  ) {
    setValues((v) => {
      const next = [...v[list]];
      next[index] = value;
      return { ...v, [list]: next };
    });
  }

  function addListItem(list: "activities" | "includes" | "checklist") {
    setValues((v) => ({ ...v, [list]: [...v[list], ""] }));
  }

  function removeListItem(list: "activities" | "includes" | "checklist", index: number) {
    setValues((v) => ({ ...v, [list]: v[list].filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const payload = {
      ...values,
      vanaf: Number(values.vanaf),
      activities: values.activities.map((a) => a.trim()).filter(Boolean),
      includes: values.includes.map((i) => i.trim()).filter(Boolean),
      checklist: values.checklist.map((c) => c.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(isEdit ? `/api/themes/${theme!.slug}` : "/api/themes", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Er ging iets mis.");
      }
      const saved = await res.json();
      router.push(`/admin/feestjes/${saved.slug}`);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
  }

  async function handleDelete() {
    if (!theme) return;
    if (!confirm(`Weet je zeker dat je "${theme.name}" wilt verwijderen?`)) return;
    setStatus("loading");
    try {
      const res = await fetch(`/api/themes/${theme.slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Verwijderen mislukt.");
      router.push("/admin/feestjes");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-[1fr_120px]">
        <div>
          <label className="text-sm font-semibold">Naam thema</label>
          <input
            required
            type="text"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            placeholder="Bijv. Prinsessenfeest"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Emoji</label>
          <input
            required
            type="text"
            value={values.emoji}
            onChange={(e) => update("emoji", e.target.value)}
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-center text-lg focus:border-coral focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">Korte tagline</label>
        <input
          required
          type="text"
          value={values.tagline}
          onChange={(e) => update("tagline", e.target.value)}
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          placeholder="Eén zin die het thema samenvat"
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Korte beschrijving (op kaarten)</label>
        <textarea
          required
          rows={2}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Uitgebreide beschrijving (detailpagina)</label>
        <textarea
          required
          rows={4}
          value={values.longDescription}
          onChange={(e) => update("longDescription", e.target.value)}
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="text-sm font-semibold">Leeftijd</label>
          <input
            required
            type="text"
            value={values.ageRange}
            onChange={(e) => update("ageRange", e.target.value)}
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
            placeholder="4 - 9 jaar"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Vanafprijs (€)</label>
          <input
            required
            type="number"
            min={0}
            value={values.vanaf}
            onChange={(e) => update("vanaf", e.target.value)}
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Kleurverloop</label>
          <select
            value={values.gradient}
            onChange={(e) => update("gradient", e.target.value)}
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          >
            {GRADIENT_OPTIONS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className={`h-16 rounded-2xl bg-gradient-to-br ${values.gradient} flex items-center gap-3 px-5 text-sm font-semibold`}
      >
        <span className="text-2xl">{values.emoji}</span>
        Voorbeeld van de kaartkleur
      </div>

      <ListEditor
        label="Programma-onderdelen"
        items={values.activities}
        onChange={(i, v) => updateListItem("activities", i, v)}
        onAdd={() => addListItem("activities")}
        onRemove={(i) => removeListItem("activities", i)}
      />

      <ListEditor
        label="Inbegrepen"
        items={values.includes}
        onChange={(i, v) => updateListItem("includes", i, v)}
        onAdd={() => addListItem("includes")}
        onRemove={(i) => removeListItem("includes", i)}
      />

      <ListEditor
        label="Checklist voor het draaiboek"
        items={values.checklist}
        onChange={(i, v) => updateListItem("checklist", i, v)}
        onAdd={() => addListItem("checklist")}
        onRemove={(i) => removeListItem("checklist", i)}
      />

      {isEdit && theme && (
        <div>
          <label className="text-sm font-semibold">Foto&apos;s (draaiboek &amp; themapagina)</label>
          <div className="mt-2">
            <ThemeImageManager slug={theme.slug} />
          </div>
        </div>
      )}

      <label className="flex items-center gap-3 text-sm font-semibold">
        <input
          type="checkbox"
          checked={values.featured}
          onChange={(e) => update("featured", e.target.checked)}
          className="h-5 w-5 accent-coral"
        />
        Uitgelicht op de homepage
      </label>

      {error && <p className="rounded-xl bg-coral-soft px-4 py-3 text-sm">{error}</p>}

      <div className="flex flex-wrap items-center gap-3 border-t border-ink/10 pt-6">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream hover:bg-coral disabled:opacity-60"
        >
          {status === "loading" ? "Opslaan..." : isEdit ? "Wijzigingen opslaan" : "Thema toevoegen"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={status === "loading"}
            className="rounded-full px-7 py-3.5 text-sm font-semibold text-coral hover:bg-coral-soft disabled:opacity-60"
          >
            Thema verwijderen
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
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 text-sm font-semibold text-coral"
      >
        + Item toevoegen
      </button>
    </div>
  );
}
