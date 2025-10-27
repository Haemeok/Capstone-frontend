"use client";

import { useRef, createContext, useContext, ReactNode } from "react";

type RecipeContainerContextValue = {
  imageRef: React.RefObject<HTMLImageElement | null>;
  observerRef: React.RefObject<HTMLDivElement | null>;
};

const RecipeContainerContext = createContext<RecipeContainerContextValue | null>(
  null
);

export function RecipeContainer({ children }: { children: ReactNode }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  return (
    <RecipeContainerContext.Provider value={{ imageRef, observerRef }}>
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
