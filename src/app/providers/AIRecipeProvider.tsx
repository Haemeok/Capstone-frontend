"use client";

import { type PropsWithChildren, useEffect } from "react";

import { useAIRecipeStoreV2 } from "@/features/recipe-create-ai";
import { useAIJobPolling } from "@/features/recipe-create-ai/model/useAIJobPolling";

export const AIRecipeProvider = ({ children }: PropsWithChildren) => {
  const hydrateFromStorage = useAIRecipeStoreV2(
    (state) => state.hydrateFromStorage
  );

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useAIJobPolling();

  return <>{children}</>;
};
