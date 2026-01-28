"use client";

import { useFilterParam, ingredientsCodec } from "@/shared/lib/filters";

export const useIngredientsFilter = () => {
  return useFilterParam("ingredients", ingredientsCodec);
};
