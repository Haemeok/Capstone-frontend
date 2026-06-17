"use client";

import React from "react";

import { Trash2 } from "lucide-react";

import { LocalizedLink } from "@/shared/i18n/LocalizedLink";
import { useIngredientsDict } from "@/shared/i18n/useIngredientsDict";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/shadcn/button";

type IngredientActionButtonsProps = {
  isDeleteMode: boolean;
  setIsDeleteMode: (isDeleteMode: boolean) => void;
  onToggleSelectAll?: () => void;
  isAllSelected?: boolean;
};

const IngredientActionButtons = ({
  isDeleteMode,
  setIsDeleteMode,
  onToggleSelectAll,
  isAllSelected,
}: IngredientActionButtonsProps) => {
  const t = useIngredientsDict().actions;

  const handleDeleteButtonClick = () => {
    triggerHaptic("Light");
    setIsDeleteMode(!isDeleteMode);
  };

  const handleToggleSelectAll = () => {
    triggerHaptic("Light");
    onToggleSelectAll?.();
  };

  if (isDeleteMode) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <Button
          onClick={handleToggleSelectAll}
          className="text-ink-sub h-10 cursor-pointer rounded-xl bg-gray-100 px-4 font-medium transition-colors active:bg-gray-200"
        >
          {isAllSelected ? t.cancel : t.selectAll}
        </Button>
        <Button
          onClick={handleDeleteButtonClick}
          className="bg-olive-light active:bg-olive-light/90 h-10 cursor-pointer rounded-xl px-4 font-medium text-white transition-colors"
        >
          {t.done}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-3">
      <button
        type="button"
        onClick={handleDeleteButtonClick}
        className={cn(
          "text-ink-muted active:text-ink-sub flex shrink-0 cursor-pointer items-center gap-1 text-sm whitespace-nowrap transition-colors"
        )}
      >
        <Trash2 size={14} />
        <span>{t.delete}</span>
      </button>
      <Button
        asChild
        className="bg-olive-light active:bg-olive-light/90 h-10 shrink-0 cursor-pointer rounded-xl px-4 font-medium whitespace-nowrap text-white transition-colors"
      >
        <LocalizedLink href="/ingredients/new" prefetch={false}>
          {t.addIngredient}
        </LocalizedLink>
      </Button>
    </div>
  );
};

export default IngredientActionButtons;
