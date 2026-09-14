"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StickyMobileCTA() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname === "/boeken") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-cream/95 p-3 backdrop-blur md:hidden">
      <Link
        href="/boeken"
        className="flex w-full items-center justify-center rounded-full bg-coral py-3.5 text-sm font-semibold text-cream shadow-lg shadow-coral/30"
      >
        🎉 Boek jouw feestje
      </Link>
    </div>
  );
}
