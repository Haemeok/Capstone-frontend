"use client";

import React from "react";
import Link from "next/link";

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
    setIsDeleteMode(!isDeleteMode);
  };

  return (
    <div className="flex items-center gap-2">
      {isDeleteMode && (
        <Button variant="outline" onClick={onToggleSelectAll}>
          {isAllSelected ? "취소" : "전체 선택"}
        </Button>
      )}
      <Button variant="outline" onClick={handleDeleteButtonClick}>
        {isDeleteMode ? "완료" : "재료 삭제"}
      </Button>
      {!isDeleteMode && (
        <Button asChild variant="outline">
          <Link href="/ingredients/new" prefetch={false}>
            재료 추가
          </Link>
        </Button>
      )}
    </div>
  );
};

export default IngredientActionButtons;
