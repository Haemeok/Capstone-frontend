"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { InfiniteData } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { INGREDIENT_CATEGORIES_NEW_RECIPE } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import useSearch from "@/shared/hooks/useSearch";
import { cn } from "@/shared/lib/utils";
import { getNextPageParam } from "@/shared/lib/utils";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { Button } from "@/shared/ui/shadcn/button";

import { getIngredients, IngredientsApiResponse } from "@/entities/ingredient";
import { IngredientItem, IngredientPayload } from "@/entities/ingredient";

import IngredientListItem from "./IngredientListItem";

type IngredientSelectorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIngredientSelect: (ingredient: IngredientPayload) => void;
  addedIngredientNames: Set<string>;
};

const IngredientSelector = ({
  open,
  onOpenChange,
  onIngredientSelect,
  addedIngredientNames,
}: IngredientSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [localAddedNames, setLocalAddedNames] = useState<Set<string>>(
    new Set(addedIngredientNames)
  );

  useEffect(() => {
    if (open) {
      setLocalAddedNames(new Set(addedIngredientNames));
    }
  }, [open, addedIngredientNames]);

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

  const handleAddClick = useCallback(
    (ingredient: IngredientItem) => {
      onIngredientSelect({
        name: ingredient.name,
        quantity: "",
        unit: ingredient.unit,
      });
      setLocalAddedNames((prevNames: Set<string>) =>
        new Set(prevNames).add(ingredient.name)
      );
    },
    [onIngredientSelect]
  );

  const ingredientItems = useMemo(
    () => data?.pages.flatMap((page) => page.content),
    [data?.pages]
  );
  const { Container, Content, Header, Title, Description, Footer, Close } =
    useResponsiveSheet();

  return (
    <Container open={open} onOpenChange={onOpenChange}>
      <Content className="flex w-full flex-col sm:max-w-lg md:max-w-2xl">
        <Header>
          <Title className="text-xl">재료 검색 및 추가</Title>
          <Description className="text-md">
            레시피에 사용할 재료를 검색하고 추가하세요.
          </Description>
        </Header>

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
                <IngredientListItem
                  key={ingredient.id}
                  ingredient={ingredient}
                  isAdded={localAddedNames.has(ingredient.name)}
                  onAddClick={handleAddClick}
                />
              ))}
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

export default IngredientSelector;
