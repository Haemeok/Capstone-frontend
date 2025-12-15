"use client";

import { TrendingDown, Sparkles } from "lucide-react";
import { Slider } from "@/shared/ui/shadcn/slider";
import {
  BUDGET_MIN,
  BUDGET_MAX,
  BUDGET_STEP,
  AVERAGE_MEAL_PRICE,
} from "@/shared/config/constants/budget";
import {
  calculateSavings,
  calculateMonthlySavings,
} from "@/shared/lib/budget/calculations";

type PriceSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

const PriceSlider = ({ value, onChange }: PriceSliderProps) => {
  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  const savings = calculateSavings(value);
  const monthlySavings = calculateMonthlySavings(value);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium text-gray-600">목표 예산</p>
        <div className="text-4xl font-bold text-purple-500">
          {value.toLocaleString()}원
        </div>
      </div>

      <div className="px-4">
        <Slider
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={[value]}
          onValueChange={handleValueChange}
          className="[&>*[data-slot=slider-track]]:bg-olive-light [&>*[data-slot=slider-range]]:bg-olive-medium [&>*[data-slot=slider-thumb]]:border-olive-medium [&>*[data-slot=slider-thumb]]:bg-white"
        />
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>{BUDGET_MIN.toLocaleString()}원</span>
          <span>{BUDGET_MAX.toLocaleString()}원</span>
        </div>
      </div>

      <div className="space-y-3">
        {savings <= 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-600">
              직장인 평균 한끼 예산({AVERAGE_MEAL_PRICE.toLocaleString()}원)이에요
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-olive-light bg-olive-light/10 p-4">
              <TrendingDown className="h-5 w-5 text-olive-medium" />
              <p className="text-sm font-medium text-gray-800">
                직장인 평균 한끼보다{" "}
                <span className="font-bold text-olive-medium">
                  {savings.toLocaleString()}원
                </span>{" "}
                절약해요!
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-olive-mint bg-gradient-to-r from-olive-light to-olive-mint p-4 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
              <p className="text-sm font-bold">
                매일 이렇게 드시면 한 달에{" "}
                {Math.floor(monthlySavings / 10000)}만 원 아껴요!
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PriceSlider;
