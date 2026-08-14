"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import type { InfiniteData } from "@tanstack/react-query";

import type { RecipeSortType, TagCode } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { useSort } from "@/shared/hooks/useSort";
import type { Locale } from "@/shared/i18n";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { getNextSlicePageParam } from "@/shared/lib/utils";
import { Container } from "@/shared/ui/Container";
import RecipeSortButton from "@/shared/ui/RecipeSortButton";

import {
  type DetailedRecipesApiResponse,
  getRecipeItems,
} from "@/entities/recipe";

import RecipeGrid from "@/widgets/RecipeGrid/ui/RecipeGrid";
import RecipeGridSkeleton from "@/widgets/RecipeGrid/ui/RecipeGridSkeleton";

import {
  buildCategoryClientQuery,
  buildCategoryQueryKey,
} from "./categoryQuery";
import CategoryChips from "./components/CategoryChips";
import CategoryEmptyState from "./components/CategoryEmptyState";
import CategoryHero from "./components/CategoryHero";

const SortPicker = dynamic(() => import("@/shared/ui/SortPicker"), {
  ssr: false,
});

type CategoryDetailClientProps = {
  tagCode: TagCode;
  locale: Locale;
  initialApiPage: number;
  nextPageHref?: string;
};

const CategoryDetailClient = ({
  tagCode,
  locale,
  initialApiPage,
  nextPageHref,
}: CategoryDetailClientProps) => {
  const { label } = useTaxonomy();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { currentSort, setSort, getSortParam, availableSorts } =
    useSort("recipe");

  const sortParam = getSortParam();
  const context = { tagCode, sort: sortParam, locale, initialApiPage };
  const queryKey = buildCategoryQueryKey(context);

  const { data, hasNextPage, isFetching, ref } = useInfiniteScroll<
    DetailedRecipesApiResponse,
    Error,
    InfiniteData<DetailedRecipesApiResponse>,
    typeof queryKey,
    number
  >({
    queryKey,
    queryFn: ({ pageParam }) =>
      getRecipeItems(buildCategoryClientQuery(context, pageParam)),
    getNextPageParam: getNextSlicePageParam,
    initialPageParam: initialApiPage,
  });

  const tagName = label(tagCode, "tags");

  const recipes = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <Container padding={false}>
      <CategoryHero tagCode={tagCode} />
      <CategoryChips currentCode={tagCode} />

      <div className="flex items-center justify-end px-4 py-3">
        <div className="flex items-center">
          <RecipeSortButton
            currentSort={currentSort}
            onClick={() => setIsDrawerOpen(true)}
          />
          <SortPicker
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            currentSort={currentSort}
            availableSorts={availableSorts}
            onSortChange={(newSort) =>
              // SortPicker emits string; availableSorts are RecipeSortType
              setSort(newSort as RecipeSortType)
            }
          />
        </div>
      </div>

      {recipes.length > 0 ? (
        <RecipeGrid
          recipes={recipes}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
          observerRef={ref}
          nextPageHref={nextPageHref}
          locale={locale}
        />
      ) : isFetching ? (
        <RecipeGridSkeleton count={6} />
      ) : (
        <CategoryEmptyState tagName={tagName} />
      )}
    </Container>
  );
};

export default CategoryDetailClient;
