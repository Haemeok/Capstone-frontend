"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { InfiniteData } from "@tanstack/react-query";

import { TagCode, TAGS_BY_CODE } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { useSort } from "@/shared/hooks/useSort";
import { getNextPageParam } from "@/shared/lib/utils";
import Circle from "@/shared/ui/Circle";
import HomeBanner from "@/shared/ui/HomeBanner";
import PrevButton from "@/shared/ui/PrevButton";
import RecipeSortButton from "@/shared/ui/RecipeSortButton";
import RecipeSortDrawer from "@/shared/ui/RecipeSortDrawer";

import { getRecipeItems } from "@/entities/recipe";
import { DetailedRecipesApiResponse } from "@/entities/recipe";

import RecipeGrid from "@/widgets/RecipeGrid/ui/RecipeGrid";

const CategoryDetailPage = () => {
  const { id: tagCode } = useParams<{ id: TagCode }>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { currentSort, setSort, getSortParam, availableSorts } =
    useSort("recipe");

  const { data, hasNextPage, isFetching, ref } = useInfiniteScroll<
    DetailedRecipesApiResponse,
    Error,
    InfiniteData<DetailedRecipesApiResponse>,
    [string, string, string],
    number
  >({
    queryKey: ["recipes", tagCode, getSortParam()],
    queryFn: ({ pageParam }) =>
      getRecipeItems({
        tags: [tagCode],
        pageParam,
        sort: getSortParam(),
      }),
    getNextPageParam: getNextPageParam,
    initialPageParam: 0,
  });

  const tagDef = TAGS_BY_CODE[tagCode as keyof typeof TAGS_BY_CODE];
  const tagName = tagDef?.name ?? String(tagCode);

  const recipes = data?.pages.flatMap((page) => page.content);

  const handleSortChange = (newSort: string) => {
    setSort(newSort as any);
    setIsDrawerOpen(false);
  };

  return (
    <div className="bg-white p-2">
      <header className="relative flex items-center justify-center border-b border-gray-200 p-2">
        <PrevButton className="absolute left-2" />
        <h1 className="text-xl font-bold">{`${tagName} 레시피`}</h1>
      </header>
      <div className="flex items-center justify-end p-4">
        <RecipeSortButton
          currentSort={currentSort}
          onClick={() => setIsDrawerOpen(true)}
        />
      </div>
      {!isFetching && recipes && recipes.length > 0 ? (
        <RecipeGrid
          recipes={recipes}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
          observerRef={ref}
        />
      ) : (
        <div className="flex h-[500px] w-full flex-col items-center justify-center p-4">
          {isFetching ? (
            <Circle className="text-olive-mint/60" size={32} />
          ) : (
            <>
              <p className="text-mm text-gray-500">
                {tagName} 레시피가 아직 없어요 !
              </p>
              <HomeBanner
                title="레시피 생성하러가기"
                description={`${tagName} 레시피를 만들어보세요!`}
                image="/robot1.webp"
                to="/recipes/new"
              />
            </>
          )}
        </div>
      )}

      <RecipeSortDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        currentSort={currentSort}
        availableSorts={availableSorts}
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default CategoryDetailPage;
