"use client";

import { createContext, useContext, ReactNode } from "react";

import { useRecipeStatusQuery } from "@/entities/recipe/model/hooks";
import { RecipeStatus } from "@/entities/recipe/model/types";

type RecipeStatusContextValue = {
  status: RecipeStatus | undefined;
  isLoading: boolean;
  recipeId: string;
};

const RecipeStatusContext = createContext<RecipeStatusContextValue | null>(
  null
);

export function RecipeStatusProvider({
  recipeId,
  children,
}: {
  recipeId: string;
  children: ReactNode;
}) {
  const { data: status, isLoading } = useRecipeStatusQuery(recipeId);

  return (
    <RecipeStatusContext.Provider value={{ status, isLoading, recipeId }}>
      {children}
    </RecipeStatusContext.Provider>
  );
}

export function useRecipeStatus() {
  const context = useContext(RecipeStatusContext);
  if (!context) {
    throw new Error("useRecipeStatus must be used within RecipeStatusProvider");
  }
  return context;
}
