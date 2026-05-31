"use client";

import { useState } from "react";

import { InfiniteData } from "@tanstack/react-query";
import { Search, X } from "lucide-react";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import useSearch from "@/shared/hooks/useSearch";
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
  title = "재료 추가",
  categories,
  initialCategory,
  queryConfig,
  isAlreadyAdded,
  onComplete,
}: IngredientPickerProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory ?? categories[0] ?? ""
  );
  const { selectedItems, isSelected, toggle, remove, clear } =
    useIngredientSelection();
  const { searchQuery, inputValue, handleSearchSubmit, handleInputChange } =
    useSearch();

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
      <DrawerContent className="h-[100dvh] max-h-[100dvh] rounded-none">
        <header className="relative flex items-center justify-center border-b border-gray-100 px-4 py-3">
          <DrawerClose
            aria-label="닫기"
            className="absolute left-3 cursor-pointer text-gray-700"
          >
            <X size={24} />
          </DrawerClose>
          <DrawerTitle className="text-base font-bold text-gray-900">
            {title}
          </DrawerTitle>
        </header>

        <form onSubmit={handleSearchSubmit} className="px-4 pt-3">
          <div className="relative">
            <input
              type="text"
              placeholder="재료 이름을 검색하세요"
              className="focus:border-olive-light focus:ring-olive-light w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:ring-1 focus:outline-none"
              value={inputValue}
              onChange={handleInputChange}
            />
            <button type="submit" aria-label="검색">
              <Search
                size={18}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              />
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
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isPending ? (
            <p className="text-center text-gray-500">재료 로딩 중...</p>
          ) : status === "error" ? (
            <p className="text-center text-red-500">
              오류 발생:{" "}
              {error instanceof Error ? error.message : "알 수 없는 오류"}
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
                  <p className="text-sm text-gray-400">
                    모든 재료를 불러왔습니다.
                  </p>
                )}
              </div>
              {data?.pages[0]?.content?.length === 0 && !isFetching && (
                <p className="py-10 text-center text-gray-500">
                  &quot;{searchQuery || selectedCategory}&quot;에 해당하는 재료가
                  없습니다.
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
