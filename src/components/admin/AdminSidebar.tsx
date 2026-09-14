"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", emoji: "📊", badgeKey: "unviewedBookings" },
  { href: "/admin/agenda", label: "Agenda", emoji: "🗓️", badgeKey: null },
  { href: "/admin/berichten", label: "Berichten", emoji: "📨", badgeKey: "unviewedMessages" },
  { href: "/admin/feestjes", label: "Feestjes", emoji: "🎨", badgeKey: null },
  { href: "/admin/kortingscodes", label: "Kortingscodes", emoji: "🏷️", badgeKey: null },
  { href: "/admin/cadeaubonnen", label: "Cadeaubonnen", emoji: "🎁", badgeKey: null },
  { href: "/admin/facturen", label: "Facturen", emoji: "🧾", badgeKey: null },
  { href: "/admin/voorraad", label: "Voorraad", emoji: "📦", badgeKey: null },
  { href: "/admin/afbeeldingen", label: "Afbeeldingen", emoji: "🖼️", badgeKey: null },
  { href: "/admin/instellingen", label: "Instellingen", emoji: "⚙️", badgeKey: null },
  { href: "/", label: "Naar website", emoji: "🌐", badgeKey: null },
] as const;

export default function AdminSidebar({
  unviewedBookings = 0,
  unviewedMessages = 0,
}: {
  unviewedBookings?: number;
  unviewedMessages?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const badgeValues: Record<string, number> = { unviewedBookings, unviewedMessages };

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/inloggen");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-col gap-1 border-b border-ink/10 bg-white p-4 print:hidden md:h-screen md:w-64 md:flex-shrink-0 md:border-b-0 md:border-r md:p-6">
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
          const badgeCount = link.badgeKey ? badgeValues[link.badgeKey] : 0;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                isActive ? "bg-mint-soft text-ink" : "text-ink-soft hover:bg-cream-soft"
              }`}
            >
              <span>{link.emoji}</span>
              <span className="flex-1">{link.label}</span>
              {badgeCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1.5 text-[11px] font-bold text-white">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink-soft hover:bg-cream-soft"
      >
        <span>🚪</span>
        Uitloggen
      </button>
    </aside>
  );
}
