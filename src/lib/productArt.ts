const PALETTE: [string, string][] = [
  ["#f6b6c8", "#ebe5fc"],
  ["#f8c49a", "#fbf0c3"],
  ["#bfe4d0", "#e3f4ea"],
  ["#cfc4f6", "#f6b6c8"],
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) || 1;
}

export function getProductArtDataUrl(slug: string): string {
  const [from, to] = PALETTE[hashString(slug) % PALETTE.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g)" />
  <text x="400" y="330" font-size="200" text-anchor="middle" dominant-baseline="middle">🎁</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
