"use client";

import { useMemo, useState } from "react";

import { InfiniteData } from "@tanstack/react-query";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import type { Locale } from "@/shared/i18n";
import { useUserPagesDict, useUserPagesLocale } from "@/shared/i18n";
import { getNextSlicePageParam } from "@/shared/lib/utils";

import { isPrivateRecipe, MyRecipesPageResponse } from "@/entities/recipe";

import RecipeGrid from "@/widgets/RecipeGrid/ui/RecipeGrid";
import { RecipeMoreActionsSheet } from "@/widgets/RecipeMoreActionsSheet";

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const locale = useUserPagesLocale();
  const t = useUserPagesDict();

  const { data, error, hasNextPage, isFetching, isPending, ref } =
    useInfiniteScroll<
      MyRecipesPageResponse,
      Error,
      InfiniteData<MyRecipesPageResponse>,
      [string, string, "ASC" | "DESC", Locale],
      number
    >({
      queryKey: ["recipes", userId, sort, locale],
      queryFn: ({ pageParam }) =>
        getMyRecipeItems({
          userId,
          sort,
          lang: locale,
          pageParam,
        }),
      getNextPageParam: getNextSlicePageParam,
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

  const selectedRecipe = selectedId
    ? recipes.find((r) => r.id === selectedId)
    : undefined;
  const target = selectedRecipe
    ? { id: selectedRecipe.id, isPrivate: isPrivateRecipe(selectedRecipe) }
    : null;

  const handleOpenChange = (open: boolean) => {
    if (!open) setSelectedId(null);
  };

  return (
    <>
      <RecipeGrid
        recipes={recipes}
        isSimple
        hasNextPage={hasNextPage}
        isFetching={isFetching}
        isPending={isPending}
        noResults={recipes.length === 0 && !isPending}
        noResultsMessage={t.profile.recipesEmpty}
        observerRef={ref}
        error={error}
        showAIRecipeCTA={isOwnProfile}
        onItemMoreClick={isOwnProfile ? setSelectedId : undefined}
      />
      {isOwnProfile && (
        <RecipeMoreActionsSheet
          target={target}
          onOpenChange={handleOpenChange}
        />
      )}
    </>
  );
};

export default MyRecipesTabContent;
