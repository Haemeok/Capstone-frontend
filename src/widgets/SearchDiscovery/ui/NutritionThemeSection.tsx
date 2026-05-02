"use client";

import Link from "next/link";

import {
  ICON_BASE_URL,
  NUTRITION_THEMES,
  NutritionThemeKey,
} from "@/shared/config/constants/recipe";
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
  const themeKeys = Object.keys(NUTRITION_THEMES) as NutritionThemeKey[];

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">
        오늘은 어떤 한 끼가 끌려요?
      </h3>

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
                  alt={theme.label}
                  wrapperClassName="w-8 h-8"
                  lazy={false}
                />
              </div>
              <span className="whitespace-nowrap text-sm font-medium text-gray-900">
                {theme.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default NutritionThemeSection;
