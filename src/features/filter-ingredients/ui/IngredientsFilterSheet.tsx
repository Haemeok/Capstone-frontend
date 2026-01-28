"use client";

import { useState, useRef, useEffect } from "react";

import { InfiniteData } from "@tanstack/react-query";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import useSearch from "@/shared/hooks/useSearch";
import { getNextPageParam } from "@/shared/lib/utils";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Button } from "@/shared/ui/shadcn/button";

import { getIngredients, IngredientsApiResponse } from "@/entities/ingredient";

import { useIngredientsFilter } from "../model/useIngredientsFilter";
import { useIngredientSelection } from "../model/useIngredientSelection";
import { IngredientSearchInput } from "./IngredientSearchInput";
import { IngredientCategoryTabs } from "./IngredientCategoryTabs";
import { SelectedIngredientChips } from "./SelectedIngredientChips";
import { IngredientGrid } from "./IngredientGrid";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const IngredientsFilterSheet = ({ open, onOpenChange }: Props) => {
  const [savedIngredients, setSavedIngredients] = useIngredientsFilter();
  const selection = useIngredientSelection();
  const [category, setCategory] = useState("전체");
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const { searchQuery, inputValue, handleSearchSubmit, handleInputChange } =
    useSearch();

  // open 변경 시에만 초기화
  useEffect(() => {
    if (open && !hasInitialized.current) {
      hasInitialized.current = true;
      selection.initFromIds(savedIngredients);
    }
    if (!open) {
      hasInitialized.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const { data, isPending, ref } = useInfiniteScroll<
    IngredientsApiResponse,
    Error,
    InfiniteData<IngredientsApiResponse>,
    [string, string, string],
    number
  >({
    queryKey: ["filterIngredients", category, searchQuery],
    queryFn: ({ pageParam = 0 }) =>
      getIngredients({
        category: category === "전체" ? null : category,
        q: searchQuery,
        pageParam,
        isMine: false,
        isFridge: false,
      }),
    getNextPageParam,
    initialPageParam: 0,
  });

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [category, searchQuery]);

  const items = data?.pages.flatMap((page) => page.content) ?? [];

  const handleApply = () => {
    triggerHaptic("Success");
    setSavedIngredients(selection.selectedIds);
    onOpenChange(false);
  };

  const { Container, Content, Header, Title, Description, Footer, Close } =
    useResponsiveSheet();

  return (
    <Container open={open} onOpenChange={onOpenChange}>
      <Content className="flex h-[85vh] w-full flex-col sm:h-auto sm:max-h-[80vh] sm:max-w-lg md:max-w-2xl">
        <Header className="flex-shrink-0 px-6 pt-6 pb-4">
          <Title className="text-xl font-bold text-gray-900">
            재료로 검색하기
          </Title>
          <Description className="mt-1 text-sm text-gray-500">
            원하는 재료를 선택하면 해당 재료가 포함된 레시피를 찾아드려요
          </Description>
        </Header>

        <div className="flex-shrink-0 space-y-4 px-6">
          <IngredientSearchInput
            value={inputValue}
            onChange={handleInputChange}
            onSubmit={handleSearchSubmit}
          />
          <IngredientCategoryTabs selected={category} onSelect={setCategory} />
          <SelectedIngredientChips
            items={selection.selected}
            onRemove={selection.remove}
          />
        </div>

        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-6 pt-3"
        >
          <IngredientGrid
            items={items}
            isSelected={selection.isSelected}
            onToggle={selection.toggle}
            loadMoreRef={ref}
            isPending={isPending}
          />
        </div>

        <Footer className="flex flex-shrink-0 gap-3 border-t border-gray-100 px-6 py-4">
          {selection.selected.length > 0 ? (
            <Button
              variant="outline"
              onClick={selection.reset}
              className="h-12 flex-1 cursor-pointer rounded-xl text-base font-medium"
            >
              초기화
            </Button>
          ) : Close ? (
            <Close asChild>
              <Button
                variant="outline"
                className="h-12 flex-1 cursor-pointer rounded-xl text-base font-medium"
              >
                닫기
              </Button>
            </Close>
          ) : (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-12 flex-1 cursor-pointer rounded-xl text-base font-medium"
            >
              닫기
            </Button>
          )}
          <Button
            onClick={handleApply}
            className="h-12 flex-1 cursor-pointer rounded-xl border-2 border-olive-light bg-white text-base font-bold text-olive-light hover:bg-olive-light/5"
          >
            {selection.selected.length}개로 탐색
          </Button>
        </Footer>
      </Content>
    </Container>
  );
};
