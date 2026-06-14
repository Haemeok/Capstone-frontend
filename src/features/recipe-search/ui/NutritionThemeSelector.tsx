"use client";

import {
  ICON_BASE_URL,
  NUTRITION_THEMES,
  NutritionThemeKey,
} from "@/shared/config/constants/recipe";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { getTypedEntries } from "@/shared/lib/types/utils";
import { Image } from "@/shared/ui/image/Image";
import { Button } from "@/shared/ui/shadcn/button";

type NutritionThemeSelectorProps = {
  selectedTheme: NutritionThemeKey | null;
  onThemeSelect: (themeKey: NutritionThemeKey) => void;
};

export const NutritionThemeSelector = ({
  selectedTheme,
  onThemeSelect,
}: NutritionThemeSelectorProps) => {
  const { dict, label } = useTaxonomy();

  return (
    <div className="space-y-3">
      <h5 className="text-ink-sub text-sm font-semibold">
        {dict.filters.themeSection}
      </h5>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {getTypedEntries(NUTRITION_THEMES).map(([themeKey]) => {
          const isSelected = selectedTheme === themeKey;
          const themeLabel = label(themeKey, "nutritionTheme");

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
                  src={`${ICON_BASE_URL}${NUTRITION_THEMES[themeKey].icon}`}
                  alt={themeLabel}
                  wrapperClassName="w-4 h-4"
                  lazy={false}
                />
                <span>{themeLabel}</span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
