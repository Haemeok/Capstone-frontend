"use client";

import { Control, Controller } from "react-hook-form";

import { Slider } from "@/shared/ui/shadcn/slider";

import { getGuidanceMessage, NutritionFormValues } from "../constants";

type MacroSliderProps = {
  control: Control<NutritionFormValues>;
  name: keyof Pick<
    NutritionFormValues,
    "targetCalories" | "targetCarbs" | "targetProtein" | "targetFat"
  >;
  label: string;
  unit: string;
  max: number;
  step: number;
  defaultValue: string;
};

const MacroSlider = ({
  control,
  name,
  label,
  unit,
  max,
  step,
  defaultValue,
}: MacroSliderProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const isUnlimited = field.value === "제한 없음";
        const sliderValue = isUnlimited ? 0 : Number(field.value) || 0;

        const handleSliderChange = (vals: number[]) => {
          field.onChange(vals[0].toString());
        };

        const guidance = !isUnlimited
          ? getGuidanceMessage(name, sliderValue)
          : "";

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-700">{label}</label>
              <div className="flex items-center gap-3">
                {!isUnlimited && (
                  <span className="text-olive-light font-mono text-lg font-bold">
                    {sliderValue}
                    {unit}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium transition-colors ${
                      isUnlimited ? "text-gray-400" : "text-olive-light"
                    }`}
                  >
                    지정
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      field.onChange(isUnlimited ? defaultValue : "제한 없음")
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isUnlimited ? "bg-olive-light" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                        isUnlimited ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-xs font-medium transition-colors ${
                      isUnlimited ? "text-olive-light" : "text-gray-400"
                    }`}
                  >
                    자동
                  </span>
                </div>
              </div>
            </div>

            <div
              className={isUnlimited ? "pointer-events-none opacity-30" : ""}
            >
              <Slider
                min={0}
                max={max}
                step={step}
                value={[sliderValue]}
                onValueChange={handleSliderChange}
                disabled={isUnlimited}
              />
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>0{unit}</span>
                <span>
                  {max}
                  {unit}
                </span>
              </div>

              {guidance && (
                <div className="animate-in fade-in slide-in-from-top-1 mt-3 flex justify-center">
                  <span className="inline-block rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-bold text-gray-600">
                    {guidance}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

export default MacroSlider;
