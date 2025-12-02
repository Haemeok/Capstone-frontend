"use client";

import { useState, useEffect } from "react";

import { Check } from "lucide-react";

import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/shadcn/button";
import { Checkbox } from "@/shared/ui/shadcn/checkbox";

import type { IngredientPack } from "@/shared/config/constants/ingredientPacks";

type IngredientPackDetailDrawerProps = {
  pack: IngredientPack | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSelected: (ingredientIds: number[]) => void;
  onDeleteSelected?: (ingredientIds: number[]) => void;
  isLoading?: boolean;
  ownedIngredientIds: Set<number>;
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
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const allOwned = pack
    ? pack.ingredients.every((ingredient) =>
        ownedIngredientIds.has(ingredient.id)
      )
    : false;

  useEffect(() => {
    if (open && pack) {
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
  }, [open, pack, ownedIngredientIds, allOwned]);

  const handleToggle = (id: number) => {
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
      <Content className="flex h-[80vh] max-h-[800px] w-full flex-col sm:max-w-lg md:max-w-2xl">
        <Header>
          <Title className="text-xl">{pack.name}</Title>
          <Description className="text-md">
            {pack.description} (총 {pack.ingredients.length}개 재료)
          </Description>
        </Header>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSelectAll}
              className="flex-1 cursor-pointer"
            >
              전체 선택
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDeselectAll}
              className="flex-1 cursor-pointer"
            >
              선택 해제
            </Button>
          </div>

          <div className="space-y-2">
            {pack.ingredients.map((ingredient) => {
              const isSelected = selectedIds.has(ingredient.id);
              const isOwned = ownedIngredientIds.has(ingredient.id);
              const isClickable = allOwned ? isOwned : !isOwned;

              return (
                <div
                  key={ingredient.id}
                  className={cn(
                    "flex items-center rounded-lg border p-3 transition-colors",
                    !isClickable
                      ? "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed"
                      : "cursor-pointer",
                    isClickable && isSelected
                      ? allOwned
                        ? "bg-red-50 border-red-400"
                        : "bg-olive-mint/10 border-olive-light"
                      : isClickable && "bg-white border-gray-200 hover:bg-gray-50"
                  )}
                  onClick={() => isClickable && handleToggle(ingredient.id)}
                >
                  <Checkbox
                    id={`ingredient-${ingredient.id}`}
                    checked={isSelected}
                    disabled={!isClickable}
                    onCheckedChange={() => {
                      if (isClickable) {
                        handleToggle(ingredient.id);
                      }
                    }}
                    className={cn(
                      "h-5 w-5 rounded border-gray-300 disabled:cursor-not-allowed cursor-pointer",
                      allOwned
                        ? "data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500"
                        : "data-[state=checked]:border-olive-light data-[state=checked]:bg-olive-light"
                    )}
                  />
                  <label
                    htmlFor={`ingredient-${ingredient.id}`}
                    className={cn(
                      "ml-3 flex-1 text-sm font-medium",
                      isClickable ? "cursor-pointer" : "cursor-not-allowed"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isClickable) {
                        handleToggle(ingredient.id);
                      }
                    }}
                  >
                    {ingredient.name}
                  </label>
                  {!allOwned && isOwned && (
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      보유중
                    </span>
                  )}
                  {isClickable && isSelected && (
                    <Check
                      size={18}
                      className={allOwned ? "text-red-500" : "text-olive-light"}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Footer className="flex-shrink-0 border-t p-4">
          <Button
            onClick={handleSubmit}
            disabled={selectedIds.size === 0 || isLoading}
            className={cn(
              "w-full text-white disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed",
              allOwned
                ? "bg-red-500 hover:bg-red-600"
                : "bg-olive-light hover:bg-olive-dark"
            )}
          >
            {isLoading
              ? allOwned
                ? "삭제 중..."
                : "추가 중..."
              : allOwned
                ? `${selectedIds.size}개 재료 삭제하기`
                : `${selectedIds.size}개 재료 추가하기`}
          </Button>
        </Footer>
      </Content>
    </Container>
  );
};

export default IngredientPackDetailDrawer;
