"use client";

import { Plus, Search } from "lucide-react";

import { LocalizedLink } from "@/shared/i18n/LocalizedLink";
import { useIngredientsDict } from "@/shared/i18n/useIngredientsDict";

export const IngredientAddEntry = () => {
  const t = useIngredientsDict();

  return (
    <div className="px-5 pb-3 md:px-6">
      <LocalizedLink
        href="/ingredients/new"
        prefetch={false}
        className="text-ink-muted focus-visible:ring-olive-light flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-full bg-gray-100 px-4 py-3 text-sm leading-5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:bg-gray-200"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1">{t.addEntry}</span>
        <Plus className="text-olive-dark h-5 w-5 shrink-0" aria-hidden />
      </LocalizedLink>
    </div>
  );
};
