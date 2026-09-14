"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        className ??
        "rounded-full border-2 border-ink/10 px-5 py-2.5 text-sm font-semibold hover:border-coral hover:text-coral"
      }
    >
      Uitloggen
    </button>
  );
}
