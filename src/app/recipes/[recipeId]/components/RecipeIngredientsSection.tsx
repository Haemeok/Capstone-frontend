"use client";

import { useMemo, useState } from "react";

import { ShoppingBasketIcon } from "lucide-react";

import { formatNumber } from "@/shared/lib/format";
import PointDisplayBanner from "@/shared/ui/PointDisplayBanner";
import { calculateActivityTime, getRandomActivity } from "@/shared/lib/recipe";

import { Recipe, StaticRecipe } from "@/entities/recipe/model/types";

import NutritionToggle from "./NutritionToggle";
import NutritionTable from "./NutritionTable";

type IngredientsSectionProps = {
  recipe: Recipe | StaticRecipe;
};

const IngredientsSection = ({ recipe }: IngredientsSectionProps) => {
  const [showNutrition, setShowNutrition] = useState(false);

  const randomActivity = useMemo(() => getRandomActivity(), [recipe.id]);

  const activityTime = calculateActivityTime(
    recipe.totalCalories,
    randomActivity
  );

  const displayConfig = {
    topBanner: {
      pointText: showNutrition
        ? `${formatNumber(Math.floor(recipe.totalCalories), "kcal")}`
        : `${formatNumber(recipe.totalIngredientCost, "원")}`,
      prefix: showNutrition ? "이 레시피는 약" : "이 레시피에 약",
      suffix: showNutrition ? "예요!" : "필요해요!",
    },
    bottomBanner: {
      pointText: showNutrition
        ? `${randomActivity.name} ${formatNumber(activityTime, "분")}`
        : `${formatNumber(
            recipe.marketPrice - recipe.totalIngredientCost,
            "원"
          )}`,
      prefix: showNutrition ? "이 칼로리는" : "배달 물가 대비",
      suffix: showNutrition ? "으로 소모 가능해요!" : "절약해요!",
      textClassName: "text-purple-500",
    },
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {showNutrition ? "영양성분" : "재료"}
        </h2>
        <NutritionToggle
          isNutrition={showNutrition}
          onToggle={setShowNutrition}
        />
      </div>

      <PointDisplayBanner
        pointText={displayConfig.topBanner.pointText}
        prefix={displayConfig.topBanner.prefix}
        suffix={displayConfig.topBanner.suffix}
        triggerAnimation={showNutrition}
      />

      <div>
        {showNutrition ? (
          <NutritionTable
            totalServings={recipe.servings}
            nutrition={recipe.nutrition}
          />
        ) : (
          <ul className="flex flex-col gap-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="grid grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-left font-bold">{ingredient.name}</p>
                </div>
                <p className="text-left">
                  {ingredient.quantity}
                  {ingredient.quantity !== "약간" && ingredient.unit}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-left text-sm text-slate-500">
                    {formatNumber(ingredient.price || 0, "원")}
                  </p>
                  {ingredient.coupangLink && (
                    <div className="rounded-md border-1 border-gray-400 p-[2px]">
                      <ShoppingBasketIcon className="text-gray-400" size={20} />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-2 text-center">
        <PointDisplayBanner
          pointText={displayConfig.bottomBanner.pointText}
          prefix={displayConfig.bottomBanner.prefix}
          suffix={displayConfig.bottomBanner.suffix}
          containerClassName="flex items-center border-0 text-gray-400 p-0 font-bold"
          textClassName={displayConfig.bottomBanner.textClassName}
          triggerAnimation={showNutrition}
        />
      </div>
    </div>
  );
};

export default IngredientsSection;
