"use client";

import { useRouter } from "next/navigation";
import { UtensilsCrossed } from "lucide-react";
import { Image } from "@/shared/ui/image/Image";
import { formatNumber } from "@/shared/lib/format";
import { RecipeHistoryDetailResponse } from "@/entities/recipe/model/record";

type RecipeListSectionProps = {
  data: RecipeHistoryDetailResponse[] | undefined;
};

const RecipeListSection = ({ data }: RecipeListSectionProps) => {
  const router = useRouter();

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
            <div
              key={`${item.recipeId}-${index}`}
              onClick={() => router.push(`/recipes/${item.recipeId}`)}
              className="group flex cursor-pointer gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <Image
                src={item.imageUrl}
                alt={item.recipeTitle}
                className="h-24 w-24 flex-shrink-0 rounded-xl"
                wrapperClassName="overflow-hidden rounded-xl"
                imgClassName="ease-in-out group-hover:scale-105"
              />
              <div className="flex flex-1 flex-col justify-between py-0.5">
                <h4 className="text-lg leading-snug font-bold text-gray-900">
                  {item.recipeTitle}
                </h4>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">
                    {item.calories}kcal
                  </span>
                  <span className="text-gray-300">·</span>
                  <span>탄 {Math.round(item.nutrition.carbohydrate)}g</span>
                  <span>단 {Math.round(item.nutrition.protein)}g</span>
                  <span>지 {Math.round(item.nutrition.fat)}g</span>
                </div>

                <div className="flex items-center">
                  <span className="bg-olive-light/10 text-olive-dark rounded-full px-3 py-1 text-sm font-bold">
                    {formatNumber(
                      item.marketPrice - item.ingredientCost,
                      "원"
                    )}{" "}
                    절약
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeListSection;
