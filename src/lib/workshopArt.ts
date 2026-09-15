const CATEGORY_STYLE: Record<string, { from: string; to: string; emoji: string; accents: string[] }> = {
  creatief: { from: "#f8c49a", to: "#fbf0c3", emoji: "🎨", accents: ["✏️", "🖼️"] },
  beauty: { from: "#f6b6c8", to: "#fbdcd2", emoji: "💅", accents: ["💄", "✨"] },
  bakken: { from: "#fbf0c3", to: "#fce6d1", emoji: "🧁", accents: ["🍰", "🍓"] },
};

const DEFAULT_STYLE = { from: "#cfc4f6", to: "#f6b6c8", emoji: "✨", accents: ["🎉", "⭐"] };

// Per-workshop overrides so sibling workshops in the same category (e.g. the
// three "Creatief" workshops) don't all render the identical placeholder —
// each gets its own emoji + accent pair layered on the category gradient.
const SLUG_STYLE: Record<string, { emoji: string; accents: string[] }> = {
  "sieraden-workshop": { emoji: "💎", accents: ["📿", "✨"] },
  "schilder-workshop": { emoji: "🖌️", accents: ["🎨", "🖼️"] },
  "beauty-workshop": { emoji: "💅", accents: ["💄", "✨"] },
  "cupcake-workshop": { emoji: "🧁", accents: ["🍰", "🍓"] },
  "tasjes-versieren": { emoji: "👜", accents: ["🎀", "✨"] },
  "mini-glam-workshop": { emoji: "💄", accents: ["👑", "💫"] },
};

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) || 1;
}

function buildSvg(
  gradientFrom: string,
  gradientTo: string,
  emoji: string,
  accents: string[],
  seed: number
): string {
  const rand = seededRandom(seed);
  const gradId = `wg${seed}`;
  const blobs = Array.from({ length: 4 }, () => {
    const cx = 60 + rand() * 680;
    const cy = 60 + rand() * 480;
    const r = 60 + rand() * 90;
    const opacity = (0.18 + rand() * 0.22).toFixed(2);
    return `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="#ffffff" opacity="${opacity}" />`;
  }).join("");

  const accentSpots = [
    { x: 130 + rand() * 60, y: 90 + rand() * 60 },
    { x: 610 + rand() * 60, y: 470 + rand() * 60 },
  ];
  const accentMarks = accents
    .slice(0, 2)
    .map((accentEmoji, i) => {
      const spot = accentSpots[i];
      const rotate = (rand() * 30 - 15).toFixed(1);
      return `<text x="${spot.x.toFixed(0)}" y="${spot.y.toFixed(0)}" font-size="70" text-anchor="middle" dominant-baseline="middle" opacity="0.55" transform="rotate(${rotate} ${spot.x.toFixed(0)} ${spot.y.toFixed(0)})">${accentEmoji}</text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradientFrom}" />
      <stop offset="100%" stop-color="${gradientTo}" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#${gradId})" />
  ${blobs}
  ${accentMarks}
  <text x="400" y="330" font-size="200" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
</svg>`;
}

export function getWorkshopArtDataUrl(slug: string, category: string): string {
  const categoryStyle = CATEGORY_STYLE[category.trim().toLowerCase()] ?? DEFAULT_STYLE;
  const override = SLUG_STYLE[slug];
  const emoji = override?.emoji ?? categoryStyle.emoji;
  const accents = override?.accents ?? categoryStyle.accents;
  const svg = buildSvg(categoryStyle.from, categoryStyle.to, emoji, accents, hashString(slug));
  const encoded = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${encoded}`;
}
