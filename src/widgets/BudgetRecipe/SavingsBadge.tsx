"use client";

import { calculateMonthlySavings } from "@/shared/lib/budget/calculations";
import { TrendingDownIcon } from "@/shared/ui/icons";
import CountUp from "@/shared/ui/shadcn/CountUp";

type SavingsBadgeProps = {
  budget: number;
};

const SavingsBadge = ({ budget }: SavingsBadgeProps) => {
  const monthlySavings = calculateMonthlySavings(budget);

  if (monthlySavings <= 0) {
    return null;
  }

  return (
    <div className="from-olive-light/20 to-olive-mint/20 relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 shadow-md">
      <div className="absolute top-4 right-4 opacity-10">
        <TrendingDownIcon className="h-16 w-16" />
      </div>

      <div className="relative flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
          <span className="text-2xl">💸</span>
        </div>

        <div className="flex-1">
          <p className="text-ink-sub text-sm font-medium">이번 달 절약 가능</p>
          <div className="flex items-baseline gap-1">
            <span className="text-olive text-3xl font-black">
              <CountUp
                to={Math.floor(monthlySavings / 10000)}
                from={0}
                duration={0.8}
                separator=","
              />
              만 원
            </span>
            <span className="text-ink-sub text-sm">절약 중!</span>
          </div>
        </div>
      </div>

      <div className="text-ink-sub mt-3 text-xs">
        매일 한 끼씩 실천하면 달성할 수 있어요
      </div>
    </div>
  );
};

export default SavingsBadge;
