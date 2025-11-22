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
    <div className="flex flex-col gap-4 p-4">
      {data.map((item, index) => (
        <div
          key={`${item.recipeId}-${index}`}
          onClick={() => router.push(`/recipes/${item.recipeId}`)}
          className="hover:border-olive-light group flex cursor-pointer items-center gap-4 rounded-2xl border-1 border-gray-200 p-4 py-2 transition-all"
        >
          <Image
            src={item.imageUrl}
            alt={item.recipeTitle}
            className="h-32 w-32 rounded-md"
            wrapperClassName="overflow-hidden rounded-md"
            imgClassName="ease-in-out group-hover:scale-110"
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-bold">{item.recipeTitle}</h1>
            <div className="flex flex-col">
              <p className="text-sm text-slate-500">이 레시피로</p>
              <p className="text-mm text-olive-mint font-bold">
                {formatNumber(item.marketPrice - item.ingredientCost, "원")}{" "}
                절약했어요
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeListSection;
