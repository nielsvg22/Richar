import Link from "next/link";
import type { MaterialChecklistEntry } from "@/lib/themeMaterials";

export default function MaterialChecklist({ items }: { items: MaterialChecklistEntry[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
        <h2 className="font-heading text-lg font-bold">Materiaalchecklist</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Nog geen materialen gekoppeld aan dit thema. Stel dit in bij{" "}
          <Link href="/admin/feestjes" className="font-semibold text-coral">
            Feestjes
          </Link>
          .
        </p>
      </div>
    );
  }

  const hasShortage = items.some((i) => !i.sufficient);

  return (
    <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold">Materiaalchecklist</h2>
        {hasShortage && (
          <span className="rounded-full bg-coral-soft px-3 py-1 text-xs font-semibold">
            ⚠️ Voorraad te laag
          </span>
        )}
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.itemId} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-3">
              <span
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs ${
                  item.sufficient ? "bg-mint-soft" : "bg-coral-soft"
                }`}
              >
                {item.sufficient ? "✓" : "!"}
              </span>
              {item.name}
            </span>
            <span className={item.sufficient ? "text-ink-soft" : "font-semibold text-coral"}>
              {item.quantityNeeded} {item.unit} nodig · {item.quantityInStock} op voorraad
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
