"use client";

import type { InfiniteData, QueryStatus } from "@tanstack/react-query";

import { format, useIngredientAddDict } from "@/shared/i18n";

import type { IngredientsApiResponse } from "@/entities/ingredient/model/types";
import {
  IngredientPickerCard,
  type IngredientSelectionItem,
} from "@/entities/ingredient/ui/IngredientPicker";

type IngredientCatalogResultsProps = {
  data: InfiniteData<IngredientsApiResponse> | undefined;
  error: Error | null;
  isPending: boolean;
  status: QueryStatus;
  loadMoreRef: (node?: Element | null) => void;
  ownedIngredientIds: Set<string>;
  isSelected: (id: string) => boolean;
  onToggle: (ingredient: IngredientSelectionItem) => void;
};

export const IngredientCatalogResults = ({
  data,
  error,
  isPending,
  status,
  loadMoreRef,
  ownedIngredientIds,
  isSelected,
  onToggle,
}: IngredientCatalogResultsProps) => {
  const dict = useIngredientAddDict();
  const ingredients = data?.pages.flatMap((page) => page.content);

  if (isPending) {
    return (
      <p className="text-ink-muted py-10 text-center text-sm">{dict.loading}</p>
    );
  }

  if (status === "error") {
    return (
      <p role="alert" className="text-ink-sub bg-gray-100 p-4 text-sm">
        {format(dict.errorPrefix, { message: error?.message ?? "" })}
      </p>
    );
  }

  return (
    <>
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
      </div>
      <div ref={loadMoreRef} className="h-8" aria-hidden="true" />
    </>
  );
};
