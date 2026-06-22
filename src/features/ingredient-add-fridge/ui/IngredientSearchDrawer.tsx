"use client";

import React, { useEffect, useRef, useState } from "react";

import { InfiniteData } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { INGREDIENT_CATEGORIES } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import useSearch from "@/shared/hooks/useSearch";
import { format, useIngredientAddDict } from "@/shared/i18n";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
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
  const dict = useIngredientAddDict();
  const { localize } = useTaxonomy();

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
          <Title className="text-ink text-base font-bold">
            {dict.drawerTitle}
          </Title>
          <Description className="text-ink-muted text-sm">
            {dict.drawerDescription}
          </Description>
        </Header>

        <div className="bg-white">
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
                placeholder={dict.searchPlaceholder}
                className="text-ink placeholder:text-ink-muted w-full rounded-full border-0 bg-gray-100 py-3 pr-4 pl-11 text-sm focus:outline-none"
                value={inputValue}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                aria-label={dict.searchAria}
                className="sr-only"
              >
                {dict.searchAction}
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
                    : "text-ink-sub bg-gray-100 hover:bg-gray-200"
                )}
              >
                {localize(category, "ingredientCategory")}
              </button>
            ))}
          </div>
        </div>
        <div
          ref={scrollContainerRef}
          className="flex h-120 flex-col overflow-y-auto px-4 pt-1 pb-4"
        >
          {isPending ? (
            <p className="text-ink-muted py-10 text-center text-sm">
              {dict.loading}
            </p>
          ) : status === "error" ? (
            <p className="text-ink-muted py-10 text-center text-sm">
              {format(dict.errorPrefix, {
                message: error instanceof Error ? error.message : "",
              })}
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
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-ink text-sm font-medium">
                        {ingredient.name}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={cn(
                        "h-9 rounded-full px-4 text-xs font-semibold transition-colors",
                        isAdded
                          ? "text-ink-sub bg-gray-100 active:bg-gray-200"
                          : "bg-olive-light active:bg-olive-dark text-white"
                      )}
                      onClick={() =>
                        handleAddRemoveClick(ingredient.id, isAdded)
                      }
                    >
                      {isAdded ? dict.added : dict.add}
                    </Button>
                  </div>
                );
              })}
              <div ref={ref} className="h-10 text-center">
                {!hasNextPage && data?.pages[0]?.content?.length > 0 && (
                  <p className="py-2 text-xs text-gray-400">{dict.allLoaded}</p>
                )}
              </div>
              {data?.pages[0]?.content?.length === 0 && !isFetching && (
                <p className="text-ink-muted py-10 text-center text-sm">
                  {format(dict.noResults, {
                    query:
                      searchQuery ||
                      localize(selectedCategory, "ingredientCategory"),
                  })}
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
                className="text-ink h-11 w-full rounded-xl bg-gray-100 text-sm font-semibold active:bg-gray-200"
              >
                {dict.close}
              </Button>
            </Close>
          ) : (
            <Button
              variant="ghost"
              className="text-ink h-11 w-full rounded-xl bg-gray-100 text-sm font-semibold active:bg-gray-200"
              onClick={() => onOpenChange(false)}
            >
              {dict.close}
            </Button>
          )}
        </Footer>
      </Content>
    </Container>
  );
};

export default IngredientSearchDrawer;
