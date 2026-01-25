"use client";

import React from "react";
import Link from "next/link";

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

  return (
    <div className="flex items-center gap-2">
      {isDeleteMode && (
        <Button
          onClick={handleToggleSelectAll}
          className="h-10 cursor-pointer rounded-xl bg-gray-100 px-4 font-medium text-gray-700 transition-all hover:bg-gray-200 active:scale-[0.98]"
        >
          {isAllSelected ? "취소" : "전체 선택"}
        </Button>
      )}
      <Button
        onClick={handleDeleteButtonClick}
        className={cn(
          "h-10 cursor-pointer rounded-xl px-4 font-medium transition-all active:scale-[0.98]",
          isDeleteMode
            ? "bg-olive-light text-white hover:bg-olive-light/90"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        {isDeleteMode ? "완료" : "재료 삭제"}
      </Button>
      {!isDeleteMode && (
        <Button
          asChild
          className="h-10 cursor-pointer rounded-xl bg-olive-light px-4 font-medium text-white transition-all hover:bg-olive-light/90 active:scale-[0.98]"
        >
          <Link href="/ingredients/new" prefetch={false}>
            재료 추가
          </Link>
        </Button>
      )}
    </div>
  );
};

export default IngredientActionButtons;
