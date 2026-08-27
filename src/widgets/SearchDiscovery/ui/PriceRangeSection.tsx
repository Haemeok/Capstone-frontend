"use client";

import Link from "next/link";

import { triggerHaptic } from "@/shared/lib/bridge";
import { buildSearchResultsUrl } from "@/shared/lib/search/buildSearchResultsUrl";
import { Image } from "@/shared/ui/image/Image";

import { PRICE_RANGES } from "@/entities/recipe/lib/content-pages";

const PriceRangeSection = () => {
  return (
    <section className="space-y-4">
      <h3 className="text-ink text-lg font-bold">
        지갑은 가볍게, 식탁은 든든하게
      </h3>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {PRICE_RANGES.map((range) => (
          <Link
            key={range.id}
            href={buildSearchResultsUrl({
              minCost: range.minCost,
              maxCost: range.maxCost,
            })}
            onClick={() => triggerHaptic("Light")}
            className="group flex aspect-[3/2] flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-md active:scale-[0.98]"
          >
            <Image
              src={range.imageUrl}
              alt={range.label}
              width={80}
              height={80}
              fit="contain"
              wrapperClassName="h-20 w-20 bg-transparent"
              skeletonClassName="bg-transparent"
              imgClassName="transition-transform group-hover:scale-105"
            />
            <div className="text-center">
              <p className="text-ink text-base font-bold">{range.label}</p>
              <p className="text-ink-muted text-xs">{range.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PriceRangeSection;
