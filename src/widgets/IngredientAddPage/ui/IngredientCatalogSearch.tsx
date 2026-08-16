import type { ChangeEventHandler, FormEventHandler } from "react";

import { Search } from "lucide-react";

import { useIngredientAddDict } from "@/shared/i18n";

type IngredientCatalogSearchProps = {
  inputValue: string;
  onInputChange: ChangeEventHandler<HTMLInputElement>;
  onSearchSubmit: FormEventHandler<HTMLFormElement>;
};

export const IngredientCatalogSearch = ({
  inputValue,
  onInputChange,
  onSearchSubmit,
}: IngredientCatalogSearchProps) => {
  const dict = useIngredientAddDict();

  return (
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
          className="text-ink placeholder:text-ink-muted focus-visible:outline-ink w-full rounded-lg border-0 bg-gray-100 py-3 pr-4 pl-11 text-sm focus-visible:outline-2"
        />
      </div>
    </form>
  );
};
