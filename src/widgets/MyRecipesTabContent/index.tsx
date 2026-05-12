"use client";

import { useMemo, useState } from "react";

import { InfiniteData } from "@tanstack/react-query";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";

import { MyRecipesPageResponse } from "@/entities/recipe";

import RecipeGrid from "@/widgets/RecipeGrid/ui/RecipeGrid";

import { getMyRecipeItems } from "./api";

type MyRecipesTabContentProps = {
  userId: string;
  isOwnProfile: boolean;
};

const MyRecipesTabContent = ({
  userId,
  isOwnProfile,
}: MyRecipesTabContentProps) => {
  const [sort] = useState<"ASC" | "DESC">("DESC");

  const { data, error, hasNextPage, isFetching, isPending, ref } =
    useInfiniteScroll<
      MyRecipesPageResponse,
      Error,
      InfiniteData<MyRecipesPageResponse>,
      [string, string, "ASC" | "DESC"],
      number
    >({
      queryKey: ["recipes", userId, sort],
      queryFn: ({ pageParam }) =>
        getMyRecipeItems({
          userId,
          sort,
          pageParam,
        }),
      getNextPageParam: getNextPageParam,
      initialPageParam: 0,
    });

  const recipes = useMemo(() => {
    const seen = new Set<string>();
    const out: MyRecipesPageResponse["content"][number][] = [];
    for (const page of data?.pages ?? []) {
      for (const item of page.content) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        out.push(item);
      }
    }
    return out;
  }, [data]);

  return (
    <RecipeGrid
      recipes={recipes}
      isSimple
      hasNextPage={hasNextPage}
      isFetching={isFetching}
      isPending={isPending}
      noResults={recipes.length === 0 && !isPending}
      noResultsMessage="작성한 레시피가 없습니다."
      observerRef={ref}
      error={error}
      showAIRecipeCTA={isOwnProfile}
    />
  );
};

export default MyRecipesTabContent;
