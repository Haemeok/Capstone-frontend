"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { format, useT } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";

import type { Ingredient } from "../types";

type CopyModeProps = {
  copyText: string;
  ingredients: Ingredient[];
  selectedIndices: Set<number>;
  selectedCount: number;
  isCopied: boolean;
  onToggle: (index: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onCopy: () => void;
};

export const CopyMode = ({
  copyText,
  ingredients,
  selectedIndices,
  selectedCount,
  isCopied,
  onToggle,
  onSelectAll,
  onDeselectAll,
  onCopy,
}: CopyModeProps) => {
  const allSelected = selectedIndices.size === ingredients.length;
  const t = useT();

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8">
        <div className="space-y-4">
          {/* 미리보기 */}
          <div className="min-h-[100px] rounded-xl bg-gray-50 p-4">
            {copyText ? (
              <pre className="text-ink-sub font-sans text-sm whitespace-pre-wrap">
                {copyText}
              </pre>
            ) : (
              <p className="text-sm text-gray-400">
                {t.ingredientSheet.copyPreviewEmpty}
              </p>
            )}
          </div>

          {/* 전체 선택/해제 */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={allSelected ? onDeselectAll : onSelectAll}
              className="hover:text-ink-sub cursor-pointer text-xs font-medium text-gray-400 transition-colors"
            >
              {allSelected
                ? t.ingredientSheet.deselectAll
                : t.ingredientSheet.selectAll}
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
      </div>

      {/* 하단 액션 */}
      <div className="shrink-0 px-6 pt-3 pb-8">
        <motion.button
          type="button"
          onClick={onCopy}
          disabled={selectedCount === 0 || isCopied}
          animate={isCopied ? { scale: [1, 1.03, 1] } : {}}
          transition={{ duration: 0.3 }}
          className={cn(
            "flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold transition-colors",
            selectedCount > 0
              ? "bg-olive-light cursor-pointer text-white shadow-lg hover:shadow-xl active:scale-[0.98]"
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
              {t.ingredientSheet.copied}
            </motion.span>
          ) : selectedCount > 0 ? (
            format(t.ingredientSheet.copyButton, { n: selectedCount })
          ) : (
            t.ingredientSheet.copyButtonEmpty
          )}
        </motion.button>
      </div>
    </>
  );
};
