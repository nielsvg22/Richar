export type Theme = {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  longDescription: string;
  ageRange: string;
  vanaf: number;
  gradient: string;
  activities: string[];
  includes: string[];
  featured: boolean;
};

export const GRADIENT_OPTIONS = [
  { value: "from-pink to-lavender-soft", label: "Roze → Lavendel" },
  { value: "from-pink to-coral-soft", label: "Roze → Koraal" },
  { value: "from-lavender to-pink-soft", label: "Lavendel → Roze" },
  { value: "from-yellow-soft to-mint-soft", label: "Geel → Mint" },
  { value: "from-peach to-yellow-soft", label: "Perzik → Geel" },
  { value: "from-coral-soft to-lavender-soft", label: "Koraal → Lavendel" },
  { value: "from-mint to-yellow-soft", label: "Mint → Geel" },
  { value: "from-mint-soft to-lavender-soft", label: "Mint → Lavendel" },
  { value: "from-mint to-peach-soft", label: "Mint → Perzik" },
  { value: "from-coral to-yellow-soft", label: "Koraal → Geel" },
];
