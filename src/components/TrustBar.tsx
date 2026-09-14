const items = ["Creatief", "Persoonlijk", "Compleet verzorgd", "Transparante prijzen"];

export default function TrustBar() {
  return (
    <section className="border-y border-ink/5 bg-white/50">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-6 text-sm font-semibold text-ink/70 sm:px-8">
        {items.map((item, i) => (
          <span key={item} className="flex items-center gap-2">
            {i > 0 && <span className="hidden text-ink/20 sm:inline">•</span>}
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
