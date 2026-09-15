import Link from "next/link";
import type { Workshop } from "@/lib/workshop-constants";
import { formatAgeRange, formatGroupSize, formatPrice } from "@/lib/workshop-constants";

export default function WorkshopCard({
  workshop,
  imageUrl,
}: {
  workshop: Workshop;
  imageUrl: string;
}) {
  const groupSize = formatGroupSize(workshop);

  return (
    <Link
      href={`/workshops/${workshop.slug}`}
      className="group flex flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={workshop.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="inline-flex w-fit items-center rounded-full bg-mint-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          {workshop.category}
        </span>
        <h3 className="mt-4 font-heading text-xl font-bold">{workshop.title}</h3>
        <p className="mt-2 flex-1 text-sm text-ink-soft">{workshop.shortDescription}</p>

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-ink/70">
          <span>👧 {formatAgeRange(workshop)}</span>
          {workshop.duration && <span>⏱ {workshop.duration}</span>}
          {groupSize && <span>👥 {groupSize}</span>}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-5">
          <span className="text-sm font-semibold">{formatPrice(workshop)}</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-coral">
            Bekijk workshop
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
