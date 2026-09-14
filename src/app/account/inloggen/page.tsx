import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Inloggen",
  robots: { index: false, follow: false },
};

export default function InloggenPage() {
  return (
    <section className="mx-auto max-w-md px-5 py-14 sm:px-8 sm:py-20">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-mint-soft px-4 py-2 text-sm font-semibold">
          👤 Mijn account
        </span>
        <h1 className="mt-6 font-heading text-3xl font-extrabold">Welkom terug</h1>
        <p className="mt-3 text-ink-soft">Log in om je boekingen te bekijken.</p>
      </div>

      <div className="mt-8 rounded-[2.5rem] bg-white p-8 shadow-sm">
        <LoginForm />
      </div>
    </section>
  );
}
