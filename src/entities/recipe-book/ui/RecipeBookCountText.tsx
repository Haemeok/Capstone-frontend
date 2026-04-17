"use client";

import { useDisplayedRecipeCount } from "@/entities/recipe-book/model/hooks/useDisplayedRecipeCount";

import { cn } from "@/shared/lib/utils";

type Props = {
  bookId: string;
  fallback: number;
  className?: string;
};

export const RecipeBookCountText = ({ bookId, fallback, className }: Props) => {
  const count = useDisplayedRecipeCount(bookId, fallback);
  return (
    <span className={cn("text-sm text-gray-500", className)}>{count}개</span>
  );
};
