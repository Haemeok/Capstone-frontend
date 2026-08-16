import {
  INGREDIENT_CATEGORIES,
  type IngredientCategoryName,
} from "@/shared/config/constants/recipe";
import { useIngredientAddDict } from "@/shared/i18n";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { cn } from "@/shared/lib/utils";

type IngredientCategoryFilterProps = {
  category: IngredientCategoryName;
  onCategoryChange: (category: IngredientCategoryName) => void;
};

export const IngredientCategoryFilter = ({
  category,
  onCategoryChange,
}: IngredientCategoryFilterProps) => {
  const dict = useIngredientAddDict();
  const { localize } = useTaxonomy();

  return (
    <div
      role="group"
      aria-label={dict.categoryGroup}
      className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6"
    >
      {INGREDIENT_CATEGORIES.map((item) => (
        <button
          key={item}
          type="button"
          aria-pressed={category === item}
          onClick={() => onCategoryChange(item)}
          className={cn(
            "focus-visible:outline-ink min-h-11 min-w-11 flex-none cursor-pointer rounded-xl px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
            category === item
              ? "bg-ink font-semibold text-white"
              : "text-ink-sub bg-gray-100 hover:bg-gray-200"
          )}
        >
          {localize(item, "ingredientCategory")}
        </button>
      ))}
    </div>
  );
};
