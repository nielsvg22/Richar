"use client";

import { useState } from "react";
import type { Theme } from "@/lib/theme-constants";
import ThemeGrid from "./ThemeGrid";

const ACTIVITY_OPTIONS = [
  {
    id: "creative",
    label: "🎨 Creatief bezig zijn",
    hint: "Knutselen, schilderen, sieraden maken",
    keywords: ["knutsel", "schilder", "sieraden", "creatie", "kunstwerk", "teken", "versier", "kralen"],
  },
  {
    id: "active",
    label: "🏃 Lekker actief zijn",
    hint: "Dansen, rennen, spelletjes doen",
    keywords: ["dans", "spel", "actie", "beweeg", "parcours", "training", "speur", "zoektocht"],
  },
  {
    id: "fantasy",
    label: "👑 Verkleden & fantasie",
    hint: "Prinses, superheld, unicorn of dino",
    keywords: ["prinses", "superheld", "unicorn", "kroon", "kostuum", "fantasie", "dino", "magisch"],
  },
  {
    id: "food",
    label: "🧁 Lekkers maken",
    hint: "Bakken, versieren en proeven",
    keywords: ["bak", "cupcake", "koek", "proeven", "lekkernij", "taart"],
  },
] as const;

const AGE_OPTIONS = [
  { id: "young", label: "4 - 6 jaar", value: 5 },
  { id: "middle", label: "7 - 9 jaar", value: 8 },
  { id: "old", label: "10 - 12 jaar", value: 11 },
] as const;

function parseAgeRange(ageRange: string): [number, number] {
  const match = ageRange.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return [4, 12];
  return [Number(match[1]), Number(match[2])];
}

function scoreTheme(theme: Theme, activityKeywords: readonly string[], targetAge: number): number {
  const haystack = [
    theme.name,
    theme.tagline,
    theme.description,
    theme.longDescription,
    ...theme.activities,
    ...theme.includes,
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  for (const keyword of activityKeywords) {
    if (haystack.includes(keyword)) score += 3;
  }

  const [min, max] = parseAgeRange(theme.ageRange);
  if (targetAge >= min && targetAge <= max) {
    score += 5;
  } else {
    const distance = targetAge < min ? min - targetAge : targetAge - max;
    score += Math.max(0, 3 - distance);
  }

  return score;
}

export default function ThemeQuiz({ themes }: { themes: Theme[] }) {
  const [step, setStep] = useState(0);
  const [activityId, setActivityId] = useState<(typeof ACTIVITY_OPTIONS)[number]["id"] | null>(null);
  const [ageId, setAgeId] = useState<(typeof AGE_OPTIONS)[number]["id"] | null>(null);

  function restart() {
    setStep(0);
    setActivityId(null);
    setAgeId(null);
  }

  if (step === 2 && activityId && ageId) {
    const activity = ACTIVITY_OPTIONS.find((o) => o.id === activityId)!;
    const age = AGE_OPTIONS.find((o) => o.id === ageId)!;
    const results = [...themes]
      .map((theme) => ({ theme, score: scoreTheme(theme, activity.keywords, age.value) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((r) => r.theme);

    return (
      <div>
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-mint-soft px-4 py-2 text-sm font-semibold">
            ✨ Dit past bij jullie
          </span>
          <h2 className="mt-4 font-heading text-2xl font-bold sm:text-3xl">
            Onze aanraders voor jullie feestje
          </h2>
        </div>
        <div className="mt-8">
          <ThemeGrid themes={results} />
        </div>
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={restart}
            className="rounded-full border-2 border-ink/10 px-6 py-3 text-sm font-semibold hover:border-coral hover:text-coral"
          >
            Opnieuw beginnen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-center gap-2">
        {[0, 1].map((i) => (
          <span
            key={i}
            className={`h-1.5 w-10 rounded-full ${i <= step ? "bg-coral" : "bg-ink/10"}`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="mt-8">
          <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
            Wat vindt jullie jarige het leukst?
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {ACTIVITY_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setActivityId(option.id);
                  setStep(1);
                }}
                className="rounded-[2rem] bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="font-heading text-lg font-bold">{option.label}</p>
                <p className="mt-1 text-sm text-ink-soft">{option.hint}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="mt-8">
          <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
            Hoe oud wordt de jarige?
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {AGE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setAgeId(option.id);
                  setStep(2);
                }}
                className="rounded-[2rem] bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="font-heading text-lg font-bold">{option.label}</p>
              </button>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="text-sm font-semibold text-ink-soft hover:text-coral"
            >
              ← Vorige vraag
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
