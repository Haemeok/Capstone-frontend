"use client";

import { useState } from "react";

import type { IngredientPack } from "@/shared/config/constants/ingredientPacks";
import type { IngredientCategoryName } from "@/shared/config/constants/recipe";
import useSearch from "@/shared/hooks/useSearch";
import { useIngredientAddDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

import { type IngredientSelectionItem } from "@/entities/ingredient/ui/IngredientPicker";

import { useIngredientAddCatalog } from "../hooks/useIngredientAddCatalog";
import { IngredientCatalogResults } from "./IngredientCatalogResults";
import { IngredientCatalogSearch } from "./IngredientCatalogSearch";
import { IngredientCategoryFilter } from "./IngredientCategoryFilter";
import { RecommendedPacksSection } from "./RecommendedPacksSection";

type IngredientAddCatalogProps = {
  ownedIngredientIds: Set<string>;
  isSelected: (id: string) => boolean;
  onToggle: (ingredient: IngredientSelectionItem) => void;
  onViewPack: (pack: IngredientPack) => void;
};

export const IngredientAddCatalog = ({
  ownedIngredientIds,
  isSelected,
  onToggle,
  onViewPack,
}: IngredientAddCatalogProps) => {
  const dict = useIngredientAddDict();
  const [category, setCategory] = useState<IngredientCategoryName>("전체");
  const {
    searchQuery,
    inputValue,
    handleSearchSubmit,
    handleInputChange,
    clearSearch,
  } = useSearch();
  const { data, error, isFetchingNextPage, isPending, ref } =
    useIngredientAddCatalog(category, searchQuery);
  const shouldShowRecommendedPacks = searchQuery === "" && category === "전체";
  const handleCategoryChange = (next: IngredientCategoryName) => {
    if (category === next) return;
    triggerHaptic("Light");
    clearSearch();
    setCategory(next);
  };

  return (
    <>
      <div className="px-4 pt-4 md:px-6">
        <IngredientCatalogSearch
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onSearchSubmit={handleSearchSubmit}
        />
      </div>

      {shouldShowRecommendedPacks ? (
        <RecommendedPacksSection
          ownedIngredientIds={ownedIngredientIds}
          onViewPack={onViewPack}
        />
      ) : null}

      <section
        aria-labelledby="ingredient-catalog-heading"
        className="px-4 pt-4 md:px-6"
      >
        <h2 id="ingredient-catalog-heading" className="sr-only">
          {dict.catalogHeading}
        </h2>
        <IngredientCategoryFilter
          category={category}
          onCategoryChange={handleCategoryChange}
        />

        <div className="mt-4 min-h-48">
          <IngredientCatalogResults
            data={data}
            error={error}
            searchQuery={searchQuery}
            isFetchingNextPage={isFetchingNextPage}
            isPending={isPending}
            loadMoreRef={ref}
            ownedIngredientIds={ownedIngredientIds}
            isSelected={isSelected}
            onToggle={onToggle}
          />
        </div>
      </section>
    </>
  );
};
