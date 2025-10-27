"use client";

import { useRef, createContext, useContext, ReactNode } from "react";

type RecipeContainerContextValue = {
  observerRef: React.RefObject<HTMLDivElement | null>;
};

const RecipeContainerContext = createContext<RecipeContainerContextValue | null>(
  null
);

export function RecipeContainer({ children }: { children: ReactNode }) {
  const observerRef = useRef<HTMLDivElement>(null);

  return (
    <RecipeContainerContext.Provider value={{ observerRef }}>
      <div className="relative mx-auto flex flex-col">{children}</div>
    </RecipeContainerContext.Provider>
  );
}

export function useRecipeContainer() {
  const context = useContext(RecipeContainerContext);
  if (!context) {
    throw new Error("useRecipeContainer must be used within RecipeContainer");
  }
  return context;
}
