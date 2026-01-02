"use client";

import { Slider } from "@/shared/ui/shadcn/slider";
import {
  BUDGET_MIN,
  BUDGET_MAX,
  BUDGET_STEP,
} from "@/shared/config/constants/budget";

type PriceSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

const PriceSlider = ({ value, onChange }: PriceSliderProps) => {
  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <p className="text-sm font-medium text-gray-600">목표 예산</p>
        <div className="text-5xl font-black text-olive-light transition-all duration-300">
          {value.toLocaleString()}원
        </div>
      </div>

      <div className="px-2 py-4">
        <Slider
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={[value]}
          onValueChange={handleValueChange}
        />
        <div className="mt-3 flex justify-between text-xs font-medium text-gray-500">
          <span>{BUDGET_MIN.toLocaleString()}원</span>
          <span>{BUDGET_MAX.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
};

export default PriceSlider;
