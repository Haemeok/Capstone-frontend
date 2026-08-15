"use client";

import {
  INGREDIENT_CATEGORIES,
  type IngredientCategoryName,
} from "@/shared/config/constants/recipe";
import { useIngredientsDict } from "@/shared/i18n/useIngredientsDict";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

type IngredientCategoryFilterProps = {
  selectedCategory: IngredientCategoryName;
  onChange: (category: IngredientCategoryName) => void;
};

export const IngredientCategoryFilter = ({
  selectedCategory,
  onChange,
}: IngredientCategoryFilterProps) => {
  const t = useIngredientsDict();
  const { localize } = useTaxonomy();

  const handleChange = (category: IngredientCategoryName) => {
    if (selectedCategory === category) return;
    triggerHaptic("Light");
    onChange(category);
  };

  return (
    <div className="z-sticky sticky-optimized sticky top-0 border-b border-gray-100 bg-white">
      <div
        role="group"
        aria-label={t.categoryGroup}
        className="scrollbar-hide flex max-w-full gap-2 overflow-x-auto px-5 py-3 md:flex-wrap md:px-6"
      >
        {INGREDIENT_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleChange(category)}
              className={cn(
                "focus-visible:ring-olive-light min-h-11 shrink-0 cursor-pointer rounded-full px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                isSelected
                  ? "bg-ink text-white"
                  : "text-ink-sub bg-gray-100 active:bg-gray-200"
              )}
            >
              {localize(category, "ingredientCategory")}
            </button>
          );
        })}
      </div>
    </div>
  );
};
