"use client";

import { useEffect, useRef, useState } from "react";

import { InfiniteData } from "@tanstack/react-query";
import { Search, X } from "lucide-react";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import useSearch from "@/shared/hooks/useSearch";
import { format, useApiLocale, useIngredientPickerDict } from "@/shared/i18n";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { cn, getNextPageParam } from "@/shared/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/shared/ui/shadcn/drawer";

import { getIngredients } from "@/entities/ingredient/model/api";
import type {
  IngredientItem,
  IngredientsApiResponse,
} from "@/entities/ingredient/model/types";

import IngredientPickerCard from "./IngredientPickerCard";
import IngredientSelectionTray from "./IngredientSelectionTray";
import { useIngredientSelection } from "./useIngredientSelection";

export type IngredientPickerQueryConfig = {
  keyBase: string;
  getParams: (category: string) => {
    category: string | null;
    isMine: boolean;
    isFridge?: boolean;
  };
};

type IngredientPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  categories: string[];
  initialCategory?: string;
  queryConfig: IngredientPickerQueryConfig;
  isAlreadyAdded: (ingredient: IngredientItem) => boolean;
  onComplete: (selected: IngredientItem[]) => void;
};

const IngredientPicker = ({
  open,
  onOpenChange,
  title,
  categories,
  initialCategory,
  queryConfig,
  isAlreadyAdded,
  onComplete,
}: IngredientPickerProps) => {
  const t = useIngredientPickerDict();
  const { localize } = useTaxonomy();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory ?? categories[0] ?? ""
  );
  const { selectedItems, isSelected, toggle, remove, clear } =
    useIngredientSelection();
  const { searchQuery, inputValue, handleSearchSubmit, handleInputChange } =
    useSearch();
  const locale = useApiLocale();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 120);
    return () => clearTimeout(timer);
  }, [open]);

  const { data, error, hasNextPage, isFetching, status, isPending, ref } =
    useInfiniteScroll<
      IngredientsApiResponse,
      Error,
      InfiniteData<IngredientsApiResponse>,
      [string, string, string],
      number
    >({
      queryKey: [queryConfig.keyBase, selectedCategory, searchQuery],
      queryFn: ({ pageParam = 0 }) =>
        getIngredients({
          ...queryConfig.getParams(selectedCategory),
          q: searchQuery,
          pageParam,
          lang: locale,
        }),
      getNextPageParam,
      initialPageParam: 0,
    });

  const handleOpenChange = (next: boolean) => {
    if (!next) clear();
    onOpenChange(next);
  };

  const handleComplete = () => {
    onComplete(selectedItems);
    clear();
    onOpenChange(false);
  };

  const ingredientItems = data?.pages.flatMap((page) => page.content);

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent variant="full">
        <header className="relative flex items-center justify-center border-b border-gray-100 px-4 py-3">
          <DrawerClose
            aria-label={t.closeAria}
            className="text-ink-sub absolute left-3 cursor-pointer"
          >
            <X size={24} />
          </DrawerClose>
          <DrawerTitle className="text-ink text-base font-bold">
            {title ?? t.title}
          </DrawerTitle>
        </header>

        <form onSubmit={handleSearchSubmit} className="px-4 pt-3">
          <div className="relative">
            <Search
              size={18}
              className="text-ink-muted pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder={t.searchPlaceholder}
              className="text-ink placeholder:text-ink-muted w-full rounded-full border-0 bg-gray-100 py-3 pr-4 pl-11 text-sm focus:outline-none"
              value={inputValue}
              onChange={handleInputChange}
            />
            <button type="submit" aria-label={t.searchAria} className="sr-only">
              {t.searchAction}
            </button>
          </div>
        </form>

        <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto px-4 pb-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "flex-shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors",
                selectedCategory === category
                  ? "bg-gray-900 font-medium text-white"
                  : "text-ink-sub bg-gray-100 hover:bg-gray-200"
              )}
            >
              {category === "나의 재료"
                ? t.myIngredients
                : localize(category, "ingredientCategory")}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isPending ? (
            <p className="text-ink-muted text-center">{t.loading}</p>
          ) : status === "error" ? (
            <p className="text-center text-red-500">
              {format(t.errorPrefix, {
                message:
                  error instanceof Error ? error.message : t.unknownError,
              })}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                {ingredientItems?.map((ingredient) => (
                  <IngredientPickerCard
                    key={ingredient.id}
                    ingredient={ingredient}
                    isSelected={isSelected(ingredient.id)}
                    isAlreadyAdded={isAlreadyAdded(ingredient)}
                    onToggle={toggle}
                  />
                ))}
              </div>
              <div ref={ref} className="h-10 text-center">
                {!hasNextPage && (data?.pages[0]?.content?.length ?? 0) > 0 && (
                  <p className="text-sm text-gray-400">{t.allLoaded}</p>
                )}
              </div>
              {data?.pages[0]?.content?.length === 0 && !isFetching && (
                <p className="text-ink-muted py-10 text-center">
                  {format(t.noResults, {
                    query:
                      searchQuery ||
                      (selectedCategory === "나의 재료"
                        ? t.myIngredients
                        : localize(selectedCategory, "ingredientCategory")),
                  })}
                </p>
              )}
            </>
          )}
        </div>

        <IngredientSelectionTray
          items={selectedItems}
          onRemove={remove}
          onComplete={handleComplete}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default IngredientPicker;
