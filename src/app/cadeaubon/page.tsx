import type { Metadata } from "next";
import VoucherPurchaseForm from "@/components/VoucherPurchaseForm";

export const metadata: Metadata = {
  title: "Cadeaubon kopen",
  description:
    "Geef een kinderfeestje cadeau! Koop een cadeaubon van Rosa & Charlotte Kinderfeestjes, in te wisselen bij het boeken van een feestje.",
};

export default function CadeaubonPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-soft px-4 py-2 text-sm font-semibold">
          🎁 Cadeaubon
        </span>
        <h1 className="mt-6 font-heading text-4xl font-extrabold sm:text-5xl">
          Geef een feestje cadeau
        </h1>
        <p className="mt-4 text-ink-soft">
          Het perfecte cadeau voor een verjaardag: een cadeaubon die in te
          wisselen is bij het boeken van een kinderfeestje. Je ontvangt de
          code direct per e-mail.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-lg rounded-[2.5rem] bg-white p-8 shadow-sm sm:p-10">
        <VoucherPurchaseForm />
      </div>
    </section>
  );
}
