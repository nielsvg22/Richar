"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { locations } from "@/lib/locations";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-ink/5 bg-cream-soft">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/logo.png"
                alt="Rosa & Charlotte Kinderfeestjes"
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
              <span className="font-heading text-base font-extrabold">
                Rosa &amp; Charlotte
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-ink-soft">
              Jij geniet van de verjaardag. Wij regelen het feestje. Creatieve
              kinderfeestjes, compleet verzorgd.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-ink/60">
              Ontdek
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/feestjes" className="hover:text-coral">
                  Alle feestjes
                </Link>
              </li>
              <li>
                <Link href="/prijzen" className="hover:text-coral">
                  Prijzen
                </Link>
              </li>
              <li>
                <Link href="/over-ons" className="hover:text-coral">
                  Over Rosa &amp; Charlotte
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-coral">
                  Veelgestelde vragen
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-coral">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-ink/60">
              Boeken
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/boeken" className="hover:text-coral">
                  Boek jouw feestje
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-coral">
                  Vraag beschikbaarheid
                </Link>
              </li>
              <li>
                <Link href="/cadeaubon" className="hover:text-coral">
                  Cadeaubon kopen
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-coral">
                  Inloggen (team)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-ink/60">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li>hallo@rosaencharlotte.nl</li>
              <li>06 - 123 456 78</li>
              <li>Actief in Apeldoorn, Deventer, Arnhem en omstreken</li>
            </ul>

            <h3 className="mt-6 font-heading text-sm font-bold uppercase tracking-wide text-ink/60">
              Kinderfeestje in
            </h3>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {locations.map((loc) => (
                <li key={loc.slug}>
                  <Link href={`/kinderfeestje/${loc.slug}`} className="hover:text-coral">
                    {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink/10 pt-6 text-xs text-ink-soft sm:flex-row">
          <p>© {new Date().getFullYear()} Rosa &amp; Charlotte Kinderfeestjes. Alle rechten voorbehouden.</p>
          <p>Creatief • Persoonlijk • Compleet verzorgd</p>
        </div>
      </div>
    </footer>
  );
}
