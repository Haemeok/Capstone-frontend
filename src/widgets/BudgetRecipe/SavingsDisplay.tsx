"use client";

import { AVERAGE_MEAL_PRICE } from "@/shared/config/constants/budget";
import { format, useT } from "@/shared/i18n";
import {
  calculateMonthlySavings,
  calculateSavings,
} from "@/shared/lib/budget/calculations";
import { SparklesIcon, TrendingDownIcon } from "@/shared/ui/icons";

type SavingsDisplayProps = {
  budget: number;
};

const SavingsDisplay = ({ budget }: SavingsDisplayProps) => {
  const t = useT();
  const savings = calculateSavings(budget);
  const monthlySavings = calculateMonthlySavings(budget);

  if (savings <= 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
        <p className="text-ink-sub text-sm">
          {format(t.aiRecipe.price.averageMealInfo, {
            price: AVERAGE_MEAL_PRICE.toLocaleString(),
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="border-olive-light bg-olive-light/10 flex items-center justify-center gap-2 rounded-lg border-2 p-4">
        <TrendingDownIcon className="text-olive-medium h-5 w-5" />
        <p className="text-ink text-sm font-medium">
          {format(t.aiRecipe.price.savingsMessage, {
            savings: savings.toLocaleString(),
          })}
        </p>
      </div>

      <div className="border-olive-mint from-olive-light to-olive-mint flex items-center justify-center gap-2 rounded-lg border-2 bg-gradient-to-r p-4 text-white shadow-md">
        <SparklesIcon className="h-5 w-5" />
        <p className="text-sm font-bold">
          {format(t.aiRecipe.price.monthlySavingsMessage, {
            months: Math.floor(monthlySavings / 10000),
          })}
        </p>
      </div>
    </div>
  );
};

export default SavingsDisplay;
