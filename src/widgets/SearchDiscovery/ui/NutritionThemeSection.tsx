"use client";

import Link from "next/link";

import {
  ICON_BASE_URL,
  NUTRITION_THEMES,
  NutritionThemeKey,
} from "@/shared/config/constants/recipe";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";

const buildNutritionUrl = (themeKey: NutritionThemeKey) => {
  const theme = NUTRITION_THEMES[themeKey];
  const urlParams = new URLSearchParams();
  urlParams.set("types", "USER,AI,YOUTUBE");

  const { values } = theme;

  if ("carb" in values) {
    urlParams.set("minCarb", String(values.carb[0]));
    urlParams.set("maxCarb", String(values.carb[1]));
  }
  if ("protein" in values) {
    urlParams.set("minProtein", String(values.protein[0]));
    urlParams.set("maxProtein", String(values.protein[1]));
  }
  if ("fat" in values) {
    urlParams.set("minFat", String(values.fat[0]));
    urlParams.set("maxFat", String(values.fat[1]));
  }
  if ("sugar" in values) {
    urlParams.set("minSugar", String(values.sugar[0]));
    urlParams.set("maxSugar", String(values.sugar[1]));
  }
  if ("sodium" in values) {
    urlParams.set("minSodium", String(values.sodium[0]));
    urlParams.set("maxSodium", String(values.sodium[1]));
  }
  if ("calories" in values) {
    urlParams.set("minCalories", String(values.calories[0]));
    urlParams.set("maxCalories", String(values.calories[1]));
  }
  if ("cost" in values) {
    urlParams.set("minCost", String(values.cost[0]));
    urlParams.set("maxCost", String(values.cost[1]));
  }

  return `/search/results?${urlParams.toString()}`;
};

const NutritionThemeSection = () => {
  const themeKeys = Object.keys(NUTRITION_THEMES) as NutritionThemeKey[];

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">💪 목표별 레시피</h3>

      <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4">
        {themeKeys.map((key) => {
          const theme = NUTRITION_THEMES[key];
          return (
            <Link
              key={key}
              href={buildNutritionUrl(key)}
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
