"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

const NAV_ITEMS = [
  { href: "/account", label: "Overzicht", emoji: "🏠" },
  { href: "/account/bestellingen", label: "Mijn boekingen", emoji: "🎈" },
  { href: "/account/gegevens", label: "Mijn gegevens", emoji: "👤" },
  { href: "/account/wachtwoord", label: "Wachtwoord", emoji: "🔒" },
  { href: "/account/berichten", label: "Berichten", emoji: "💌" },
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full min-w-0 rounded-[1.75rem] bg-white p-2 shadow-sm">
      <ul className="flex min-w-0 flex-wrap gap-1 lg:flex-col lg:flex-nowrap">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/account" ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <li key={item.href} className="flex-shrink-0 lg:flex-shrink">
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                  isActive ? "bg-ink text-cream" : "text-ink-soft hover:bg-cream-soft"
                }`}
              >
                <span className="text-base">{item.emoji}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 border-t border-ink/10 p-2 lg:mt-1 lg:pt-3">
        <LogoutButton className="w-full rounded-2xl px-4 py-3 text-center text-sm font-semibold text-ink-soft hover:bg-coral-soft hover:text-ink" />
      </div>
    </nav>
  );
}
