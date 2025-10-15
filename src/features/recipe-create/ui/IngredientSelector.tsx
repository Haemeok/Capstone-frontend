"use client";

import React, { useState } from "react";

import { InfiniteData } from "@tanstack/react-query";
import { Check, Search } from "lucide-react";

import { INGREDIENT_CATEGORIES_NEW_RECIPE } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import useSearch from "@/shared/hooks/useSearch";
import { cn } from "@/shared/lib/utils";
import { getNextPageParam } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";
import { Button } from "@/shared/ui/shadcn/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/shadcn/drawer";

import { getIngredients, IngredientsApiResponse } from "@/entities/ingredient";
import { IngredientItem, IngredientPayload } from "@/entities/ingredient";

type IngredientSelectorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIngredientSelect: (ingredient: IngredientPayload) => void;
  ingredientIds: number[];
};

const IngredientSelector = ({
  open,
  onOpenChange,
  onIngredientSelect,
  ingredientIds,
}: IngredientSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("나의 재료");
  const [ingredientIdSet, setIngredientIdSet] = useState<Set<number>>(
    new Set(ingredientIds)
  );

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
      queryKey: ["drawerIngredients", selectedCategory, searchQuery],
      queryFn: ({ pageParam = 0 }) =>
        getIngredients({
          category: selectedCategory,
          q: searchQuery,
          pageParam,
          isMine: selectedCategory === "나의 재료" ? true : false,
        }),
      getNextPageParam: getNextPageParam,
      initialPageParam: 0,
    });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddClick = (ingredient: IngredientItem) => {
    onIngredientSelect({
      name: ingredient.name,
      quantity: "",
      unit: ingredient.unit,
    });
    setIngredientIdSet((prevIds: Set<number>) =>
      new Set(prevIds).add(ingredient.id)
    );
  };
  const ingredientItems = data?.pages.flatMap((page) => page.content);
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex w-full flex-col sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle className="text-xl">재료 검색 및 추가</DrawerTitle>
          <DrawerDescription className="text-md">
            레시피에 사용할 재료를 검색하고 추가하세요.
          </DrawerDescription>
        </DrawerHeader>

        <div className="bg-white">
          <form onSubmit={handleSearchSubmit} className="relative px-4">
            <input
              type="text"
              placeholder="재료 이름을 검색하세요"
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:outline-none"
              value={inputValue}
              onChange={handleInputChange}
            />
            <button type="submit">
              <Search
                size={18}
                className="absolute top-1/2 left-7 -translate-y-1/2 text-gray-400"
              />
            </button>
          </form>
          <div className="scrollbar-hide mt-3 flex overflow-x-auto px-2">
            {INGREDIENT_CATEGORIES_NEW_RECIPE.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={cn(
                  "flex-shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors",
                  selectedCategory === category
                    ? "bg-olive-light font-medium text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="flex h-120 flex-col justify-center overflow-y-auto p-4">
          {isPending ? (
            <p className="text-center text-gray-500">재료 로딩 중...</p>
          ) : status === "error" ? (
            <p className="text-center text-red-500">
              오류 발생:{" "}
              {error instanceof Error ? error.message : "알 수 없는 오류"}
            </p>
          ) : (
            <div className="h-full space-y-2">
              {ingredientItems?.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="flex items-center rounded-lg border bg-white p-3 shadow-sm"
                >
                  <div className="mr-3 h-12 w-12 flex-shrink-0 relative overflow-hidden rounded-lg bg-gray-100">
                    {ingredient.imageUrl && (
                      <Image
                        src={ingredient.imageUrl}
                        alt={ingredient.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{ingredient.name}</p>
                  </div>
                  {ingredientIdSet.has(ingredient.id) ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex items-center gap-1 text-gray-400"
                      disabled
                    >
                      <Check size={16} />
                      추가됨
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-olive-light text-olive-light hover:bg-olive-light hover:text-white"
                      onClick={() => handleAddClick(ingredient)}
                    >
                      추가
                    </Button>
                  )}
                </div>
              ))}
              <div ref={ref} className="h-10 text-center">
                {!hasNextPage && data?.pages[0]?.content?.length && (
                  <p className="text-sm text-gray-400">
                    모든 재료를 불러왔습니다.
                  </p>
                )}
              </div>
              {data?.pages[0]?.content?.length === 0 && !isFetching && (
                <p className="py-10 text-center text-gray-500">
                  "{searchQuery || selectedCategory}"에 해당하는 재료가
                  없습니다.
                </p>
              )}
            </div>
          )}
        </div>
        <DrawerFooter className="mt-auto p-4">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              닫기
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default IngredientSelector;
