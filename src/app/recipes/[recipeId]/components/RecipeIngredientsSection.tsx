"use client";

import { useMemo, useState } from "react";

import { ShoppingBasketIcon } from "lucide-react";

import { formatNumber } from "@/shared/lib/format";
import { convertIngredientQuantity } from "@/shared/lib/ingredientConversion";
import PointDisplayBanner from "@/shared/ui/PointDisplayBanner";
import { calculateActivityTime, getRandomActivity } from "@/shared/lib/recipe";

import { Recipe, StaticRecipe } from "@/entities/recipe/model/types";

import NutritionToggle from "./NutritionToggle";
import NutritionTable from "./NutritionTable";
import Link from "next/link";

type IngredientsSectionProps = {
  recipe: Recipe | StaticRecipe;
};

const IngredientsSection = ({ recipe }: IngredientsSectionProps) => {
  const [showNutrition, setShowNutrition] = useState(false);

  const isValidServings = recipe.servings > 0 && Number.isFinite(recipe.servings);
  const [currentServings, setCurrentServings] = useState(
    isValidServings ? recipe.servings : 1
  );

  const randomActivity = useMemo(() => getRandomActivity(), [recipe.id]);

  const servingRatio = isValidServings ? currentServings / recipe.servings : 1;

  const MIN_SERVINGS = 1;
  const MAX_SERVINGS = 20;

  const handleIncrement = () => {
    if (currentServings < MAX_SERVINGS) {
      setCurrentServings((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (currentServings > MIN_SERVINGS) {
      setCurrentServings((prev) => prev - 1);
    }
  };

  const scaledCalories = Math.floor(recipe.totalCalories * servingRatio);
  const scaledIngredientCost = Math.round(
    recipe.totalIngredientCost * servingRatio
  );
  const scaledMarketPrice = Math.round(recipe.marketPrice * servingRatio);
  const scaledActivityTime = calculateActivityTime(
    scaledCalories,
    randomActivity
  );

  const displayConfig = {
    topBanner: {
      pointText: showNutrition
        ? `${formatNumber(scaledCalories, "kcal")}`
        : `${formatNumber(scaledIngredientCost, "원")}`,
      prefix: showNutrition ? "이 레시피는 약" : "이 레시피에 약",
      suffix: showNutrition ? "예요!" : "필요해요!",
    },
    bottomBanner: {
      pointText: showNutrition
        ? `${randomActivity.name} ${formatNumber(scaledActivityTime, "분")}`
        : `${formatNumber(scaledMarketPrice - scaledIngredientCost, "원")}`,
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
      />

      <div>
        {showNutrition ? (
          <NutritionTable
            totalServings={recipe.servings}
            currentServings={currentServings}
            onServingsChange={setCurrentServings}
            nutrition={recipe.nutrition}
          />
        ) : (
          <>
            {isValidServings && (
              <div className="mb-3 flex items-center justify-end gap-2">
                <span className="text-sm text-gray-600">인분</span>
                <div className="flex items-center gap-1">
                  {currentServings > MIN_SERVINGS && (
                    <button
                      type="button"
                      onClick={handleDecrement}
                      aria-label="인분 줄이기"
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-600 transition-colors cursor-pointer hover:bg-gray-300"
                    >
                      -
                    </button>
                  )}
                  <span className="w-10 text-center text-sm font-medium text-gray-800">
                    {currentServings}
                  </span>
                  {currentServings < MAX_SERVINGS && (
                    <button
                      type="button"
                      onClick={handleIncrement}
                      aria-label="인분 늘리기"
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-600 transition-colors cursor-pointer hover:bg-gray-300"
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            )}
            <ul className="flex flex-col gap-1">
              {recipe.ingredients.map((ingredient, index) => {
                const converted = convertIngredientQuantity(
                  ingredient.quantity,
                  ingredient.unit,
                  servingRatio
                );

                return (
                  <li
                    key={index}
                    className="grid grid-cols-[1.5fr_1.5fr_1fr_32px] items-center gap-3"
                  >
                    <p className="text-left font-bold">{ingredient.name}</p>

                    <p className="text-left whitespace-nowrap">
                      {converted.quantity}
                      {converted.quantity !== "약간" && converted.unit}
                    </p>

                    <p className="text-right text-sm text-slate-500">
                      {formatNumber(
                        Math.round((ingredient.price || 0) * servingRatio),
                        "원"
                      )}
                    </p>

                    <div className="flex items-center justify-center">
                      {ingredient.coupangLink ? (
                        <Link
                          href={ingredient.coupangLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="rounded-md border border-gray-400 p-[2px]">
                            <ShoppingBasketIcon
                              className="text-gray-400"
                              size={20}
                            />
                          </div>
                        </Link>
                      ) : (
                        <div className="w-6" />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      <div className="mt-2 text-center">
        <PointDisplayBanner
          pointText={displayConfig.bottomBanner.pointText}
          prefix={displayConfig.bottomBanner.prefix}
          suffix={displayConfig.bottomBanner.suffix}
          containerClassName="flex items-center border-0 text-gray-400 p-0 font-bold"
          textClassName={displayConfig.bottomBanner.textClassName}
        />
      </div>
    </div>
  );
};

export default IngredientsSection;
