"use client";

import { useState } from "react";

import { Check } from "lucide-react";

import type { IngredientPack } from "@/shared/config/constants/ingredientPacks";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/shadcn/button";

type IngredientPackDetailDrawerProps = {
  pack: IngredientPack | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSelected: (ingredientIds: string[]) => void;
  onDeleteSelected?: (ingredientIds: string[]) => void;
  isLoading?: boolean;
  ownedIngredientIds: Set<string>;
};

const IngredientPackDetailDrawer = ({
  pack,
  open,
  onOpenChange,
  onAddSelected,
  onDeleteSelected,
  isLoading = false,
  ownedIngredientIds,
}: IngredientPackDetailDrawerProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allOwned = pack
    ? pack.ingredients.every((ingredient) =>
        ownedIngredientIds.has(ingredient.id)
      )
    : false;

  const [prevSync, setPrevSync] = useState({
    open,
    pack,
    ownedIngredientIds,
    allOwned,
  });

  if (
    prevSync.open !== open ||
    prevSync.pack !== pack ||
    prevSync.ownedIngredientIds !== ownedIngredientIds ||
    prevSync.allOwned !== allOwned
  ) {
    setPrevSync({ open, pack, ownedIngredientIds, allOwned });
    if (open && pack) {
      const nextIds = pack.ingredients
        .filter((ingredient) =>
          allOwned
            ? ownedIngredientIds.has(ingredient.id)
            : !ownedIngredientIds.has(ingredient.id)
        )
        .map((ingredient) => ingredient.id);
      setSelectedIds(new Set(nextIds));
    }
  }

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (pack) {
      if (allOwned) {
        const ownedIds = pack.ingredients
          .filter((ingredient) => ownedIngredientIds.has(ingredient.id))
          .map((ingredient) => ingredient.id);
        setSelectedIds(new Set(ownedIds));
      } else {
        const availableIds = pack.ingredients
          .filter((ingredient) => !ownedIngredientIds.has(ingredient.id))
          .map((ingredient) => ingredient.id);
        setSelectedIds(new Set(availableIds));
      }
    }
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleSubmit = () => {
    if (allOwned && onDeleteSelected) {
      onDeleteSelected(Array.from(selectedIds));
    } else {
      onAddSelected(Array.from(selectedIds));
    }
    setSelectedIds(new Set());
    onOpenChange(false);
  };

  const { Container, Content, Header, Title, Description, Footer } =
    useResponsiveSheet();

  if (!pack) return null;

  return (
    <Container open={open} onOpenChange={onOpenChange}>
      <Content className="flex h-[80vh] max-h-[800px] w-full flex-col md:max-w-2xl">
        <Header>
          <Title className="text-base font-bold text-gray-900">
            {pack.name}
          </Title>
          <Description className="text-sm text-gray-500">
            {pack.description} · 총 {pack.ingredients.length}개
          </Description>
        </Header>

        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-xs text-gray-500">
              {selectedIds.size}개 선택됨
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs font-medium text-gray-600 transition-colors active:text-gray-900"
              >
                전체 선택
              </button>
              <span className="text-xs text-gray-300" aria-hidden="true">
                |
              </span>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="text-xs font-medium text-gray-600 transition-colors active:text-gray-900"
              >
                선택 해제
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            {pack.ingredients.map((ingredient) => {
              const isSelected = selectedIds.has(ingredient.id);
              const isOwned = ownedIngredientIds.has(ingredient.id);
              const isClickable = allOwned ? isOwned : !isOwned;

              return (
                <button
                  type="button"
                  key={ingredient.id}
                  disabled={!isClickable}
                  aria-pressed={isSelected}
                  onClick={() => isClickable && handleToggle(ingredient.id)}
                  className={cn(
                    "flex w-full items-center rounded-xl px-3.5 py-3 text-left transition-colors",
                    isSelected ? "bg-gray-50" : "bg-white",
                    isClickable
                      ? "active:bg-gray-100"
                      : "cursor-not-allowed opacity-50"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                      isSelected
                        ? "border-olive-light bg-olive-light text-white"
                        : "border-gray-300 bg-white"
                    )}
                  >
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </span>
                  <span className="ml-3 flex-1 text-sm font-medium text-gray-900">
                    {ingredient.name}
                  </span>
                  {!allOwned && isOwned && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      보유중
                    </span>
                  )}
                  {isClickable && isSelected && (
                    <Check
                      size={18}
                      className="text-olive-light ml-2"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <Footer className="flex-shrink-0 border-t border-gray-100 p-4">
          <Button
            onClick={handleSubmit}
            disabled={selectedIds.size === 0 || isLoading}
            className={cn(
              "h-12 w-full rounded-xl text-base font-bold transition-colors disabled:cursor-not-allowed disabled:border-0 disabled:bg-gray-100 disabled:text-gray-400",
              allOwned
                ? "border border-gray-200 bg-white text-gray-900 active:bg-gray-50"
                : "bg-olive-light active:bg-olive-dark text-white"
            )}
          >
            {isLoading
              ? allOwned
                ? "삭제 중..."
                : "추가 중..."
              : allOwned
                ? `${selectedIds.size}개 삭제하기`
                : `${selectedIds.size}개 추가하기`}
          </Button>
        </Footer>
      </Content>
    </Container>
  );
};

export default IngredientPackDetailDrawer;
