"use client";

import Link from "next/link";

import { Coins, Banknote, Gem } from "lucide-react";

import { PRICE_RANGES } from "@/shared/config/constants/content-pages";
import { triggerHaptic } from "@/shared/lib/bridge";

const buildPriceUrl = (minCost?: number, maxCost?: number) => {
  const urlParams = new URLSearchParams();
  urlParams.set("types", "USER,AI,YOUTUBE");

  if (minCost !== undefined) urlParams.set("minCost", String(minCost));
  if (maxCost !== undefined) urlParams.set("maxCost", String(maxCost));

  return `/search/results?${urlParams.toString()}`;
};

const PRICE_ICONS: Record<string, React.ReactNode> = {
  "under-5000": <Coins size={32} strokeWidth={1.5} className="text-amber-600" />,
  "under-10000": (
    <div className="flex -space-x-2">
      <Coins size={28} strokeWidth={1.5} className="text-slate-400" />
      <Coins size={28} strokeWidth={1.5} className="text-slate-500" />
    </div>
  ),
  "under-20000": <Banknote size={36} strokeWidth={1.5} className="text-emerald-600" />,
  premium: <Gem size={32} strokeWidth={1.5} className="text-violet-500" />,
};

const PriceRangeSection = () => {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">💰 예산별 레시피</h3>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {PRICE_RANGES.map((range) => (
          <Link
            key={range.id}
            href={buildPriceUrl(range.minCost, range.maxCost)}
            onClick={() => triggerHaptic("Light")}
            className="group flex aspect-[3/2] flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-md active:scale-[0.98]"
          >
            <div className="text-gray-700 transition-transform group-hover:scale-110">
              {PRICE_ICONS[range.id]}
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-gray-900">{range.label}</p>
              <p className="text-xs text-gray-500">{range.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PriceRangeSection;
