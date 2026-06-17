"use client";

import {
  BUDGET_MAX,
  BUDGET_MIN,
  BUDGET_STEP,
} from "@/shared/config/constants/budget";
import { useT } from "@/shared/i18n";
import { Slider } from "@/shared/ui/shadcn/slider";

type PriceSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

const PriceSlider = ({ value, onChange }: PriceSliderProps) => {
  const t = useT();

  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <p className="text-ink-sub text-sm font-medium">
          {t.aiRecipe.price.budgetLabel}
        </p>
        <div className="text-olive-light text-5xl font-black transition-all duration-300">
          {/* i18n-ignore: 가격 미국제화(ko 전용), 국제화 시 제거 */}
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
        <div className="text-ink-muted mt-3 flex justify-between text-xs font-medium">
          {/* i18n-ignore: 가격 미국제화(ko 전용), 국제화 시 제거 */}
          <span>{BUDGET_MIN.toLocaleString()}원</span>
          {/* i18n-ignore: 가격 미국제화(ko 전용), 국제화 시 제거 */}
          <span>{BUDGET_MAX.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
};

export default PriceSlider;
