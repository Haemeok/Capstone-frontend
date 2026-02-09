"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import FilterChip from "@/shared/ui/FilterChip";

import { getIngredientNames } from "@/entities/ingredient";

import { useIngredientsFilter } from "../model/useIngredientsFilter";
import { IngredientsFilterSheet } from "./IngredientsFilterSheet";

export const IngredientsFilter = () => {
  const [selectedIngredients, setSavedIngredients] = useIngredientsFilter();
  const [isOpen, setIsOpen] = useState(false);

  const { data: ingredientNames } = useQuery({
    queryKey: ["ingredientNames", selectedIngredients],
    queryFn: () => getIngredientNames(selectedIngredients),
    enabled: selectedIngredients.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const initialIngredients = ingredientNames?.content ?? [];

  const count = selectedIngredients.length;
  const displayText = count > 0 ? `재료 ${count}개` : "재료";

  const handleApply = (selectedIds: string[]) => {
    setSavedIngredients(selectedIds);
  };

  return (
    <>
      <FilterChip
        header={displayText}
        isDirty={count > 0}
        onClick={() => setIsOpen(true)}
      />
      <IngredientsFilterSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        initialIngredients={initialIngredients}
        onApply={handleApply}
      />
    </>
  );
};
