import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { getMyIngredientIds } from "./api";

const STALE_TIME = 5 * 60 * 1000;

export const useMyIngredientIds = () => {
  const query = useQuery({
    queryKey: ["my-ingredient-ids"],
    queryFn: getMyIngredientIds,
    staleTime: STALE_TIME,
  });

  const ingredientIdsSet = useMemo(() => {
    return new Set(query.data ?? []);
  }, [query.data]);

  return {
    ...query,
    ingredientIdsSet,
  };
};
