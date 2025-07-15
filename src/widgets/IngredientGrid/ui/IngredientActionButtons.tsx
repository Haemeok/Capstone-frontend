"use client";

import React from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
      <Button variant="outline" onClick={() => router.push("/ingredients/new")}>
        재료 추가
      </Button>
    </div>
  );
};

export default IngredientActionButtons;
