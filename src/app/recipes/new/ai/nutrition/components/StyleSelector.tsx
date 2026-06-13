"use client";

import { useT } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image";

import { NUTRITION_STYLE_ITEMS } from "../constants";

type StyleSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

const StyleSelector = ({ value, onChange }: StyleSelectorProps) => {
  const t = useT();
  const n = t.aiRecipe.nutrition;

  const handleChange = (newValue: string) => {
    if (value !== newValue) {
      triggerHaptic("Light");
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-ink-sub block text-sm font-bold">
        {n.cookingStyleLabel}
      </label>
      <div className="grid grid-cols-3 gap-3">
        {NUTRITION_STYLE_ITEMS.map((item) => {
          const isSelected = value === item.value;
          const styleDict = n.styles[item.value];

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => handleChange(item.value)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                isSelected
                  ? "border-olive-light bg-olive-light/10 shadow-[0_0_0_3px_rgba(145,199,136,0.2)]"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Image
                src={item.image}
                alt={styleDict.label}
                wrapperClassName="w-12 h-12"
              />
              <span
                className={`text-sm font-bold text-pretty break-keep ${
                  isSelected ? "text-olive-light" : "text-ink-sub"
                }`}
              >
                {styleDict.label}
              </span>
              <span className="text-ink-muted text-xs text-pretty break-keep">
                {styleDict.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StyleSelector;
