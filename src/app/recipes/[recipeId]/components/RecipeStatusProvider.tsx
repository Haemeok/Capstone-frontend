"use client";

import { createContext, useContext, ReactNode } from "react";

import { useRecipeStatusQuery } from "@/entities/recipe/model/hooks";
import { RecipeStatus } from "@/entities/recipe/model/types";

type RecipeStatusContextValue = {
  status: RecipeStatus | undefined;
  isLoading: boolean;
};

const RecipeStatusContext = createContext<RecipeStatusContextValue | null>(
  null
);

export function RecipeStatusProvider({
  recipeId,
  children,
}: {
  recipeId: number;
  children: ReactNode;
}) {
  const { data: status, isLoading } = useRecipeStatusQuery(recipeId);

  return (
    <RecipeStatusContext.Provider value={{ status, isLoading }}>
      {children}
    </RecipeStatusContext.Provider>
  );
}

export function useRecipeStatus() {
  const context = useContext(RecipeStatusContext);
  if (!context) {
    throw new Error(
      "useRecipeStatus must be used within RecipeStatusProvider"
    );
  }
  return context;
}
