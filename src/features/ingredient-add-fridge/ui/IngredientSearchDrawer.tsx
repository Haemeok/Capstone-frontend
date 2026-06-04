"use client";

import React, { useEffect, useRef, useState } from "react";

import { InfiniteData } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { INGREDIENT_CATEGORIES } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import useSearch from "@/shared/hooks/useSearch";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { cn } from "@/shared/lib/utils";
import { getNextPageParam } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";
import { Button } from "@/shared/ui/shadcn/button";

import { getIngredients, IngredientsApiResponse } from "@/entities/ingredient";
import { INGREDIENT_QUERY_KEYS } from "@/entities/ingredient/model/queryKeys";

import { useAddIngredientMutation } from "@/features/ingredient-add-fridge/model/hooks";
import { useDeleteIngredientMutation } from "@/features/ingredient-delete-fridge";

type IngredientSearchDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const IngredientSearchDrawer = ({
  open,
  onOpenChange,
}: IngredientSearchDrawerProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { searchQuery, inputValue, handleSearchSubmit, handleInputChange } =
    useSearch();

  const { data, error, hasNextPage, isFetching, status, isPending, ref } =
    useInfiniteScroll<
      IngredientsApiResponse,
      Error,
      InfiniteData<IngredientsApiResponse>,
      readonly ["fridgeIngredients", string, string],
      number
    >({
      queryKey: INGREDIENT_QUERY_KEYS.browse(selectedCategory, searchQuery),
      queryFn: ({ pageParam = 0 }) =>
        getIngredients({
          category: selectedCategory === "전체" ? null : selectedCategory,
          q: searchQuery,
          pageParam,
          isMine: false,
          isFridge: true,
        }),
      getNextPageParam: getNextPageParam,
      initialPageParam: 0,
    });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 120);
    return () => clearTimeout(timer);
  }, [open]);

  const { mutate: addIngredient } = useAddIngredientMutation({
    category: selectedCategory,
    q: searchQuery,
  });

  const { mutate: deleteIngredient } = useDeleteIngredientMutation({
    category: selectedCategory,
    q: searchQuery,
  });

  const handleAddRemoveClick = (id: string, isAdded: boolean) => {
    if (isAdded) {
      deleteIngredient(id);
    } else {
      addIngredient(id);
    }
  };

  const ingredientItems = data?.pages.flatMap((page) => page.content);
  const { Container, Content, Header, Title, Description, Footer, Close } =
    useResponsiveSheet();

  return (
    <Container open={open} onOpenChange={onOpenChange}>
      <Content className="flex w-full flex-col md:max-w-2xl">
        <Header>
          <Title className="text-base font-bold text-gray-900">재료 추가</Title>
          <Description className="text-sm text-gray-500">
            냉장고에 추가할 재료를 검색하세요
          </Description>
        </Header>

        <div className="bg-white">
          <form onSubmit={handleSearchSubmit} className="px-4 pt-3">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="재료를 검색해서 추가하세요"
                className="w-full rounded-full border-0 bg-gray-100 py-3 pr-4 pl-11 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none"
                value={inputValue}
                onChange={handleInputChange}
              />
              <button type="submit" aria-label="검색" className="sr-only">
                검색
              </button>
            </div>
          </form>
          <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto px-4 pb-3">
            {INGREDIENT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
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
        </div>
        <div
          ref={scrollContainerRef}
          className="flex h-120 flex-col overflow-y-auto px-4 pt-1 pb-4"
        >
          {isPending ? (
            <p className="py-10 text-center text-sm text-gray-500">
              재료 로딩 중...
            </p>
          ) : status === "error" ? (
            <p className="py-10 text-center text-sm text-gray-500">
              오류가 발생했어요.{" "}
              {error instanceof Error ? error.message : ""}
            </p>
          ) : (
            <div className="space-y-1">
              {ingredientItems?.map((ingredient) => {
                const isAdded = ingredient.inFridge;

                return (
                  <div
                    key={ingredient.id}
                    className="flex items-center rounded-xl bg-white px-2 py-2 transition-colors active:bg-gray-50"
                  >
                    <div className="relative mr-3 h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
                      {ingredient.imageUrl && (
                        <Image
                          src={ingredient.imageUrl}
                          alt={ingredient.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {ingredient.name}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={cn(
                        "h-9 rounded-full px-4 text-xs font-semibold transition-colors",
                        isAdded
                          ? "bg-gray-100 text-gray-700 active:bg-gray-200"
                          : "bg-olive-light text-white active:bg-olive-dark"
                      )}
                      onClick={() =>
                        handleAddRemoveClick(ingredient.id, isAdded)
                      }
                    >
                      {isAdded ? "추가됨" : "추가"}
                    </Button>
                  </div>
                );
              })}
              <div ref={ref} className="h-10 text-center">
                {!hasNextPage && data?.pages[0]?.content?.length > 0 && (
                  <p className="py-2 text-xs text-gray-400">
                    모든 재료를 불러왔어요
                  </p>
                )}
              </div>
              {data?.pages[0]?.content?.length === 0 && !isFetching && (
                <p className="py-10 text-center text-sm text-gray-500">
                  &quot;{searchQuery || selectedCategory}&quot;에 해당하는
                  재료가 없어요
                </p>
              )}
            </div>
          )}
        </div>
        <Footer className="mt-auto border-t border-gray-100 p-4">
          {Close ? (
            <Close asChild>
              <Button
                variant="ghost"
                className="h-11 w-full rounded-xl bg-gray-100 text-sm font-semibold text-gray-900 active:bg-gray-200"
              >
                닫기
              </Button>
            </Close>
          ) : (
            <Button
              variant="ghost"
              className="h-11 w-full rounded-xl bg-gray-100 text-sm font-semibold text-gray-900 active:bg-gray-200"
              onClick={() => onOpenChange(false)}
            >
              닫기
            </Button>
          )}
        </Footer>
      </Content>
    </Container>
  );
};

export default IngredientSearchDrawer;
