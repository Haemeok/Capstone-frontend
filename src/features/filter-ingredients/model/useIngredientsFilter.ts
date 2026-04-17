"use client";

import { ingredientsCodec,useFilterParam } from "@/shared/lib/filters";

export const useIngredientsFilter = () => {
  return useFilterParam("ingredients", ingredientsCodec);
};
