import AccountNav from "@/components/AccountNav";

export default function AccountShell({
  name,
  title,
  subtitle,
  children,
}: {
  name: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-gradient-to-b from-lavender-soft/40 to-transparent">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold shadow-sm sm:text-sm">
            👋 Hoi {name.split(" ")[0]}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          <div className="min-w-0 lg:sticky lg:top-6 lg:self-start">
            <AccountNav />
          </div>

          <div className="min-w-0">
            <div className="mb-6">
              <h1 className="font-heading text-2xl font-extrabold sm:text-3xl">{title}</h1>
              {subtitle && <p className="mt-2 text-ink-soft">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
