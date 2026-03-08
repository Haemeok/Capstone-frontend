"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { formatNumber } from "@/shared/lib/format";
import { convertIngredientQuantity } from "@/shared/lib/ingredientConversion";
import { calculateActivityTime, getRandomActivity } from "@/shared/lib/recipe";
import PointDisplayBanner from "@/shared/ui/PointDisplayBanner";

import { Recipe, StaticRecipe } from "@/entities/recipe/model/types";

import { IngredientListItem } from "./IngredientListItem";
import { IngredientsSectionHeader } from "./IngredientsSectionHeader";
import NutritionTable from "./NutritionTable";
import { ServingsControl } from "./ServingsControl";

const IngredientReportSheet = dynamic(
  () =>
    import("./IngredientReportSheet").then((mod) => mod.IngredientReportSheet),
  { ssr: false }
);

const IngredientCopySheet = dynamic(
  () => import("./IngredientCopySheet").then((mod) => mod.IngredientCopySheet),
  { ssr: false }
);

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 20;

type IngredientsSectionProps = {
  recipe: Recipe | StaticRecipe;
};

const IngredientsSection = ({ recipe }: IngredientsSectionProps) => {
  const [showNutrition, setShowNutrition] = useState(false);
  const [isReportSheetOpen, setIsReportSheetOpen] = useState(false);
  const [isCopySheetOpen, setIsCopySheetOpen] = useState(false);

  const isValidServings = recipe.servings > 0 && Number.isFinite(recipe.servings);
  const [currentServings, setCurrentServings] = useState(
    isValidServings ? recipe.servings : 1
  );

  const randomActivity = useMemo(() => getRandomActivity(), []);
  const servingRatio = isValidServings ? currentServings / recipe.servings : 1;

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
    <div className="flex flex-col gap-2 mt-2">
      <IngredientsSectionHeader
        showNutrition={showNutrition}
        onNutritionToggle={setShowNutrition}
        onCopyOpen={() => setIsCopySheetOpen(true)}
        onReportOpen={() => setIsReportSheetOpen(true)}
      />

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
              <ServingsControl
                currentServings={currentServings}
                minServings={MIN_SERVINGS}
                maxServings={MAX_SERVINGS}
                onIncrement={() => setCurrentServings((prev) => prev + 1)}
                onDecrement={() => setCurrentServings((prev) => prev - 1)}
              />
            )}
            <ul className="flex flex-col gap-1">
              {recipe.ingredients.map((ingredient, index) => {
                const converted = convertIngredientQuantity(
                  ingredient.quantity,
                  ingredient.unit,
                  servingRatio
                );

                return (
                  <IngredientListItem
                    key={index}
                    ingredient={{
                      ...ingredient,
                      id: ingredient.id ?? `ingredient-${index}`,
                      inFridge: false,
                      calories: 0,
                    }}
                    displayQuantity={converted.quantity}
                    displayUnit={converted.unit}
                    displayPrice={formatNumber(
                      Math.round((ingredient.price || 0) * servingRatio),
                      "원"
                    )}
                  />
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

      <IngredientReportSheet
        isOpen={isReportSheetOpen}
        onOpenChange={setIsReportSheetOpen}
        recipe={recipe}
        servingRatio={servingRatio}
      />

      <IngredientCopySheet
        isOpen={isCopySheetOpen}
        onOpenChange={setIsCopySheetOpen}
        recipe={recipe}
        currentServings={currentServings}
        servingRatio={servingRatio}
        onServingsChange={setCurrentServings}
      />
    </div>
  );
};

export default IngredientsSection;
