"use client";

import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image";

import { NUTRITION_STYLES } from "../constants";

type StyleSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

const StyleSelector = ({ value, onChange }: StyleSelectorProps) => {
  const handleChange = (newValue: string) => {
    if (value !== newValue) {
      triggerHaptic("Light");
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-700">
        요리 스타일
      </label>
      <div className="grid grid-cols-3 gap-3">
        {NUTRITION_STYLES.map((style) => {
          const isSelected = value === style.value;

          return (
            <button
              key={style.value}
              type="button"
              onClick={() => handleChange(style.value)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                isSelected
                  ? "border-olive-light bg-olive-light/10 shadow-[0_0_0_3px_rgba(145,199,136,0.2)]"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Image
                src={style.image}
                alt={style.label}
                wrapperClassName="w-12 h-12"
              />
              <span
                className={`text-sm font-bold text-pretty break-keep ${
                  isSelected ? "text-olive-light" : "text-gray-700"
                }`}
              >
                {style.label}
              </span>
              <span className="text-xs text-pretty break-keep text-gray-500">
                {style.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StyleSelector;
