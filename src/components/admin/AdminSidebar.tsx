"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", emoji: "📊" },
  { href: "/admin/agenda", label: "Agenda", emoji: "🗓️" },
  { href: "/admin/feestjes", label: "Feestjes", emoji: "🎨" },
  { href: "/admin/kortingscodes", label: "Kortingscodes", emoji: "🏷️" },
  { href: "/admin/instellingen", label: "Instellingen", emoji: "⚙️" },
  { href: "/", label: "Naar website", emoji: "🌐" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col gap-1 border-b border-ink/10 bg-white p-4 md:h-screen md:w-64 md:flex-shrink-0 md:border-b-0 md:border-r md:p-6">
      <div className="mb-4 flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-base blob">
          🎉
        </span>
        <span className="font-heading text-sm font-extrabold">
          Rosa &amp; Charlotte
        </span>
      </div>
      <nav className="flex gap-1 md:flex-col">
        {links.map((link) => {
          const isActive =
            link.href === "/admin" || link.href === "/"
              ? pathname === link.href
              : pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                isActive ? "bg-mint-soft text-ink" : "text-ink-soft hover:bg-cream-soft"
              }`}
            >
              <span>{link.emoji}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
