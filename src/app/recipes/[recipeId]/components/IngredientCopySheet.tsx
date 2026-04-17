"use client";

import { useRef, useState } from "react";

import { motion } from "framer-motion";
import { Check, ClipboardList, Copy, Minus, Plus } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { convertIngredientQuantity } from "@/shared/lib/ingredientConversion";
import { cn } from "@/shared/lib/utils";

import { Recipe, StaticRecipe } from "@/entities/recipe/model/types";

import { useToastStore } from "@/widgets/Toast";

type CopyMode = "copy" | "checklist";

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

const computeMissingIndices = (total: number, owned: Set<number>) => {
  const missing = new Set<number>();
  for (let i = 0; i < total; i++) {
    if (!owned.has(i)) missing.add(i);
  }
  return missing;
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
  const { addToast } = useToastStore();

  const [mode, setMode] = useState<CopyMode>("copy");
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(() =>
    computeMissingIndices(recipe.ingredients.length, ownedIndices)
  );
  const [checkedIndices, setCheckedIndices] = useState<Set<number>>(new Set());
  const [isCopied, setIsCopied] = useState(false);
  const copiedTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setSelectedIndices(
        computeMissingIndices(recipe.ingredients.length, ownedIndices)
      );
    }
  }

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

  const toggleSelected = (index: number) => {
    triggerHaptic("Light");
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

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

  const selectAll = () => {
    triggerHaptic("Light");
    setSelectedIndices(new Set(ingredients.map((_, i) => i)));
  };

  const deselectAll = () => {
    triggerHaptic("Light");
    setSelectedIndices(new Set());
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

  const COPIED_FEEDBACK_DURATION_MS = 1500;

  const handleCopy = async () => {
    if (!copyText) return;

    try {
      await navigator.clipboard.writeText(copyText);
      triggerHaptic("Success");
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      setIsCopied(true);
      copiedTimerRef.current = setTimeout(
        () => setIsCopied(false),
        COPIED_FEEDBACK_DURATION_MS
      );
    } catch {
      addToast({ message: "복사에 실패했습니다.", variant: "error" });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCheckedIndices(new Set());
    }
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
          <div className="flex items-center gap-3 px-6 mb-4">
            <div className="relative flex flex-1 gap-1 rounded-full bg-gray-100 p-1">
              <motion.div
                className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-olive-light shadow-sm"
                animate={{ left: mode === "copy" ? 4 : "50%" }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("Light");
                  setMode("copy");
                }}
                className={cn(
                  "relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition-colors",
                  mode === "copy" ? "text-white" : "text-gray-500"
                )}
              >
                <Copy className="h-4 w-4" />
                장보기 복사
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("Light");
                  setMode("checklist");
                }}
                className={cn(
                  "relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition-colors",
                  mode === "checklist" ? "text-white" : "text-gray-500"
                )}
              >
                <ClipboardList className="h-4 w-4" />
                체크리스트
              </button>
            </div>

            {/* 인분 조절 */}
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={currentServings <= MIN_SERVINGS}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                  currentServings > MIN_SERVINGS
                    ? "cursor-pointer bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "cursor-not-allowed bg-gray-50 text-gray-300"
                )}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-12 text-center text-sm font-bold text-gray-800">
                {currentServings}인분
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={currentServings >= MAX_SERVINGS}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                  currentServings < MAX_SERVINGS
                    ? "cursor-pointer bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "cursor-not-allowed bg-gray-50 text-gray-300"
                )}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* 콘텐츠 영역 */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8">
            {mode === "copy" ? (
              <CopyModeContent
                copyText={copyText}
                ingredients={ingredients}
                selectedIndices={selectedIndices}
                onToggle={toggleSelected}
                onSelectAll={selectAll}
                onDeselectAll={deselectAll}
              />
            ) : (
              <ChecklistModeContent
                ingredients={ingredients}
                checkedIndices={checkedIndices}
                onToggle={toggleChecked}
              />
            )}
          </div>

          {/* 하단 액션 */}
          {mode === "copy" && (
            <div className="shrink-0 px-6 pb-8 pt-3">
              <motion.button
                type="button"
                onClick={handleCopy}
                disabled={selectedIngredients.length === 0 || isCopied}
                animate={isCopied ? { scale: [1, 1.03, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold transition-colors",
                  selectedIngredients.length > 0
                    ? "cursor-pointer bg-olive-light text-white shadow-lg hover:shadow-xl active:scale-[0.98]"
                    : "cursor-not-allowed bg-gray-100 text-gray-400"
                )}
              >
                {isCopied ? (
                  <motion.span
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="h-5 w-5" />
                    복사 완료!
                  </motion.span>
                ) : selectedIngredients.length > 0 ? (
                  `${selectedIngredients.length}개 재료 복사하기`
                ) : (
                  "재료를 선택해주세요"
                )}
              </motion.button>
            </div>
          )}
        </div>
      </Content>
    </Container>
  );
};

type Ingredient = { index: number; name: string; amount: string };

type CopyModeContentProps = {
  copyText: string;
  ingredients: Ingredient[];
  selectedIndices: Set<number>;
  onToggle: (index: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
};

const CopyModeContent = ({
  copyText,
  ingredients,
  selectedIndices,
  onToggle,
  onSelectAll,
  onDeselectAll,
}: CopyModeContentProps) => {
  const allSelected = selectedIndices.size === ingredients.length;

  return (
    <div className="space-y-4">
      {/* 미리보기 */}
      <div className="min-h-[100px] rounded-xl bg-gray-50 p-4">
        {copyText ? (
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
            {copyText}
          </pre>
        ) : (
          <p className="text-sm text-gray-400">재료를 선택해주세요</p>
        )}
      </div>

      {/* 전체 선택/해제 */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className="cursor-pointer text-xs font-medium text-gray-400 transition-colors hover:text-gray-600"
        >
          {allSelected ? "전체 해제" : "전체 선택"}
        </button>
      </div>

      {/* 재료 칩 */}
      <div className="flex flex-wrap gap-2">
        {ingredients.map((ing) => {
          const isSelected = selectedIndices.has(ing.index);
          return (
            <button
              key={ing.index}
              type="button"
              onClick={() => onToggle(ing.index)}
              className={cn(
                "cursor-pointer rounded-full border px-3 py-2 text-sm font-medium transition-all active:scale-95",
                isSelected
                  ? "border-olive-light text-olive-light"
                  : "border-gray-200 text-gray-400"
              )}
            >
              {ing.name} {ing.amount}
            </button>
          );
        })}
      </div>
    </div>
  );
};

type ChecklistModeContentProps = {
  ingredients: Ingredient[];
  checkedIndices: Set<number>;
  onToggle: (index: number) => void;
};

const ChecklistModeContent = ({
  ingredients,
  checkedIndices,
  onToggle,
}: ChecklistModeContentProps) => {
  return (
    <div className="space-y-1">
      {ingredients.map((ing) => {
        const isChecked = checkedIndices.has(ing.index);
        return (
          <button
            key={ing.index}
            type="button"
            onClick={() => onToggle(ing.index)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-gray-50"
          >
            <div
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                isChecked
                  ? "border-olive-light bg-olive-light"
                  : "border-gray-300"
              )}
            >
              {isChecked && <Check className="h-3 w-3 text-white" />}
            </div>
            <span
              className={cn(
                "flex-1 text-sm transition-all",
                isChecked
                  ? "text-gray-300 line-through"
                  : "font-medium text-gray-900"
              )}
            >
              {ing.name}
            </span>
            <span
              className={cn(
                "text-sm transition-all",
                isChecked ? "text-gray-300 line-through" : "text-gray-500"
              )}
            >
              {ing.amount}
            </span>
          </button>
        );
      })}
    </div>
  );
};
