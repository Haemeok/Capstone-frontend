"use client";

import type { InfiniteData } from "@tanstack/react-query";

import { format, useIngredientAddDict } from "@/shared/i18n";

import type { IngredientsApiResponse } from "@/entities/ingredient/model/types";
import {
  IngredientPickerCard,
  type IngredientSelectionItem,
} from "@/entities/ingredient/ui/IngredientPicker";

import {
  IngredientAddGridSkeleton,
  IngredientAddSkeletonCards,
} from "./IngredientAddGridSkeleton";

type IngredientCatalogResultsProps = {
  data: InfiniteData<IngredientsApiResponse> | undefined;
  error: Error | null;
  searchQuery: string;
  isFetchingNextPage: boolean;
  isPending: boolean;
  loadMoreRef: (node?: Element | null) => void;
  ownedIngredientIds: Set<string>;
  isSelected: (id: string) => boolean;
  onToggle: (ingredient: IngredientSelectionItem) => void;
};

export const IngredientCatalogResults = ({
  data,
  error,
  searchQuery,
  isFetchingNextPage,
  isPending,
  loadMoreRef,
  ownedIngredientIds,
  isSelected,
  onToggle,
}: IngredientCatalogResultsProps) => {
  const dict = useIngredientAddDict();
  const ingredients = data?.pages.flatMap((page) => page.content);

  if (isPending) {
    return <IngredientAddGridSkeleton count={6} label={dict.loading} />;
  }

  if (error) {
    return (
      <p role="alert" className="text-ink-sub bg-gray-100 p-4 text-sm">
        {format(dict.errorPrefix, { message: error?.message ?? "" })}
      </p>
    );
  }

  if (ingredients?.length === 0) {
    return (
      <div role="status" className="py-10 text-center">
        <p className="text-ink text-sm font-semibold">
          {format(dict.noResults, { query: searchQuery })}
        </p>
        <p className="text-ink-muted mt-2 text-sm">{dict.noResultsHint}</p>
      </div>
    );
  }

  return (
    <>
      {isFetchingNextPage ? (
        <span role="status" className="sr-only">
          {dict.loadingMore}
        </span>
      ) : null}
      <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-5">
        {ingredients?.map((ingredient) => (
          <IngredientPickerCard
            key={ingredient.id}
            ingredient={ingredient}
            isSelected={isSelected(ingredient.id)}
            isAlreadyAdded={
              ingredient.inFridge || ownedIngredientIds.has(ingredient.id)
            }
            onToggle={onToggle}
          />
        ))}
        {isFetchingNextPage ? <IngredientAddSkeletonCards count={2} /> : null}
      </div>
      <div
        ref={loadMoreRef}
        data-testid="ingredient-catalog-load-more"
        className="h-8"
        aria-hidden="true"
      />
    </>
  );
};
