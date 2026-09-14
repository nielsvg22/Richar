import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/session";
import AccountShell from "@/components/AccountShell";
import AccountProfileCard from "@/components/AccountProfileCard";

export const metadata: Metadata = {
  title: "Mijn gegevens",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function GegevensPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/inloggen");

  return (
    <AccountShell
      name={customer.name}
      title="Mijn gegevens"
      subtitle="Bekijk en beheer je persoonlijke gegevens."
    >
      <AccountProfileCard
        name={customer.name}
        email={customer.email}
        phone={customer.phone ?? ""}
        memberSince={new Date(customer.createdAt).toLocaleDateString("nl-NL", {
          month: "long",
          year: "numeric",
        })}
      />
    </AccountShell>
  );
}
