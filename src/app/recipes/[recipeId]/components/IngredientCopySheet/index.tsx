"use client";

import { useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { convertIngredientQuantity } from "@/shared/lib/ingredientConversion";

import { Recipe, StaticRecipe } from "@/entities/recipe/model/types";

import { useCopyFeedback } from "./hooks/useCopyFeedback";
import { useCopySelection } from "./hooks/useCopySelection";
import type { CopyMode as CopyModeType } from "./types";
import { ChecklistMode } from "./views/ChecklistMode";
import { CopyMode } from "./views/CopyMode";
import { ModeToggle } from "./views/ModeToggle";
import { ServingsStepper } from "./views/ServingsStepper";

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 20;

type IngredientCopySheetProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe | StaticRecipe;
  currentServings: number;
  servingRatio: number;
  onServingsChange: (servings: number) => void;
  ownedIndices: Set<number>;
};

export const IngredientCopySheet = ({
  isOpen,
  onOpenChange,
  recipe,
  currentServings,
  servingRatio,
  onServingsChange,
  ownedIndices,
}: IngredientCopySheetProps) => {
  const { Container, Content, Header, Title, Description } =
    useResponsiveSheet();

  const [mode, setMode] = useState<CopyModeType>("copy");
  const [checkedIndices, setCheckedIndices] = useState<Set<number>>(new Set());
  const { isCopied, copy } = useCopyFeedback();
  const {
    selectedIndices,
    toggle: toggleSelected,
    selectAll,
    deselectAll,
  } = useCopySelection({
    isOpen,
    totalIngredients: recipe.ingredients.length,
    ownedIndices,
  });

  const ingredients = recipe.ingredients.map((ingredient, index) => {
    const converted = convertIngredientQuantity(
      ingredient.quantity,
      ingredient.unit,
      servingRatio
    );
    const amount =
      converted.quantity !== "약간"
        ? `${converted.quantity}${converted.unit}`
        : "약간";

    return { index, name: ingredient.name, amount };
  });

  const toggleChecked = (index: number) => {
    triggerHaptic("Light");
    setCheckedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const selectedIngredients = ingredients.filter((ing) =>
    selectedIndices.has(ing.index)
  );

  const copyText = (() => {
    if (selectedIngredients.length === 0) return "";
    const header = `📋 ${recipe.title} (${currentServings}인분)`;
    const separator = "ㅡ".repeat(8);
    const list = selectedIngredients
      .map((ing) => `• ${ing.name} ${ing.amount}`)
      .join("\n");
    return `${header}\n${separator}\n${list}`;
  })();

  const handleOpenChange = (open: boolean) => {
    if (!open) setCheckedIndices(new Set());
    onOpenChange(open);
  };

  const handleIncrement = () => {
    triggerHaptic("Light");
    onServingsChange(Math.min(currentServings + 1, MAX_SERVINGS));
  };

  const handleDecrement = () => {
    triggerHaptic("Light");
    onServingsChange(Math.max(currentServings - 1, MIN_SERVINGS));
  };

  return (
    <Container open={isOpen} onOpenChange={handleOpenChange}>
      <Content className="border-0 bg-white shadow-xl">
        <div className="flex max-h-[80vh] flex-col">
          <Header>
            <Title className="text-xl font-bold text-gray-900">
              재료 복사하기
            </Title>
            <Description className="mt-1 text-sm text-gray-500">
              필요한 재료를 골라 장볼 때 사용하세요!
            </Description>
          </Header>

          {/* 모드 토글 + 인분 조절 */}
          <div className="mb-4 flex items-center gap-3 px-6">
            <ModeToggle mode={mode} onChange={setMode} />
            <ServingsStepper
              currentServings={currentServings}
              minServings={MIN_SERVINGS}
              maxServings={MAX_SERVINGS}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          </div>

          {/* 모드별 콘텐츠 */}
          {mode === "copy" ? (
            <CopyMode
              copyText={copyText}
              ingredients={ingredients}
              selectedIndices={selectedIndices}
              selectedCount={selectedIngredients.length}
              isCopied={isCopied}
              onToggle={toggleSelected}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
              onCopy={() => copy(copyText)}
            />
          ) : (
            <ChecklistMode
              ingredients={ingredients}
              checkedIndices={checkedIndices}
              onToggle={toggleChecked}
            />
          )}
        </div>
      </Content>
    </Container>
  );
};
