import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: "Admin inloggen",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminInloggenPage() {
  if (await isAdminAuthenticated()) redirect("/admin");

  return (
    <section className="mx-auto max-w-md px-5 py-14 sm:px-8 sm:py-20">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-mint-soft px-4 py-2 text-sm font-semibold">
          🔒 Team-omgeving
        </span>
        <h1 className="mt-6 font-heading text-3xl font-extrabold">Admin inloggen</h1>
        <p className="mt-3 text-ink-soft">Alleen voor Rosa &amp; Charlotte.</p>
      </div>

      <div className="mt-8 rounded-[2.5rem] bg-white p-8 shadow-sm">
        <AdminLoginForm />
      </div>
    </section>
  );
}
