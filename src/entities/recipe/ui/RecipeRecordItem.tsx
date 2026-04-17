"use client";

import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const savings = marketPrice - ingredientCost;

  return (
    <div
      onClick={() => router.push(`/recipes/${recipeId}`)}
      className="group flex cursor-pointer gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
    >
      <Image
        src={imageUrl}
        alt={recipeTitle}
        className="h-24 w-24 flex-shrink-0 rounded-xl"
        wrapperClassName="overflow-hidden rounded-xl"
        imgClassName="ease-in-out group-hover:scale-105"
      />
      <div className="flex flex-1 flex-col justify-between py-0.5">
        <h4 className="text-lg leading-snug font-bold text-gray-900">
          {recipeTitle}
        </h4>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{calories}kcal</span>
          <span className="text-gray-300">·</span>
          <span>탄 {Math.round(nutrition.carbohydrate)}g</span>
          <span>단 {Math.round(nutrition.protein)}g</span>
          <span>지 {Math.round(nutrition.fat)}g</span>
        </div>

        <div className="flex items-center">
          <span className="bg-olive-light/10 text-olive-dark rounded-full px-3 py-1 text-sm font-bold">
            {formatNumber(savings, "원")} 절약
          </span>
        </div>
      </div>
    </div>
  );
};
