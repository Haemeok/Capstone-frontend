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
  isLoading?: boolean;
};

const IngredientPackDetailDrawer = ({
  pack,
  open,
  onOpenChange,
  onAddSelected,
  isLoading = false,
}: IngredientPackDetailDrawerProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (open && pack) {
      const ingredientIds = pack.ingredients.map((ingredient) => ingredient.id);
      setSelectedIds(new Set(ingredientIds));
    }
  }, [open, pack]);

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
      const ingredientIds = pack.ingredients.map((ingredient) => ingredient.id);
      setSelectedIds(new Set(ingredientIds));
    }
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleAdd = () => {
    onAddSelected(Array.from(selectedIds));
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
              className="flex-1"
            >
              전체 선택
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDeselectAll}
              className="flex-1"
            >
              선택 해제
            </Button>
          </div>

          <div className="space-y-2">
            {pack.ingredients.map((ingredient) => {
              const isSelected = selectedIds.has(ingredient.id);

              return (
                <div
                  key={ingredient.id}
                  onClick={() => handleToggle(ingredient.id)}
                  className={cn(
                    "flex items-center rounded-lg border p-3 cursor-pointer transition-colors",
                    isSelected
                      ? "bg-olive-mint/10 border-olive-light"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <Checkbox
                    id={`ingredient-${ingredient.id}`}
                    checked={isSelected}
                    onCheckedChange={() => handleToggle(ingredient.id)}
                    className="h-5 w-5 rounded border-gray-300 data-[state=checked]:border-olive-light data-[state=checked]:bg-olive-light"
                  />
                  <label
                    htmlFor={`ingredient-${ingredient.id}`}
                    className="ml-3 flex-1 cursor-pointer text-sm font-medium"
                  >
                    {ingredient.name}
                  </label>
                  {isSelected && (
                    <Check size={18} className="text-olive-light" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Footer className="flex-shrink-0 border-t p-4">
          <Button
            onClick={handleAdd}
            disabled={selectedIds.size === 0 || isLoading}
            className="w-full bg-olive-light text-white hover:bg-olive-dark disabled:bg-gray-300"
          >
            {isLoading ? "추가 중..." : `${selectedIds.size}개 재료 추가하기`}
          </Button>
        </Footer>
      </Content>
    </Container>
  );
};

export default IngredientPackDetailDrawer;
