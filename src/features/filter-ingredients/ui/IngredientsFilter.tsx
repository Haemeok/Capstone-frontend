"use client";

import { useState } from "react";

import FilterChip from "@/shared/ui/FilterChip";

import { useIngredientsFilter } from "../model/useIngredientsFilter";
import { IngredientsFilterSheet } from "./IngredientsFilterSheet";

export const IngredientsFilter = () => {
  const [selectedIngredients] = useIngredientsFilter();
  const [isOpen, setIsOpen] = useState(false);

  const count = selectedIngredients.length;
  const displayText = count > 0 ? `재료 ${count}개` : "재료";

  return (
    <>
      <FilterChip
        header={displayText}
        isDirty={count > 0}
        onClick={() => setIsOpen(true)}
      />
      <IngredientsFilterSheet open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};
