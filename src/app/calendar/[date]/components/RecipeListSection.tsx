"use client";

import { UtensilsCrossed } from "lucide-react";

import { useUserPagesDict } from "@/shared/i18n";

import { RecipeHistoryDetailResponse } from "@/entities/recipe/model/record";
import { RecipeRecordItem } from "@/entities/recipe/ui/RecipeRecordItem";

type RecipeListSectionProps = {
  data: RecipeHistoryDetailResponse[] | undefined;
};

const RecipeListSection = ({ data }: RecipeListSectionProps) => {
  const t = useUserPagesDict().calendar;

  return (
    <section className="border-t border-gray-100 py-6">
      <h3 className="text-ink mb-4 text-lg font-bold">{t.recipeListHeading}</h3>

      {!data || data.length === 0 ? (
        <div className="flex flex-col items-center py-10">
          <UtensilsCrossed className="mb-3 h-10 w-10 text-gray-300" />
          <p className="text-ink-muted text-sm">{t.recipeListEmpty}</p>
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
    </section>
  );
};

export default RecipeListSection;
