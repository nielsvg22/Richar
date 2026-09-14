"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/feestjes", label: "Feestjes" },
  { href: "/prijzen", label: "Prijzen" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="Rosa & Charlotte Kinderfeestjes"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
            priority
          />
          <span className="font-heading text-lg font-extrabold tracking-tight">
            Rosa &amp; Charlotte
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[15px] font-medium transition-colors hover:text-coral ${
                pathname === link.href ? "text-coral" : "text-ink/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/account"
            aria-label="Mijn account"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 text-lg hover:bg-mint-soft"
          >
            👤
          </Link>
          <Link
            href="/boeken"
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5 hover:bg-coral"
          >
            Boek jouw feestje
          </Link>
        </div>

        <button
          aria-label="Menu openen"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 md:hidden"
        >
          <span className="text-xl">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/5 bg-cream px-5 pb-6 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-3 text-base font-medium ${
                  pathname === link.href ? "bg-pink-soft text-ink" : "text-ink/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-base font-medium text-ink/80"
            >
              👤 Mijn account
            </Link>
            <Link
              href="/boeken"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-ink px-6 py-3 text-center text-sm font-semibold text-cream"
            >
              Boek jouw feestje
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
