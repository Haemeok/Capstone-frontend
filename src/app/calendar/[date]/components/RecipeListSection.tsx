"use client";

import { useRouter } from "next/navigation";
import { Image } from "@/shared/ui/image/Image";
import { formatNumber } from "@/shared/lib/format";
import type { RecipeHistoryDetailResponse } from "@/entities/user";

type RecipeListSectionProps = {
  data: RecipeHistoryDetailResponse[] | undefined;
};

const RecipeListSection = ({ data }: RecipeListSectionProps) => {
  const router = useRouter();

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-gray-500">기록된 레시피가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index) => (
        <div
          key={`${item.recipeId}-${index}`}
          onClick={() => router.push(`/recipes/${item.recipeId}`)}
          className="hover:border-olive-light group flex cursor-pointer gap-4 rounded-2xl border-1 border-gray-200 p-4 transition-all"
        >
          <Image
            src={item.imageUrl}
            alt={item.recipeTitle}
            className="h-24 w-24 flex-shrink-0 rounded-md"
            wrapperClassName="overflow-hidden rounded-md"
            imgClassName="ease-in-out group-hover:scale-110"
          />
          <div className="flex flex-1 flex-col">
            <h1 className="text-lg leading-tight font-bold">
              {item.recipeTitle}
            </h1>
            <div className="flex flex-col items-end justify-center gap-1 text-sm">
              <div className="bg-olive-light/10 flex items-center gap-1 rounded-full px-2.5 py-0.5">
                <span className="text-olive-dark font-bold">
                  {item.calories}kcal
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <div className="flex items-center gap-0.5">
                  <span className="text-gray-500">탄</span>
                  <span className="font-semibold">
                    {Math.round(item.nutrition.carbohydrate)}g
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-gray-500">단</span>
                  <span className="font-semibold">
                    {Math.round(item.nutrition.protein)}g
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-gray-500">지</span>
                  <span className="font-semibold">
                    {Math.round(item.nutrition.fat)}g
                  </span>
                </div>
              </div>

              <span className="text-olive-mint text-base font-bold">
                {formatNumber(item.marketPrice - item.ingredientCost, "원")}{" "}
                절약
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeListSection;
