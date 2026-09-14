"use client";

import { useEffect, useState } from "react";

type ThemeImage = {
  id: string;
  themeSlug: string;
  contentType: string;
  sortOrder: number;
};

export default function ThemeImageManager({ slug }: { slug: string }) {
  const [images, setImages] = useState<ThemeImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/theme-images?themeSlug=${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled) setImages(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/theme-images?themeSlug=${encodeURIComponent(slug)}`);
      if (res.ok) setImages(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("themeSlug", slug);
      formData.append("file", file);
      const res = await fetch("/api/admin/theme-images", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Uploaden mislukt.");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Uploaden mislukt.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Deze foto verwijderen?")) return;
    const res = await fetch(`/api/admin/theme-images/${id}`, { method: "DELETE" });
    if (res.ok) setImages((imgs) => imgs.filter((img) => img.id !== id));
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4">
      {loading ? (
        <p className="text-sm text-ink/60">Foto&apos;s laden...</p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl">
              <img
                src={`/api/theme-images/${img.id}`}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleDelete(img.id)}
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-xs text-cream opacity-0 transition group-hover:opacity-100"
                aria-label="Verwijder foto"
              >
                ✕
              </button>
            </div>
          ))}
          {images.length === 0 && (
            <p className="col-span-full text-sm text-ink/60">
              Nog geen foto&apos;s geüpload. Zonder foto&apos;s tonen we automatisch een illustratie.
            </p>
          )}
        </div>
      )}

      <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-coral-soft px-5 py-2.5 text-sm font-semibold text-ink hover:opacity-90">
        {uploading ? "Uploaden..." : "+ Foto toevoegen"}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {error && <p className="mt-2 text-sm text-coral">{error}</p>}
    </div>
  );
}
