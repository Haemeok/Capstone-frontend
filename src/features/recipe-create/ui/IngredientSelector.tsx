"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { InfiniteData } from "@tanstack/react-query";
import { Search } from "lucide-react";

import {
  INGREDIENT_CATEGORIES_NEW_RECIPE,
  type RecipeCreateCategoryTab,
} from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import useSearch from "@/shared/hooks/useSearch";
import { format, useRecipeFormDict } from "@/shared/i18n";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { cn } from "@/shared/lib/utils";
import { getNextPageParam } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/shadcn/button";

import { getIngredients, IngredientsApiResponse } from "@/entities/ingredient";
import { IngredientItem } from "@/entities/ingredient";

import IngredientListItem from "./IngredientListItem";

type BaseIngredientPayload = {
  id?: string;
  name: string;
};

type IngredientSelectorProps<T extends BaseIngredientPayload> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIngredientSelect: (ingredient: T) => void;
  addedIngredientNames: Set<string>;
  mapIngredientToPayload: (ingredient: IngredientItem) => T;
};

const IngredientSelector = <T extends BaseIngredientPayload>({
  open,
  onOpenChange,
  onIngredientSelect,
  addedIngredientNames,
  mapIngredientToPayload,
}: IngredientSelectorProps<T>) => {
  const [selectedCategory, setSelectedCategory] =
    useState<RecipeCreateCategoryTab>("전체");
  const [localAddedNames, setLocalAddedNames] = useState<Set<string>>(
    new Set(addedIngredientNames)
  );

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- deferred to #124
      setLocalAddedNames(new Set(addedIngredientNames));
    }
  }, [open, addedIngredientNames]);

  const { searchQuery, inputValue, handleSearchSubmit, handleInputChange } =
    useSearch();
  const { ui } = useRecipeFormDict();
  const { localize } = useTaxonomy();

  const categoryLabel = (category: string) =>
    category === "나의 재료"
      ? ui.myIngredients
      : localize(category, "ingredientCategory");

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
          category: selectedCategory === "나의 재료" ? null : selectedCategory,
          q: searchQuery,
          pageParam,
          isMine: selectedCategory === "나의 재료",
        }),
      getNextPageParam: getNextPageParam,
      initialPageParam: 0,
    });

  const handleCategoryClick = (category: RecipeCreateCategoryTab) => {
    setSelectedCategory(category);
  };

  const handleAddClick = useCallback(
    (ingredient: IngredientItem) => {
      const payload = mapIngredientToPayload(ingredient);
      onIngredientSelect(payload);
      setLocalAddedNames((prevNames: Set<string>) =>
        new Set(prevNames).add(ingredient.name)
      );
    },
    [onIngredientSelect, mapIngredientToPayload]
  );

  const ingredientItems = useMemo(
    () => data?.pages.flatMap((page) => page.content),
    [data?.pages]
  );
  const { Container, Content, Header, Title, Description, Footer, Close } =
    useResponsiveSheet();

  return (
    <Container open={open} onOpenChange={onOpenChange}>
      <Content className="flex w-full flex-col md:max-w-2xl">
        <Header>
          <Title className="text-xl">{ui.ingredientSearchTitle}</Title>
          <Description className="text-md">
            {ui.ingredientSearchDescription}
          </Description>
        </Header>

        <div className="bg-white">
          <form onSubmit={handleSearchSubmit} className="relative px-4">
            <input
              type="text"
              placeholder={ui.ingredientSearchPlaceholder}
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
          <div className="scrollbar-hide mt-3 flex overflow-x-auto px-2 pb-3">
            {INGREDIENT_CATEGORIES_NEW_RECIPE.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={cn(
                  "flex-shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors",
                  selectedCategory === category
                    ? "bg-olive-light font-medium text-white"
                    : "text-ink-muted hover:text-ink hover:bg-gray-100"
                )}
              >
                {categoryLabel(category)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex h-120 flex-col justify-start overflow-y-auto p-4">
          {isPending ? (
            <p className="text-ink-muted text-center">{ui.ingredientLoading}</p>
          ) : status === "error" ? (
            <p className="text-center text-red-500">
              {format(ui.ingredientLoadError, {
                message:
                  error instanceof Error ? error.message : ui.unknownError,
              })}
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
                    {ui.allIngredientsLoaded}
                  </p>
                )}
              </div>
              {data?.pages[0]?.content?.length === 0 && !isFetching && (
                <p className="text-ink-muted py-10 text-center">
                  {format(ui.ingredientNoResults, {
                    query: searchQuery || selectedCategory,
                  })}
                </p>
              )}
            </div>
          )}
        </div>
        <Footer className="mt-auto p-4">
          {Close ? (
            <Close asChild>
              <Button variant="outline" className="w-full cursor-pointer">
                {ui.close}
              </Button>
            </Close>
          ) : (
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              {ui.close}
            </Button>
          )}
        </Footer>
      </Content>
    </Container>
  );
};

export default IngredientSelector;
