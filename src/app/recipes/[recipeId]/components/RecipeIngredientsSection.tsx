"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { formatNumber } from "@/shared/lib/format";
import { convertIngredientQuantity } from "@/shared/lib/ingredientConversion";
import { calculateActivityTime, getRandomActivity } from "@/shared/lib/recipe";
import RollingPointBanner from "@/shared/ui/RollingPointBanner";

import { Recipe, StaticRecipe } from "@/entities/recipe/model/types";

import { AIExtractionNotice } from "@/features/recipe-import-youtube/ui/AIExtractionNotice";
import { useRecipeStatus } from "@/features/recipe-status";

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
  const isYoutubeExtracted = "youtubeUrl" in recipe && !!recipe.youtubeUrl;
  const [showNutrition, setShowNutrition] = useState(false);
  const [isReportSheetOpen, setIsReportSheetOpen] = useState(false);
  const [isCopySheetOpen, setIsCopySheetOpen] = useState(false);

  const isValidServings = recipe.servings > 0 && Number.isFinite(recipe.servings);
  const [currentServings, setCurrentServings] = useState(
    isValidServings ? recipe.servings : 1
  );

  const { status } = useRecipeStatus();
  const fridgeIngredientIds = useMemo(
    () => new Set(status?.ingredientIdsInFridge ?? []),
    [status?.ingredientIdsInFridge]
  );

  const ownedIndices = useMemo(() => {
    const owned = new Set<number>();
    recipe.ingredients.forEach((ingredient, index) => {
      if (ingredient.id && fridgeIngredientIds.has(ingredient.id)) {
        owned.add(index);
      }
    });
    return owned;
  }, [recipe.ingredients, fridgeIngredientIds]);

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

  const rollingMessages = showNutrition
    ? [
        {
          prefix: "이 레시피는 약",
          pointText: formatNumber(scaledCalories, "kcal"),
          suffix: "예요!",
        },
        {
          prefix: "이 칼로리는",
          pointText: `${randomActivity.name} ${formatNumber(scaledActivityTime, "분")}`,
          suffix: "으로 소모 가능해요!",
          textClassName: "text-purple-500",
        },
      ]
    : [
        {
          prefix: "이 레시피에 약",
          pointText: formatNumber(scaledIngredientCost, "원"),
          suffix: "필요해요!",
        },
        {
          prefix: "배달 물가 대비",
          pointText: formatNumber(scaledMarketPrice - scaledIngredientCost, "원"),
          suffix: "절약해요!",
          textClassName: "text-purple-500",
        },
      ];

  return (
    <div className="flex flex-col gap-2 mt-2">
      <IngredientsSectionHeader
        showNutrition={showNutrition}
        onNutritionToggle={setShowNutrition}
        onCopyOpen={() => setIsCopySheetOpen(true)}
        onReportOpen={() => setIsReportSheetOpen(true)}
      />

      {isYoutubeExtracted && <AIExtractionNotice />}

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
                const ingredientId = ingredient.id ?? `ingredient-${index}`;
                const inFridge = ingredient.id
                  ? fridgeIngredientIds.has(ingredient.id)
                  : false;

                return (
                  <IngredientListItem
                    key={index}
                    ingredient={{
                      ...ingredient,
                      id: ingredientId,
                      inFridge,
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

      <RollingPointBanner messages={rollingMessages} containerClassName="mt-2" />

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
        ownedIndices={ownedIndices}
      />
    </div>
  );
};

export default IngredientsSection;
