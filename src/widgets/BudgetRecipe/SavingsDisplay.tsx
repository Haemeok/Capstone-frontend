import { SparklesIcon, TrendingDownIcon } from "@/shared/ui/icons";
import {
  calculateSavings,
  calculateMonthlySavings,
} from "@/shared/lib/budget/calculations";
import { AVERAGE_MEAL_PRICE } from "@/shared/config/constants/budget";

type SavingsDisplayProps = {
  budget: number;
};

const SavingsDisplay = ({ budget }: SavingsDisplayProps) => {
  const savings = calculateSavings(budget);
  const monthlySavings = calculateMonthlySavings(budget);

  if (savings <= 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
        <p className="text-sm text-gray-600">
          직장인 평균 한끼 예산({AVERAGE_MEAL_PRICE.toLocaleString()}원)이에요
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-olive-light bg-olive-light/10 p-4">
        <TrendingDownIcon className="text-olive-medium h-5 w-5" />
        <p className="text-sm font-medium text-gray-800">
          직장인 평균 한끼보다{" "}
          <span className="text-olive-medium font-bold">
            {savings.toLocaleString()}원
          </span>{" "}
          절약해요!
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-olive-mint bg-gradient-to-r from-olive-light to-olive-mint p-4 text-white shadow-md">
        <SparklesIcon className="h-5 w-5" />
        <p className="text-sm font-bold">
          매일 이렇게 드시면 한 달에{" "}
          {Math.floor(monthlySavings / 10000)}만 원 아껴요!
        </p>
      </div>
    </div>
  );
};

export default SavingsDisplay;
