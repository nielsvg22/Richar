"use client";

import { useState } from "react";
import type { ContentField } from "@/lib/siteContent";

export default function SiteContentEditor({
  groups,
  initialValues,
}: {
  groups: [string, ContentField[]][];
  initialValues: Record<string, string>;
}) {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Opslaan mislukt.");
      const saved = await res.json();
      setValues(saved);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {groups.map(([group, fields]) => (
        <div key={group} className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-lg font-bold">{group}</h2>
          <div className="mt-5 space-y-5">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="text-sm font-semibold">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={values[field.key] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.key]: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={values[field.key] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.key]: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3 border-t border-ink/10 pt-6">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream shadow-lg hover:bg-coral disabled:opacity-60"
        >
          {status === "loading" ? "Opslaan..." : "Wijzigingen opslaan"}
        </button>
        {status === "saved" && (
          <span className="text-sm font-semibold text-ink">✓ Opgeslagen</span>
        )}
        {status === "error" && (
          <span className="text-sm font-semibold text-coral">Er ging iets mis.</span>
        )}
      </div>
    </form>
  );
}
