"use client";

import { useRouter } from "next/navigation";

import { ChevronRight } from "lucide-react";

import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import DetailedRecipeGridItem from "@/widgets/RecipeGrid/ui/DetailedRecipeGridItem";

import { useRecipeItemsQuery } from "./hooks";

type RecipeSlideProps = {
  title: string;
  queryKey: string;
  isAiGenerated?: boolean;
  tags?: string[];
  to?: string;
};

const RecipeSlide = ({
  title,
  queryKey,
  isAiGenerated,
  tags,
  to,
}: RecipeSlideProps) => {
  const router = useRouter();
  const {
    data: recipes,
    isLoading,
    error,
  } = useRecipeItemsQuery({
    key: queryKey,
    isAiGenerated,
    tags,
  });

  const handleMoreClick = () => {
    if (to) {
      router.push(to);
    }
  };

  return (
    <div className="mt-2 w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <button
          onClick={handleMoreClick}
          disabled={!to}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          더보기
          <ChevronRight size={16} />
        </button>
      </div>
      <div
        className="scrollbar-hide flex w-full gap-3 overflow-x-auto snap-x snap-mandatory"
        style={{ overflowY: "visible" }}
      >
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex-shrink-0">
              <Skeleton className="h-[200px] w-[200px] rounded-xl " />
              <div className="mt-2 space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="flex w-full h-30 items-center justify-center py-8">
            <p className="text-sm text-gray-500">
              잠시 서버에 문제가 있어요. 나중에 다시 시도해주세요.
            </p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex w-full items-center justify-center py-8">
            <p className="text-sm text-gray-500">아직 레시피가 없어요.</p>
          </div>
        ) : (
          recipes.map((item) => (
            <DetailedRecipeGridItem
              key={item.id}
              recipe={item}
              className="basis-[200px] w-[200px] snap-start"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RecipeSlide;
