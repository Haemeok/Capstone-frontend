"use client";

import React, { useEffect, useRef, useState } from "react";

import { InfiniteData } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { INGREDIENT_CATEGORIES } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import useSearch from "@/shared/hooks/useSearch";
import { cn } from "@/shared/lib/utils";
import { getNextPageParam } from "@/shared/lib/utils";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { Image } from "@/shared/ui/image/Image";
import { Button } from "@/shared/ui/shadcn/button";

import { getIngredients, IngredientsApiResponse } from "@/entities/ingredient";

import { useAddIngredientMutation } from "@/features/ingredient-add-fridge";
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
      queryKey: ["fridgeIngredients", selectedCategory, searchQuery],
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

  const { mutate: addIngredient } = useAddIngredientMutation([
    "fridgeIngredients",
    selectedCategory,
    searchQuery,
  ]);

  const { mutate: deleteIngredient } = useDeleteIngredientMutation([
    "fridgeIngredients",
    selectedCategory,
    searchQuery,
  ]);

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
      <Content className="flex w-full flex-col sm:max-w-lg md:max-w-2xl">
        <Header>
          <Title className="text-xl">재료 검색 및 추가</Title>
          <Description className="text-md">
            냉장고에 추가할 재료를 검색하고 추가하세요.
          </Description>
        </Header>

        <div className="bg-white">
          <form onSubmit={handleSearchSubmit} className="relative px-4">
            <input
              type="text"
              placeholder="재료 이름을 검색하세요"
              className="focus:border-olive-light focus:ring-olive-light w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:ring-1 focus:outline-none"
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
            {INGREDIENT_CATEGORIES.map((category) => (
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
        <div
          ref={scrollContainerRef}
          className="flex h-120 flex-col justify-center overflow-y-auto p-4"
        >
          {isPending ? (
            <p className="text-center text-gray-500">재료 로딩 중...</p>
          ) : status === "error" ? (
            <p className="text-center text-red-500">
              오류 발생:{" "}
              {error instanceof Error ? error.message : "알 수 없는 오류"}
            </p>
          ) : (
            <div className="h-full space-y-2">
              {ingredientItems?.map((ingredient) => {
                const isAdded = ingredient.inFridge;

                return (
                  <div
                    key={ingredient.id}
                    className="flex items-center rounded-lg border bg-white p-2 pr-3 shadow-sm"
                  >
                    <div className="relative mr-3 h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
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
                    <Button
                      size="sm"
                      variant={isAdded ? "outline" : "default"}
                      className={cn(
                        "rounded-full px-4 py-2 text-xs font-bold",
                        isAdded
                          ? "text-rose-600 hover:bg-red-50 hover:text-red-600"
                          : "bg-olive-light hover:bg-olive-dark text-white"
                      )}
                      onClick={() =>
                        handleAddRemoveClick(ingredient.id, isAdded)
                      }
                    >
                      {isAdded ? "삭제" : "추가"}
                    </Button>
                  </div>
                );
              })}
              <div ref={ref} className="h-10 text-center">
                {!hasNextPage && data?.pages[0]?.content?.length > 0 && (
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
        <Footer className="mt-auto p-4">
          {Close ? (
            <Close asChild>
              <Button variant="outline" className="w-full">
                닫기
              </Button>
            </Close>
          ) : (
            <Button
              variant="outline"
              className="w-full"
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
