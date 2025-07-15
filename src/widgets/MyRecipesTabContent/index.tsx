"use client";

import { useState } from "react";

import { InfiniteData } from "@tanstack/react-query";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";

import { BaseRecipesApiResponse } from "@/entities/recipe";

import RecipeGrid from "@/widgets/RecipeGrid/ui/RecipeGrid";

import { getMyRecipeItems } from "./api";

type MyRecipesTabContentProps = {
  userId: number;
};

const MyRecipesTabContent = ({ userId }: MyRecipesTabContentProps) => {
  const [sort, setSort] = useState<"ASC" | "DESC">("DESC");

  const { data, error, hasNextPage, isFetching, ref } = useInfiniteScroll<
    BaseRecipesApiResponse,
    Error,
    InfiniteData<BaseRecipesApiResponse>,
    [string, string, "ASC" | "DESC"],
    number
  >({
    queryKey: ["recipes", userId.toString(), sort],
    queryFn: ({ pageParam }) =>
      getMyRecipeItems({
        userId,
        sort,
        pageParam,
      }),
    getNextPageParam: getNextPageParam,
    initialPageParam: 0,
  });

  const recipes = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <RecipeGrid
      recipes={recipes}
      isSimple={true}
      hasNextPage={hasNextPage}
      isFetching={isFetching}
      noResults={recipes.length === 0 && !isFetching}
      noResultsMessage={
        recipes.length === 0
          ? "작성한 레시피가 없습니다."
          : "레시피를 작성해보세요."
      }
      observerRef={ref}
      error={error}
    />
  );
};

export default MyRecipesTabContent;
