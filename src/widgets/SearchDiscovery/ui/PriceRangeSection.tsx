"use client";

import Link from "next/link";

import { Banknote, Coins, Gem } from "lucide-react";

import { PRICE_RANGES } from "@/entities/recipe/lib/content-pages";
import { triggerHaptic } from "@/shared/lib/bridge";
import { buildSearchResultsUrl } from "@/shared/lib/search/buildSearchResultsUrl";

const PRICE_ICONS: Record<string, React.ReactNode> = {
  "under-5000": (
    <Coins size={32} strokeWidth={1.5} className="text-amber-600" />
  ),
  "under-10000": (
    <div className="flex -space-x-2">
      <Coins size={28} strokeWidth={1.5} className="text-gray-400" />
      <Coins size={28} strokeWidth={1.5} className="text-ink-muted" />
    </div>
  ),
  "under-20000": (
    <Banknote size={36} strokeWidth={1.5} className="text-emerald-600" />
  ),
  premium: <Gem size={32} strokeWidth={1.5} className="text-violet-500" />,
};

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
            <div className="text-ink-sub transition-transform group-hover:scale-110">
              {PRICE_ICONS[range.id]}
            </div>
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
