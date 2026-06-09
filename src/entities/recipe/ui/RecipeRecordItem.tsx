"use client";

import Link from "next/link";

import { formatNumber } from "@/shared/lib/format";
import { Image } from "@/shared/ui/image/Image";

import { Nutrition } from "@/entities/recipe/model/types";

type RecipeRecordItemProps = {
  recipeId: string;
  recipeTitle: string;
  imageUrl: string;
  calories: number;
  nutrition: Nutrition;
  ingredientCost: number;
  marketPrice: number;
};

export const RecipeRecordItem = ({
  recipeId,
  recipeTitle,
  imageUrl,
  calories,
  nutrition,
  ingredientCost,
  marketPrice,
}: RecipeRecordItemProps) => {
  const savings = marketPrice - ingredientCost;

  return (
    <Link
      href={`/recipes/${recipeId}`}
      className="flex cursor-pointer gap-3.5 rounded-2xl p-2 transition-colors active:bg-gray-50"
    >
      <Image
        src={imageUrl}
        alt={recipeTitle}
        wrapperClassName="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl"
      />
      <div className="flex flex-1 flex-col justify-center gap-1 py-0.5">
        <h4 className="line-clamp-1 text-base leading-snug font-semibold text-gray-900">
          {recipeTitle}
        </h4>

        <div className="flex flex-wrap items-center gap-x-1.5 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{calories}kcal</span>
          <span className="text-gray-300">·</span>
          <span>탄 {Math.round(nutrition.carbohydrate)}g</span>
          <span>단 {Math.round(nutrition.protein)}g</span>
          <span>지 {Math.round(nutrition.fat)}g</span>
        </div>

        <p className="text-olive-dark text-sm font-semibold">
          {formatNumber(savings, "원")} 절약
        </p>
      </div>
    </Link>
  );
};
