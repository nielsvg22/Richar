import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/session";
import AccountShell from "@/components/AccountShell";
import AccountMessageForm from "@/components/AccountMessageForm";

export const metadata: Metadata = {
  title: "Berichten",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BerichtenPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/inloggen");

  return (
    <AccountShell
      name={customer.name}
      title="Berichten"
      subtitle="Vraag, wijziging of gewoon een vraag — we horen het graag."
    >
      <div className="rounded-[1.75rem] bg-white p-6 shadow-sm sm:p-8">
        <AccountMessageForm name={customer.name} email={customer.email} />
      </div>
    </AccountShell>
  );
}
