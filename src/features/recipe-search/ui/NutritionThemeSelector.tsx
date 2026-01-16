"use client";

import { Button } from "@/shared/ui/shadcn/button";
import { Image } from "@/shared/ui/image/Image";
import {
  NUTRITION_THEMES,
  NutritionThemeKey,
  ICON_BASE_URL,
} from "@/shared/config/constants/recipe";
import { getTypedEntries } from "@/shared/lib/types/utils";

type NutritionThemeSelectorProps = {
  selectedTheme: NutritionThemeKey | null;
  onThemeSelect: (themeKey: NutritionThemeKey) => void;
};

export const NutritionThemeSelector = ({
  selectedTheme,
  onThemeSelect,
}: NutritionThemeSelectorProps) => {
  return (
    <div className="space-y-3">
      <h5 className="text-sm font-semibold text-gray-700">식단 테마</h5>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {getTypedEntries(NUTRITION_THEMES).map(([themeKey, theme]) => {
          const isSelected = selectedTheme === themeKey;

          return (
            <Button
              key={themeKey}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onThemeSelect(themeKey)}
              className={
                isSelected
                  ? "bg-olive-light hover:bg-olive-dark text-white"
                  : "hover:bg-gray-50"
              }
            >
              <div className="flex items-center gap-2">
                <Image
                  src={`${ICON_BASE_URL}${theme.icon}`}
                  alt={theme.label}
                  wrapperClassName="w-4 h-4"
                  lazy={false}
                />
                <span>{theme.label}</span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
