"use client";

import {
  INGREDIENT_CATEGORIES,
  type IngredientCategoryName,
} from "@/shared/config/constants/recipe";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

type Props = {
  selected: IngredientCategoryName;
  onSelect: (category: IngredientCategoryName) => void;
};

export const IngredientCategoryTabs = ({ selected, onSelect }: Props) => {
  const { localize } = useTaxonomy();

  const handleClick = (category: IngredientCategoryName) => {
    triggerHaptic("Light");
    onSelect(category);
  };

  return (
    <div className="scrollbar-hide flex flex-nowrap gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-x-visible">
      {INGREDIENT_CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => handleClick(category)}
          className={cn(
            "flex-shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-all sm:px-4 sm:py-2",
            selected === category
              ? "bg-olive-light text-white"
              : "text-ink-sub bg-gray-100 hover:bg-gray-200"
          )}
        >
          {localize(category, "ingredientCategory")}
        </button>
      ))}
    </div>
  );
};
