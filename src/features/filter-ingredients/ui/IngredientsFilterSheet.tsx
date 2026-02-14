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

import { useIngredientSelection } from "../model/useIngredientSelection";
import { IngredientSearchInput } from "./IngredientSearchInput";
import { IngredientCategoryTabs } from "./IngredientCategoryTabs";
import { SelectedIngredientChips } from "./SelectedIngredientChips";
import { IngredientGrid } from "./IngredientGrid";

type SelectedIngredient = {
  id: string;
  name: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIngredients: SelectedIngredient[];
  onApply: (selectedIds: string[]) => void;
};

export const IngredientsFilterSheet = ({
  open,
  onOpenChange,
  initialIngredients,
  onApply,
}: Props) => {
  const { Container, Content, Header, Title, Description, Footer, Close } =
    useResponsiveSheet();

  return (
    <Container open={open} onOpenChange={onOpenChange}>
      <Content className="flex h-[85vh] w-full flex-col md:h-auto md:max-h-[80vh] md:max-w-2xl">
        {open && (
          <IngredientsFilterSheetContent
            key={initialIngredients.map((i) => i.id).join(",")}
            initialIngredients={initialIngredients}
            onApply={onApply}
            onClose={() => onOpenChange(false)}
            Header={Header}
            Title={Title}
            Description={Description}
            Footer={Footer}
            Close={Close}
          />
        )}
      </Content>
    </Container>
  );
};

type ContentProps = {
  initialIngredients: SelectedIngredient[];
  onApply: (selectedIds: string[]) => void;
  onClose: () => void;
  Header: ReturnType<typeof useResponsiveSheet>["Header"];
  Title: ReturnType<typeof useResponsiveSheet>["Title"];
  Description: ReturnType<typeof useResponsiveSheet>["Description"];
  Footer: ReturnType<typeof useResponsiveSheet>["Footer"];
  Close: ReturnType<typeof useResponsiveSheet>["Close"];
};

const IngredientsFilterSheetContent = ({
  initialIngredients,
  onApply,
  onClose,
  Header,
  Title,
  Description,
  Footer,
  Close,
}: ContentProps) => {
  const selection = useIngredientSelection(initialIngredients);
  const [category, setCategory] = useState("전체");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { searchQuery, inputValue, handleSearchSubmit, handleInputChange } =
    useSearch();

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
    onApply(selection.selectedIds);
    onClose();
  };

  return (
    <>
      <Header className="flex-shrink-0 px-4 pt-4 pb-4 sm:px-6 sm:pt-6">
        <Title className="text-xl font-bold text-gray-900">
          재료로 검색하기
        </Title>
        <Description className="mt-1 text-sm text-gray-500">
          원하는 재료를 선택하면 해당 재료가 포함된 레시피를 찾아드려요
        </Description>
      </Header>

      <div className="flex-shrink-0 space-y-4 px-4 sm:px-6">
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
        className="min-h-0 flex-1 overflow-y-auto px-4 pt-3 sm:px-6"
      >
        <IngredientGrid
          items={items}
          isSelected={selection.isSelected}
          onToggle={selection.toggle}
          loadMoreRef={ref}
          isPending={isPending}
        />
      </div>

      <Footer className="flex flex-shrink-0 gap-3 border-t border-gray-100 px-4 py-4 sm:px-6">
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
            onClick={onClose}
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
    </>
  );
};
