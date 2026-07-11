"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

import type { Locale } from "@/shared/i18n";
import { format, useT } from "@/shared/i18n";
import { localizeActivityName } from "@/shared/i18n/activityNameOverlay";
import { formatNumber } from "@/shared/lib/format";
import { formatIngredientAmount } from "@/shared/lib/ingredientConversion";
import { calculateActivityTime, getRandomActivity } from "@/shared/lib/recipe";
import RollingPointBanner from "@/shared/ui/RollingPointBanner";

import { Recipe, StaticRecipe } from "@/entities/recipe/model/types";

import { AddToCartButton } from "@/features/cart-add";
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
  locale?: Locale;
};

const IngredientsSection = ({
  recipe,
  locale = "ko",
}: IngredientsSectionProps) => {
  const [showNutrition, setShowNutrition] = useState(false);
  const [isReportSheetOpen, setIsReportSheetOpen] = useState(false);
  const [isCopySheetOpen, setIsCopySheetOpen] = useState(false);

  const isValidServings =
    recipe.servings > 0 && Number.isFinite(recipe.servings);
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

  const t = useT();
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
          prefix: t.recipeDetail.caloriePrefix,
          pointText: formatNumber(scaledCalories, "kcal"),
          suffix: t.recipeDetail.calorieSuffix,
        },
        {
          prefix: t.recipeDetail.activityPrefix,
          pointText: `${localizeActivityName(randomActivity.name, locale)} ${format(t.recipeDetail.cookingTimeValue, { n: scaledActivityTime })}`,
          suffix: t.recipeDetail.activitySuffix,
          textClassName: "text-purple-500",
        },
      ]
    : locale === "ko"
      ? [
          {
            prefix: t.recipeDetail.costPrefix,
            // i18n-ignore: 가격 미국제화(ko 전용), 국제화 시 제거
            pointText: formatNumber(scaledIngredientCost, "원"),
            suffix: t.recipeDetail.costSuffix,
          },
          {
            prefix: t.recipeDetail.savingsPrefix,
            pointText: formatNumber(
              scaledMarketPrice - scaledIngredientCost,
              // i18n-ignore: 가격 미국제화(ko 전용), 국제화 시 제거
              "원"
            ),
            suffix: t.recipeDetail.savingsSuffix,
            textClassName: "text-purple-500",
          },
        ]
      : [];

  const rollingBanner =
    rollingMessages.length > 0 ? (
      <RollingPointBanner
        messages={rollingMessages}
        align="start"
        containerClassName="min-w-0 flex-1 !opacity-100"
      />
    ) : null;

  return (
    <div className="mt-2 flex flex-col gap-2">
      <IngredientsSectionHeader
        showNutrition={showNutrition}
        onNutritionToggle={setShowNutrition}
        onCopyOpen={() => setIsCopySheetOpen(true)}
        onReportOpen={() => setIsReportSheetOpen(true)}
      />

      <div>
        {showNutrition ? (
          <NutritionTable
            totalServings={recipe.servings}
            currentServings={currentServings}
            onServingsChange={setCurrentServings}
            nutrition={recipe.nutrition}
            banner={rollingBanner}
          />
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between gap-2">
              {rollingBanner ?? <span aria-hidden className="flex-1" />}
              {isValidServings && (
                <ServingsControl
                  currentServings={currentServings}
                  minServings={MIN_SERVINGS}
                  maxServings={MAX_SERVINGS}
                  onIncrement={() => setCurrentServings((prev) => prev + 1)}
                  onDecrement={() => setCurrentServings((prev) => prev - 1)}
                />
              )}
            </div>
            <ul className="flex flex-col gap-1">
              {recipe.ingredients.map((ingredient, index) => {
                const displayAmount = formatIngredientAmount(
                  ingredient.quantity,
                  ingredient.unit,
                  servingRatio,
                  locale
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
                    displayAmount={displayAmount}
                    displayPrice={formatNumber(
                      Math.round((ingredient.price || 0) * servingRatio),
                      // i18n-ignore: 가격 미국제화(ko 전용), 국제화 시 제거
                      "원"
                    )}
                    reserveFridgeSpace={ownedIndices.size > 0}
                    locale={locale}
                    cartAction={
                      locale === "ko" && ingredient.recipeIngredientId ? (
                        <AddToCartButton
                          recipeIngredientId={ingredient.recipeIngredientId}
                          name={ingredient.name}
                          quantity={ingredient.quantity}
                          unit={ingredient.unit}
                          servingRatio={servingRatio}
                          recipe={{
                            recipeId: recipe.id,
                            title: recipe.title,
                            imageUrl: recipe.imageUrl ?? null,
                          }}
                        />
                      ) : undefined
                    }
                  />
                );
              })}
            </ul>
          </>
        )}
      </div>

      <IngredientReportSheet
        isOpen={isReportSheetOpen}
        onOpenChange={setIsReportSheetOpen}
        recipe={recipe}
        servingRatio={servingRatio}
        locale={locale}
      />

      <IngredientCopySheet
        isOpen={isCopySheetOpen}
        onOpenChange={setIsCopySheetOpen}
        recipe={recipe}
        currentServings={currentServings}
        servingRatio={servingRatio}
        onServingsChange={setCurrentServings}
        ownedIndices={ownedIndices}
        locale={locale}
      />
    </div>
  );
};

export default IngredientsSection;
