"use client";

import { UtensilsCrossed } from "lucide-react";

import { RecipeRecordItem } from "@/entities/recipe/ui/RecipeRecordItem";

import { RecipeHistoryDetailResponse } from "@/entities/recipe/model/record";

type RecipeListSectionProps = {
  data: RecipeHistoryDetailResponse[] | undefined;
};

const RecipeListSection = ({ data }: RecipeListSectionProps) => {
  return (
    <div>
      <h3 className="mb-3 text-lg font-bold text-gray-900">
        오늘 먹은 레시피
      </h3>

      {!data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-14 shadow-sm">
          <UtensilsCrossed className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-base text-gray-400">아직 기록된 레시피가 없어요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((item, index) => (
            <RecipeRecordItem
              key={`${item.recipeId}-${index}`}
              recipeId={item.recipeId}
              recipeTitle={item.recipeTitle}
              imageUrl={item.imageUrl}
              calories={item.calories}
              nutrition={item.nutrition}
              ingredientCost={item.ingredientCost}
              marketPrice={item.marketPrice}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeListSection;
