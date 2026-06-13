"use client";

import Link from "next/link";

import {
  ICON_BASE_URL,
  NUTRITION_THEMES,
  NutritionThemeKey,
} from "@/shared/config/constants/recipe";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";
import { triggerHaptic } from "@/shared/lib/bridge";
import { buildSearchResultsUrl } from "@/shared/lib/search/buildSearchResultsUrl";
import { Image } from "@/shared/ui/image/Image";

const buildNutritionHref = (themeKey: NutritionThemeKey) => {
  const { values } = NUTRITION_THEMES[themeKey];
  return buildSearchResultsUrl({
    minCarb: "carb" in values ? values.carb[0] : undefined,
    maxCarb: "carb" in values ? values.carb[1] : undefined,
    minProtein: "protein" in values ? values.protein[0] : undefined,
    maxProtein: "protein" in values ? values.protein[1] : undefined,
    minFat: "fat" in values ? values.fat[0] : undefined,
    maxFat: "fat" in values ? values.fat[1] : undefined,
    minSugar: "sugar" in values ? values.sugar[0] : undefined,
    maxSugar: "sugar" in values ? values.sugar[1] : undefined,
    minSodium: "sodium" in values ? values.sodium[0] : undefined,
    maxSodium: "sodium" in values ? values.sodium[1] : undefined,
    minCalories: "calories" in values ? values.calories[0] : undefined,
    maxCalories: "calories" in values ? values.calories[1] : undefined,
    minCost: "cost" in values ? values.cost[0] : undefined,
    maxCost: "cost" in values ? values.cost[1] : undefined,
  });
};

const NutritionThemeSection = () => {
  const t = useSearchDiscoveryDict();
  const themeKeys = Object.keys(NUTRITION_THEMES) as NutritionThemeKey[];

  return (
    <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4">
      {themeKeys.map((key) => {
        const theme = NUTRITION_THEMES[key];
        return (
          <Link
            key={key}
            href={buildNutritionHref(key)}
            onClick={() => triggerHaptic("Light")}
            className="flex w-24 shrink-0 cursor-pointer flex-col items-center gap-2 rounded-2xl bg-gray-50 p-4 active:bg-gray-100"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
              <Image
                src={`${ICON_BASE_URL}${theme.icon}`}
                alt={t.nutritionThemes[key].label}
                wrapperClassName="w-8 h-8"
                lazy={false}
              />
            </div>
            <span className="text-ink text-sm font-medium whitespace-nowrap">
              {t.nutritionThemes[key].label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default NutritionThemeSection;
