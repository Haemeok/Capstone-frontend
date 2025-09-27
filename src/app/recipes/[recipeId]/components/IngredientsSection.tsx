"use client";

import { useState } from "react";

import { Calculator, DollarSign } from "lucide-react";

import { formatPrice } from "@/shared/lib/format";
import PointDisplayBanner from "@/shared/ui/PointDisplayBanner";
import Box from "@/shared/ui/primitives/Box";
import { Button } from "@/shared/ui/shadcn/button";

import { Recipe } from "@/entities/recipe/model/types";

type IngredientsSectionProps = {
  recipe: Recipe;
};

const IngredientsSection = ({ recipe }: IngredientsSectionProps) => {
  const [displayMode, setDisplayMode] = useState<"price" | "calories">("price");

  const displayConfig = {
    topBanner: {
      pointText:
        displayMode === "price"
          ? `${formatPrice(recipe.totalIngredientCost, "원")}`
          : `${recipe.totalCalories}칼로리`,
      prefix: displayMode === "price" ? "이 레시피에 약" : "이 레시피는 약",
      suffix: displayMode === "price" ? "필요해요!" : "에요!",
    },
    bottomBanner: {
      pointText:
        displayMode === "price"
          ? `${formatPrice(
              recipe.marketPrice - recipe.totalIngredientCost,
              "원"
            )}`
          : `달리기 ${Math.round(recipe.totalCalories / 10)}분`,
      prefix: displayMode === "price" ? "배달 물가 대비" : "이 칼로리는",
      suffix: displayMode === "price" ? "절약해요!" : "으로 소모 가능해요!",
      textClassName: "text-purple-500",
    },
  };

  return (
    <Box className="flex flex-col gap-2">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-bold">재료</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setDisplayMode(displayMode === "price" ? "calories" : "price")
          }
          className="flex items-center gap-1 text-sm cursor-pointer"
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
        </Button>
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
              {ingredient.unit}
            </p>
            <p className="text-left text-sm text-slate-500">
              {displayMode === "price"
                ? `${formatPrice(ingredient.price || 0, "원")}`
                : `${formatPrice(ingredient.calories, "kcal")}`}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-2" style={{ minHeight: "40px" }}>
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
