"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import type { SiteImageSlot } from "@/lib/siteImages";

export default function ImageSlotUploader({
  slot,
  currentUrl,
}: {
  slot: SiteImageSlot;
  currentUrl: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setStatus("loading");
    setError("");

    const formData = new FormData();
    formData.append("slotId", slot.id);
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/images", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Uploaden mislukt.");
      }
      setStatus("idle");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Uploaden mislukt.");
    }
  }

  const imageSrc = preview ?? currentUrl;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
      <div className="relative aspect-[16/10] w-full bg-cream-soft">
        {imageSrc ? (
          <Image src={imageSrc} alt={slot.label} fill unoptimized className="object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-soft">
            <span className="text-3xl">🖼️</span>
            <span className="text-xs font-semibold">Nog geen afbeelding</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="font-heading font-bold">{slot.label}</p>
        <p className="mt-1 text-sm text-ink-soft">{slot.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={status === "loading"}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-coral disabled:opacity-60"
          >
            {status === "loading" ? "Uploaden..." : "Vervangen"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="text-xs text-ink-soft">PNG, JPG of WebP, max 5MB</span>
        </div>

        {status === "error" && (
          <p className="mt-3 rounded-xl bg-coral-soft px-4 py-2 text-sm text-ink">{error}</p>
        )}
      </div>
    </div>
  );
}
