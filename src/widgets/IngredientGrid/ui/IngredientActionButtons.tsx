"use client";

import React from "react";
import Link from "next/link";

import { Button } from "@/shared/ui/shadcn/button";

type IngredientActionButtonsProps = {
  isDeleteMode: boolean;
  setIsDeleteMode: (isDeleteMode: boolean) => void;
  handleDeleteIngredientBulk: () => void;
};

const IngredientActionButtons = ({
  isDeleteMode,
  setIsDeleteMode,
  handleDeleteIngredientBulk,
}: IngredientActionButtonsProps) => {
  const handleDeleteButtonClick = () => {
    if (isDeleteMode) {
      handleDeleteIngredientBulk();
    }
    setIsDeleteMode(!isDeleteMode);
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={handleDeleteButtonClick}>
        {isDeleteMode ? "완료" : "재료 삭제"}
      </Button>
      <Button asChild variant="outline">
        <Link href="/ingredients/new" prefetch={false}>
          재료 추가
        </Link>
      </Button>
    </div>
  );
};

export default IngredientActionButtons;
