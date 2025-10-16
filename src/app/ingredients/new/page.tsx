"use client";

import React, { useEffect, useRef, useState } from "react";

import { InfiniteData } from "@tanstack/react-query";
import gsap from "gsap";
import { Search } from "lucide-react";

import { INGREDIENT_CATEGORIES } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import useSearch from "@/shared/hooks/useSearch";
import { cn } from "@/shared/lib/utils";
import { getNextPageParam } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";
import PrevButton from "@/shared/ui/PrevButton";
import { Button } from "@/shared/ui/shadcn/button";
import { Checkbox } from "@/shared/ui/shadcn/checkbox";

import {
  getIngredients,
  type IngredientsApiResponse,
} from "@/entities/ingredient";

import {
  useAddIngredientBulkMutation,
  useAddIngredientMutation,
} from "@/features/ingredient-add-fridge";
import { useDeleteIngredientMutation } from "@/features/ingredient-delete-fridge";

const NewIngredientsPage = () => {
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [sort] = useState<"asc" | "desc">("asc");
  const [bulkSelectedIds, setBulkSelectedIds] = useState<Set<number>>(
    new Set()
  );

  const { searchQuery, inputValue, handleInputChange } = useSearch();

  const {
    data,
    error,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isPending,
    ref: infiniteScrollTriggerRef,
  } = useInfiniteScroll<
    IngredientsApiResponse,
    Error,
    InfiniteData<IngredientsApiResponse>,
    [string, string, string, "asc" | "desc"],
    number
  >({
    queryKey: ["ingredients", selectedCategory, searchQuery, sort],
    queryFn: ({ pageParam }) =>
      getIngredients({
        category: selectedCategory === "전체" ? null : selectedCategory,
        q: searchQuery,
        pageParam,
        sort,
        isMine: false,
        isFridge: true,
      }),
    getNextPageParam: getNextPageParam,
    initialPageParam: 0,
  });

  const ingredientItems = data?.pages.flatMap((page) => page.content);

  const pageContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
  const itemsAnimateTargetRef = useRef<HTMLDivElement | null>(null);

  const animatedItemsRef = useRef(new Set<Element>());

  const queryKeyString = JSON.stringify([
    "ingredients",
    selectedCategory,
    searchQuery,
    sort,
  ]);

  useEffect(() => {
    animatedItemsRef.current.clear();
  }, [queryKeyString]);

  useEffect(() => {
    if (
      isFetching ||
      !ingredientItems ||
      error ||
      isPending ||
      !itemsAnimateTargetRef.current ||
      !scrollableContainerRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const currentDOMItems = Array.from(
        itemsAnimateTargetRef.current!.children
      );
      const newTweenDelay = 0;

      currentDOMItems.forEach((itemDOMElement: Element) => {
        if (!animatedItemsRef.current.has(itemDOMElement)) {
          gsap.set(itemDOMElement, { opacity: 0, y: 30, scale: 0.98 });
          gsap.to(itemDOMElement, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            delay: newTweenDelay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: itemDOMElement,
              scroller: scrollableContainerRef.current,
              start: "top 95%",
              toggleActions: "play none none none",
              onEnter: () => {
                animatedItemsRef.current.add(itemDOMElement);
              },
            },
          });
        }
      });
    }, pageContainerRef);
    return () => ctx.revert();
  }, [
    ingredientItems,
    isFetching,
    error,
    status,
    scrollableContainerRef,
    itemsAnimateTargetRef,
    pageContainerRef,
    queryKeyString,
  ]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleModeChange = (currentMode: "single" | "bulk") => {
    setMode(currentMode === "single" ? "bulk" : "single");
  };

  const handleCheckboxChange = (
    checked: boolean,
    id: number,
    isAdded: boolean
  ) => {
    if (isAdded) {
      return;
    }
    setBulkSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const { mutate: addIngredient } = useAddIngredientMutation([
    "ingredients",
    selectedCategory,
    searchQuery,
    sort,
  ]);
  const { mutate: deleteIngredient } = useDeleteIngredientMutation([
    "ingredients",
    selectedCategory,
    searchQuery,
    sort,
  ]);
  const { mutate: addIngredientBulk } = useAddIngredientBulkMutation();

  const handleSingleAddRemove = (id: number, isAdded: boolean) => {
    if (isAdded) {
      deleteIngredient(id);
    } else {
      addIngredient(id);
    }
  };

  const handleBulkAdd = () => {
    addIngredientBulk(Array.from(bulkSelectedIds));
    setBulkSelectedIds(new Set());
  };

  return (
    <div ref={pageContainerRef} className="flex h-screen flex-col pb-20">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex justify-between px-4 py-2">
          <PrevButton />
          <h2 className="text-xl font-bold flex items-center">재료 추가</h2>
          <button
            className="flex items-center bg-olive-light text-white rounded-full px-4 py-2"
            onClick={() => handleModeChange(mode)}
          >
            <p className="text-sm ">
              {mode === "single" ? "한개씩" : "여러개"}
            </p>
          </button>
        </div>
        <div className="px-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="재료 이름을 검색하세요"
              className="focus:border-olive-light focus:ring-olive-light w-full rounded-md border border-gray-300 bg-gray-50 py-2 pr-4 pl-10 focus:ring-1 focus:outline-none"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="scrollbar-hide  flex overflow-x-auto px-2  mt-1">
          {INGREDIENT_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "flex-shrink-0 px-3 py-3 text-sm",
                selectedCategory === category
                  ? "text-olive-light font-bold"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4" ref={scrollableContainerRef}>
        {isPending && (!ingredientItems || ingredientItems.length === 0) ? (
          <p className="pt-10 text-center text-gray-500">
            재료를 불러오는 중...
          </p>
        ) : status === "error" ? (
          <p className="pt-10 text-center text-red-500">
            오류 발생:{" "}
            {error instanceof Error ? error.message : "알 수 없는 오류"}
          </p>
        ) : (
          <div className="space-y-3" ref={itemsAnimateTargetRef}>
            {ingredientItems?.length === 0 && !isFetching && (
              <p className="pt-10 text-center text-gray-500">
                "
                {searchQuery ||
                  (selectedCategory !== "전체"
                    ? selectedCategory
                    : "모든 카테고리")}
                "에 해당하는 재료가 없습니다.
              </p>
            )}
            {ingredientItems?.map((ingredient) => {
              const isAdded = ingredient.inFridge;
              const isBulkSelected = bulkSelectedIds.has(ingredient.id);

              return (
                <div
                  key={ingredient.id}
                  className={cn(
                    "flex items-center rounded-lg bg-white p-3 shadow-sm transition-colors",
                    mode === "bulk" && "cursor-pointer",
                    mode === "bulk" && isBulkSelected && "bg-olive-mint/20"
                  )}
                  onClick={
                    mode === "bulk"
                      ? () =>
                          handleCheckboxChange(
                            !isBulkSelected,
                            ingredient.id,
                            isAdded
                          )
                      : undefined
                  }
                >
                  <div className="mr-3 h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={ingredient.imageUrl ?? ""}
                      alt={ingredient.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {ingredient.name}
                    </p>
                  </div>

                  {mode === "single" ? (
                    <Button
                      size="sm"
                      variant={isAdded ? "outline" : "default"}
                      className={cn(
                        "rounded-full px-4 py-2 text-xs font-bold",
                        isAdded
                          ? " text-rose-600 hover:bg-red-50 hover:text-red-600"
                          : "bg-olive-light hover:bg-olive-dark text-white"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSingleAddRemove(ingredient.id, isAdded);
                      }}
                    >
                      {isAdded ? "삭제" : "추가"}
                    </Button>
                  ) : !isAdded ? (
                    <Checkbox
                      id={`ingredient-${ingredient.id}`}
                      checked={isBulkSelected}
                      className="h-5 w-5 rounded border-gray-300 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center rounded border-gray-300">
                      <p className="text-sm text-slate-400">보유중</p>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={infiniteScrollTriggerRef} className="h-10" />{" "}
            {isFetchingNextPage && (
              <p className="py-3 text-center text-sm text-gray-500">
                더 많은 재료를 불러오는 중...
              </p>
            )}
            {!isFetchingNextPage &&
              !hasNextPage &&
              ingredientItems &&
              ingredientItems.length > 0 && (
                <p className="py-3 text-center text-sm text-gray-400">
                  모든 재료를 불러왔습니다.
                </p>
              )}
          </div>
        )}
      </div>

      {mode === "bulk" && (
        <Button
          onClick={handleBulkAdd}
          disabled={bulkSelectedIds.size === 0 || isFetching}
          className="bg-olive-mint fixed bottom-20 left-1/2 -translate-x-1/2 rounded-lg py-3 text-base font-bold text-white shadow disabled:bg-gray-300 disabled:opacity-70"
        >
          {bulkSelectedIds.size > 0
            ? `${bulkSelectedIds.size}개 선택 완료`
            : "추가할 재료 선택"}
        </Button>
      )}
    </div>
  );
};

export default NewIngredientsPage;
