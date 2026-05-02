"use client";

import React from "react";
import Link from "next/link";

import { Trash2 } from "lucide-react";

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
      <div className="flex items-center gap-2">
        <Button
          onClick={handleToggleSelectAll}
          className="h-10 cursor-pointer rounded-xl bg-gray-100 px-4 font-medium text-gray-700 transition-colors active:bg-gray-200"
        >
          {isAllSelected ? "취소" : "전체 선택"}
        </Button>
        <Button
          onClick={handleDeleteButtonClick}
          className="h-10 cursor-pointer rounded-xl bg-olive-light px-4 font-medium text-white transition-colors active:bg-olive-light/90"
        >
          완료
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleDeleteButtonClick}
        className={cn(
          "flex items-center gap-1 cursor-pointer text-sm text-gray-500 transition-colors active:text-gray-700"
        )}
      >
        <Trash2 size={14} />
        <span>삭제</span>
      </button>
      <Button
        asChild
        className="h-10 cursor-pointer rounded-xl bg-olive-light px-4 font-medium text-white transition-colors active:bg-olive-light/90"
      >
        <Link href="/ingredients/new" prefetch={false}>
          재료 추가
        </Link>
      </Button>
    </div>
  );
};

export default IngredientActionButtons;
