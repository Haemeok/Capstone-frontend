"use client";

import { createContext, ReactNode,useContext, useRef } from "react";

import { Container } from "@/shared/ui/Container";

type RecipeContainerContextValue = {
  observerRef: React.RefObject<HTMLDivElement | null>;
};

const RecipeContainerContext =
  createContext<RecipeContainerContextValue | null>(null);

export function RecipeContainer({ children }: { children: ReactNode }) {
  const observerRef = useRef<HTMLDivElement>(null);

  return (
    <RecipeContainerContext.Provider value={{ observerRef }}>
      <Container>
        <div className="relative flex flex-col pb-10">{children}</div>
      </Container>
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
