import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Account aanmaken",
  robots: { index: false, follow: false },
};

export default function RegistrerenPage() {
  return (
    <section className="mx-auto max-w-md px-5 py-14 sm:px-8 sm:py-20">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-mint-soft px-4 py-2 text-sm font-semibold">
          👤 Mijn account
        </span>
        <h1 className="mt-6 font-heading text-3xl font-extrabold">Account aanmaken</h1>
        <p className="mt-3 text-ink-soft">
          Maak een account aan om je boekingen te bekijken en te volgen.
        </p>
      </div>

      <div className="mt-8 rounded-[2.5rem] bg-white p-8 shadow-sm">
        <Suspense fallback={<div className="text-center text-ink-soft">Laden...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </section>
  );
}
