import type { Theme } from "@/lib/themes";
import ThemeCard from "./ThemeCard";

export default function ThemeGrid({ themes }: { themes: Theme[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {themes.map((theme, i) => (
        <ThemeCard key={theme.slug} theme={theme} index={i} />
      ))}
    </div>
  );
}
