"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { useQuery } from "@tanstack/react-query";

import { useChromeLocale } from "@/shared/i18n";
import { recipeDetail as recipeDetailEn } from "@/shared/i18n/messages/en/recipeDetail";
import { recipeDetail as recipeDetailJa } from "@/shared/i18n/messages/ja/recipeDetail";
import { recipeDetail as recipeDetailKo } from "@/shared/i18n/messages/ko/recipeDetail";
import type { Locale } from "@/shared/i18n/types";
import FilterChip from "@/shared/ui/FilterChip";

import { getIngredientNames } from "@/entities/ingredient";

import { useIngredientsFilter } from "../model/useIngredientsFilter";

const INGREDIENTS_LABEL: Record<Locale, string> = {
  ko: recipeDetailKo.ingredientsHeader,
  ja: recipeDetailJa.ingredientsHeader,
  en: recipeDetailEn.ingredientsHeader,
};

const COUNT_SUFFIX: Record<Locale, string> = { ko: "개", ja: "", en: "" };

const IngredientsFilterSheet = dynamic(
  () =>
    import("./IngredientsFilterSheet").then((m) => ({
      default: m.IngredientsFilterSheet,
    })),
  { ssr: false }
);

export const IngredientsFilter = () => {
  const [selectedIngredients, setSavedIngredients] = useIngredientsFilter();
  const [isOpen, setIsOpen] = useState(false);
  const locale = useChromeLocale();

  const { data: ingredientNames } = useQuery({
    queryKey: ["ingredientNames", selectedIngredients],
    queryFn: () => getIngredientNames(selectedIngredients),
    enabled: selectedIngredients.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const initialIngredients = ingredientNames?.content ?? [];

  const count = selectedIngredients.length;
  const ingredientsLabel = INGREDIENTS_LABEL[locale];
  const displayText =
    count > 0
      ? `${ingredientsLabel} ${count}${COUNT_SUFFIX[locale]}`
      : ingredientsLabel;

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
