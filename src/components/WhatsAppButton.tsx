"use client";

import { usePathname } from "next/navigation";

const PHONE = "31612345678";
const DEFAULT_MESSAGE =
  "Hoi Rosa & Charlotte! Ik heb een vraag over een kinderfeestje.";

export default function WhatsAppButton({
  message = DEFAULT_MESSAGE,
  variant = "floating",
}: {
  message?: string;
  variant?: "floating" | "inline";
}) {
  const pathname = usePathname();
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

  if (variant === "inline") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 rounded-2xl bg-white p-5 hover:bg-mint-soft"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mint-soft text-lg">
          💬
        </span>
        <div>
          <p className="text-sm text-ink-soft">WhatsApp</p>
          <p className="font-semibold">Stuur ons een appje</p>
        </div>
      </a>
    );
  }

  if (pathname?.startsWith("/admin")) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Stuur ons een WhatsApp bericht"
      className="fixed bottom-20 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg transition-transform hover:-translate-y-0.5 md:bottom-6"
    >
      💬
    </a>
  );
}
