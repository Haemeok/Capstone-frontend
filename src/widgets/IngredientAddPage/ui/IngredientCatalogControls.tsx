import type { ChangeEventHandler, FormEventHandler } from "react";

import { Search } from "lucide-react";

import {
  INGREDIENT_CATEGORIES,
  type IngredientCategoryName,
} from "@/shared/config/constants/recipe";
import { useIngredientAddDict } from "@/shared/i18n";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { cn } from "@/shared/lib/utils";

type IngredientCatalogControlsProps = {
  category: IngredientCategoryName;
  inputValue: string;
  onCategoryChange: (category: IngredientCategoryName) => void;
  onInputChange: ChangeEventHandler<HTMLInputElement>;
  onSearchSubmit: FormEventHandler<HTMLFormElement>;
};

export const IngredientCatalogControls = ({
  category,
  inputValue,
  onCategoryChange,
  onInputChange,
  onSearchSubmit,
}: IngredientCatalogControlsProps) => {
  const dict = useIngredientAddDict();
  const { localize } = useTaxonomy();

  return (
    <>
      <form onSubmit={onSearchSubmit}>
        <div className="relative">
          <Search
            aria-hidden="true"
            size={18}
            className="text-ink-muted pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
          />
          <input
            type="search"
            aria-label={dict.searchPlaceholder}
            placeholder={dict.searchPlaceholder}
            value={inputValue}
            onChange={onInputChange}
            className="text-ink placeholder:text-ink-muted focus-visible:outline-olive-dark w-full rounded-lg border-0 bg-gray-100 py-3 pr-4 pl-11 text-sm focus-visible:outline-2"
          />
          <button type="submit" className="sr-only">
            {dict.searchAction}
          </button>
        </div>
      </form>

      <div
        role="group"
        aria-label={dict.categoryGroup}
        className="scrollbar-hide -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6"
      >
        {INGREDIENT_CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => onCategoryChange(item)}
            className={cn(
              "min-h-11 min-w-11 flex-none cursor-pointer rounded-md px-3 py-2 text-sm transition-colors",
              category === item
                ? "bg-ink font-semibold text-white"
                : "text-ink-sub bg-gray-100 hover:bg-gray-200"
            )}
          >
            {localize(item, "ingredientCategory")}
          </button>
        ))}
      </div>
    </>
  );
};
