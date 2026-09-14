import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/session";
import AccountShell from "@/components/AccountShell";
import AccountPasswordCard from "@/components/AccountPasswordCard";

export const metadata: Metadata = {
  title: "Wachtwoord",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function WachtwoordPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/inloggen");

  return (
    <AccountShell name={customer.name} title="Wachtwoord" subtitle="Wijzig je inlogwachtwoord.">
      <AccountPasswordCard />
    </AccountShell>
  );
}
