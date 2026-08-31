"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import type { InfiniteData } from "@tanstack/react-query";

import type { RecipeSortType, TagCode } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { useSort } from "@/shared/hooks/useSort";
import {
  format,
  type Locale,
  useCategoryDict,
  useRecipeGridDict,
} from "@/shared/i18n";
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
import CategoryContentHeader from "./components/CategoryContentHeader";
import CategoryEmptyState from "./components/CategoryEmptyState";
import CategoryHeader from "./components/CategoryHeader";

const SortPicker = dynamic(() => import("@/shared/ui/SortPicker"), {
  ssr: false,
});

type CategoryDetailClientProps = {
  tagCode: TagCode;
  locale: Locale;
  initialApiPage: number;
  previousPageHref?: string;
  nextPageHref?: string;
};

const CategoryDetailClient = ({
  tagCode,
  locale,
  initialApiPage,
  previousPageHref,
  nextPageHref,
}: CategoryDetailClientProps) => {
  const { label } = useTaxonomy();
  const categoryMessages = useCategoryDict();
  const recipeGridMessages = useRecipeGridDict();
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
      <CategoryHeader />
      <CategoryChips currentCode={tagCode} />

      <CategoryContentHeader
        title={tagName}
        description={format(categoryMessages.summaryTemplate, { tagName })}
        sortControl={
          <div className="flex items-center">
            <RecipeSortButton
              currentSort={currentSort}
              onClick={() => setIsDrawerOpen(true)}
              className="min-h-11 cursor-pointer"
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
        }
      />

      {recipes.length > 0 ? (
        <RecipeGrid
          recipes={recipes}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
          observerRef={ref}
          previousPageHref={previousPageHref}
          nextPageHref={nextPageHref}
          locale={locale}
        />
      ) : isFetching ? (
        <RecipeGridSkeleton count={6} />
      ) : (
        <>
          {previousPageHref ? (
            <a
              href={previousPageHref}
              rel="prev"
              className="sr-only"
              tabIndex={-1}
            >
              {recipeGridMessages.previousPage}
            </a>
          ) : null}
          <CategoryEmptyState tagName={tagName} />
        </>
      )}
    </Container>
  );
};

export default CategoryDetailClient;
