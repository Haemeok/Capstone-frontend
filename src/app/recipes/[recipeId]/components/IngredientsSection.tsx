"use client";

import { useMemo, useState } from "react";

import { Calculator, DollarSign } from "lucide-react";

import { formatNumber } from "@/shared/lib/format";
import PointDisplayBanner from "@/shared/ui/PointDisplayBanner";
import Box from "@/shared/ui/primitives/Box";

import { Recipe } from "@/entities/recipe/model/types";
import { calculateActivityTime, getRandomActivity } from "@/shared/lib/recipe";

type IngredientsSectionProps = {
  recipe: Recipe;
};

const IngredientsSection = ({ recipe }: IngredientsSectionProps) => {
  const [displayMode, setDisplayMode] = useState<"price" | "calories">("price");

  const randomActivity = useMemo(() => getRandomActivity(), [recipe.id]);

  const activityTime = calculateActivityTime(
    recipe.totalCalories,
    randomActivity
  );

  const displayConfig = {
    topBanner: {
      pointText:
        displayMode === "price"
          ? `${formatNumber(recipe.totalIngredientCost, "원")}`
          : `${formatNumber(Math.floor(recipe.totalCalories), "kcal")}`,
      prefix: displayMode === "price" ? "이 레시피에 약" : "이 레시피는 약",
      suffix: displayMode === "price" ? "필요해요!" : "예요!",
    },
    bottomBanner: {
      pointText:
        displayMode === "price"
          ? `${formatNumber(
              recipe.marketPrice - recipe.totalIngredientCost,
              "원"
            )}`
          : `${randomActivity.name} ${formatNumber(activityTime, "분")}`,
      prefix: displayMode === "price" ? "배달 물가 대비" : "이 칼로리는",
      suffix: displayMode === "price" ? "절약해요!" : "으로 소모 가능해요!",
      textClassName: "text-purple-500",
    },
  };

  return (
    <Box className="flex flex-col gap-2">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-bold">재료</h2>
        <button
          onClick={() =>
            setDisplayMode(displayMode === "price" ? "calories" : "price")
          }
          className="flex items-center gap-1 text-sm rounded-lg border border-gray-200  cursor-pointer p-2"
        >
          {displayMode === "calories" ? (
            <>
              <Calculator className="h-4 w-4 text-slate-500" />
              <p className="text-sm text-slate-500">칼로리</p>
            </>
          ) : (
            <>
              <DollarSign className="h-4 w-4 text-slate-500" />
              <p className="text-sm text-slate-500">가격</p>
            </>
          )}
        </button>
      </div>

      <PointDisplayBanner
        pointText={displayConfig.topBanner.pointText}
        prefix={displayConfig.topBanner.prefix}
        suffix={displayConfig.topBanner.suffix}
        triggerAnimation={displayMode}
      />

      <ul className="flex flex-col gap-1">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className="grid grid-cols-3 gap-4">
            <p className="text-left font-bold">{ingredient.name}</p>
            <p className="text-left">
              {ingredient.quantity}
              {ingredient.quantity !== "약간" && ingredient.unit}
            </p>
            <p className="text-left text-sm text-slate-500">
              {displayMode === "price"
                ? `${formatNumber(ingredient.price || 0, "원")}`
                : `${formatNumber(ingredient.calories, "kcal")}`}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-2 text-center">
        <PointDisplayBanner
          pointText={displayConfig.bottomBanner.pointText}
          prefix={displayConfig.bottomBanner.prefix}
          suffix={displayConfig.bottomBanner.suffix}
          containerClassName="flex items-center border-0 text-gray-400 p-0 font-bold"
          textClassName={displayConfig.bottomBanner.textClassName}
          triggerAnimation={displayMode}
        />
      </div>
    </Box>
  );
};

export default IngredientsSection;
