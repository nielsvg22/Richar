"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/admin", label: "Dashboard", emoji: "📊", badgeKey: "unviewedBookings" },
  { href: "/admin/agenda", label: "Agenda", emoji: "🗓️", badgeKey: null },
  { href: "/admin/berichten", label: "Berichten", emoji: "📨", badgeKey: "unviewedMessages" },
  { href: "/admin/feestjes", label: "Feestjes", emoji: "🎨", badgeKey: null },
  { href: "/admin/workshops", label: "Workshops", emoji: "🖌️", badgeKey: null },
  { href: "/admin/webshop", label: "Webshop", emoji: "🛍️", badgeKey: null },
  { href: "/admin/bestellingen", label: "Bestellingen", emoji: "📦", badgeKey: null },
  { href: "/admin/kortingscodes", label: "Kortingscodes", emoji: "🏷️", badgeKey: null },
  { href: "/admin/cadeaubonnen", label: "Cadeaubonnen", emoji: "🎁", badgeKey: null },
  { href: "/admin/facturen", label: "Facturen", emoji: "🧾", badgeKey: null },
  { href: "/admin/voorraad", label: "Voorraad", emoji: "📦", badgeKey: null },
  { href: "/admin/afbeeldingen", label: "Afbeeldingen", emoji: "🖼️", badgeKey: null },
  { href: "/admin/content", label: "Teksten", emoji: "✏️", badgeKey: null },
  { href: "/admin/instellingen", label: "Instellingen", emoji: "⚙️", badgeKey: null },
  { href: "/", label: "Naar website", emoji: "🌐", badgeKey: null },
] as const;

function NavLinks({
  pathname,
  badgeValues,
  onNavigate,
}: {
  pathname: string | null;
  badgeValues: Record<string, number>;
  onNavigate?: () => void;
}) {
  return (
    <>
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
            onClick={onNavigate}
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
    </>
  );
}

export default function AdminSidebar({
  unviewedBookings = 0,
  unviewedMessages = 0,
}: {
  unviewedBookings?: number;
  unviewedMessages?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const badgeValues: Record<string, number> = { unviewedBookings, unviewedMessages };
  const totalBadges = unviewedBookings + unviewedMessages;

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/inloggen");
    router.refresh();
  }

  return (
    <aside className="w-full border-b border-ink/10 bg-white print:hidden md:h-screen md:w-64 md:flex-shrink-0 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between p-4 md:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-base blob">
            🎉
          </span>
          <span className="font-heading text-sm font-extrabold">Rosa &amp; Charlotte</span>
        </div>
        <button
          type="button"
          aria-label="Menu openen"
          onClick={() => setOpen((v) => !v)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-ink/5"
        >
          <span className="text-xl">{open ? "✕" : "☰"}</span>
          {!open && totalBadges > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[11px] font-bold text-white">
              {totalBadges}
            </span>
          )}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-ink/10 p-4 md:hidden">
          <NavLinks pathname={pathname} badgeValues={badgeValues} onNavigate={() => setOpen(false)} />
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink-soft hover:bg-cream-soft"
          >
            <span>🚪</span>
            Uitloggen
          </button>
        </nav>
      )}

      <div className="hidden flex-col gap-1 p-6 md:flex md:h-full">
        <div className="mb-4 flex items-center gap-2 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-base blob">
            🎉
          </span>
          <span className="font-heading text-sm font-extrabold">
            Rosa &amp; Charlotte
          </span>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLinks pathname={pathname} badgeValues={badgeValues} />
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink-soft hover:bg-cream-soft"
        >
          <span>🚪</span>
          Uitloggen
        </button>
      </div>
    </aside>
  );
}
