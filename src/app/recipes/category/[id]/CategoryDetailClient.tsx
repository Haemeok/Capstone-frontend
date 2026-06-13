"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { InfiniteData } from "@tanstack/react-query";

import { type RecipeSortType, TagCode } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { useSort } from "@/shared/hooks/useSort";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { getNextPageParam } from "@/shared/lib/utils";
import { Container } from "@/shared/ui/Container";
import RecipeSortButton from "@/shared/ui/RecipeSortButton";

import { getRecipeItems } from "@/entities/recipe";
import { DetailedRecipesApiResponse } from "@/entities/recipe";

import RecipeGridSkeleton from "@/widgets/RecipeGrid/ui/RecipeGridSkeleton";

import CategoryChips from "./components/CategoryChips";
import CategoryCount from "./components/CategoryCount";
import CategoryEmptyState from "./components/CategoryEmptyState";
import CategoryHero from "./components/CategoryHero";

const SortPicker = dynamic(() => import("@/shared/ui/SortPicker"), {
  ssr: false,
});

const RecipeGrid = dynamic(() => import("@/widgets/RecipeGrid/ui/RecipeGrid"), {
  loading: () => <RecipeGridSkeleton count={6} />,
  ssr: false,
});

type CategoryDetailClientProps = {
  initialPage?: number;
  nextPageHref?: string;
};

const CategoryDetailClient = ({
  initialPage = 0,
  nextPageHref,
}: CategoryDetailClientProps) => {
  const { id: tagCode } = useParams<{ id: TagCode }>();
  const { label } = useTaxonomy();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { currentSort, setSort, getSortParam, availableSorts } =
    useSort("recipe");

  const sortParam = getSortParam();

  const { data, hasNextPage, isFetching, ref } = useInfiniteScroll<
    DetailedRecipesApiResponse,
    Error,
    InfiniteData<DetailedRecipesApiResponse>,
    [string, string, string],
    number
  >({
    queryKey: ["recipes", tagCode, sortParam],
    queryFn: ({ pageParam }) =>
      getRecipeItems({
        tags: [tagCode],
        pageParam,
        sort: sortParam,
        types: ["USER", "AI", "YOUTUBE"],
      }),
    getNextPageParam: getNextPageParam,
    initialPageParam: initialPage,
  });

  const tagName = label(tagCode, "tags");

  const recipes = data?.pages.flatMap((page) => page.content);
  const totalElements = data?.pages?.[0]?.page.totalElements;

  return (
    <Container padding={false}>
      <CategoryHero tagCode={tagCode} />
      <CategoryChips currentCode={tagCode} />

      <div className="flex items-center justify-between px-4 py-3">
        <CategoryCount total={totalElements} />
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

      {recipes && recipes.length > 0 ? (
        <RecipeGrid
          recipes={recipes}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
          observerRef={ref}
          nextPageHref={nextPageHref}
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
